"use client";

/**
 * INT-03: store phía client là nguồn duy nhất cho tiến độ người học trong mockup
 * (hoàn thành bài, lượt làm bài, yêu thích, thông báo, phiên đăng nhập). Mọi màn đọc cùng store
 * nên số liệu không lệch. Lưu ở localStorage. Khôi phục dữ liệu ban đầu: thêm ?reset=1 vào URL bất kỳ.
 * Khi nối Moodle thật: thay các action bằng lời gọi WS tương ứng (ghi trong comment từng action).
 */
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import {
  buildAllCourses,
  buildQuizList,
  findModule,
  getCourseInfo,
  getQuestions,
  getQuiz,
  gradeAnswers,
  sectionShortName,
  summarizeQuiz,
  type CourseView,
  type LearnerState,
  type QuizDraft,
  type QuizListItem,
} from "@/lib/learning";
import { nowSeconds } from "@/lib/mock/time";
import type { CourseModule, Notification, StoredAttempt } from "@/types/moodle";
import { createSeedState } from "./seed";

const STATE_KEY = "vigo-lms:state:v1";
export const VIDEO_KEY_PREFIX = "vigo-lms:video:";

// ---------- External store ----------

let current: LearnerState | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function clearStorage() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("vigo-lms:"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* localStorage bị chặn: bỏ qua */
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const url = new URL(window.location.href);
  if (url.searchParams.get("reset") === "1") {
    clearStorage();
    url.searchParams.delete("reset");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    current = createSeedState();
    persist();
    return;
  }
  try {
    const raw = localStorage.getItem(STATE_KEY);
    const parsed = raw ? (JSON.parse(raw) as LearnerState) : null;
    current = parsed?.v === 1 ? parsed : createSeedState();
  } catch {
    current = createSeedState();
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== STATE_KEY || !e.newValue) return;
    try {
      current = JSON.parse(e.newValue) as LearnerState;
      listeners.forEach((l) => l());
    } catch {
      /* bỏ qua dữ liệu hỏng từ tab khác */
    }
  });
}

function persist() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(current));
  } catch {
    /* hết dung lượng hoặc bị chặn */
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return current;
}

function getServerSnapshot() {
  return null;
}

let notiSeq = 0;
function newNotification(subject: string, smallmessage: string, contexturl: string, component: string): Notification {
  notiSeq += 1;
  return { id: Date.now() * 10 + notiSeq, subject, smallmessage, contexturl, timecreated: nowSeconds(), read: false, component };
}

/** Sau mỗi thay đổi tiến độ: ghi nhận khóa mới hoàn thành, sinh thông báo chứng nhận và khóa kế tiếp được mở */
function withCompletionEvents(prev: LearnerState, next: LearnerState): LearnerState {
  const before = buildAllCourses(prev);
  const after = buildAllCourses(next);
  const extra: Notification[] = [];
  const courseCompleted = { ...next.courseCompleted };
  for (const v of after) {
    const old = before.find((b) => b.info.id === v.info.id)!;
    if (v.status === "completed" && old.status !== "completed" && !courseCompleted[v.info.id]) {
      courseCompleted[v.info.id] = nowSeconds();
      extra.push(
        newNotification(
          `Chứng nhận mới: ${v.info.fullname}`,
          "Chúc mừng bạn đã hoàn thành khóa học. Chứng nhận đã sẵn sàng để tải xuống.",
          `/certificates/${v.info.id}`,
          "core_completion",
        ),
      );
    }
    if (old.locked && !v.locked) {
      extra.push(
        newNotification(
          `Khóa học mới đã mở: ${v.info.fullname}`,
          `Bạn đã hoàn thành ${v.prerequisite?.fullname}. Khóa tiếp theo trong lộ trình đã sẵn sàng.`,
          `/courses/${v.info.id}`,
          "core_course",
        ),
      );
    }
  }
  if (!extra.length) return next;
  return { ...next, courseCompleted, notifications: [...extra.reverse(), ...next.notifications] };
}

function update(fn: (s: LearnerState) => LearnerState, track = false) {
  if (!current) return;
  const prev = current;
  const next = fn(prev);
  if (next === prev) return;
  current = track ? withCompletionEvents(prev, next) : next;
  persist();
  listeners.forEach((l) => l());
}

// ---------- Actions ----------

/** Tài khoản bắt đổi mật khẩu lần đầu (AUTH-05) */
export const FORCE_CHANGE_USERNAME = "nhanvienmoi";

const actions = {
  /** AUTH-01/02: login/token.php. Mockup nhận mọi tài khoản, mật khẩu không rỗng. */
  login(username: string, via: "password" | "google") {
    const name = username.trim().toLowerCase();
    update((s) => ({ ...s, session: { username: name, via, at: nowSeconds() } }));
    return { mustChangePassword: name === FORCE_CHANGE_USERNAME && !current?.passwordChanged.includes(name) };
  },
  /** AUTH-04: xóa token phía client */
  logout() {
    update((s) => ({ ...s, session: null }));
  },
  /** AUTH-05, PROF-03: chưa có WS core, bản thật chuyển sang trang đổi mật khẩu của Moodle */
  changePassword() {
    update((s) =>
      s.session && !s.passwordChanged.includes(s.session.username)
        ? { ...s, passwordChanged: [...s.passwordChanged, s.session.username] }
        : s,
    );
  },
  /** LEARN-10: mod_*_view_* khi mở bài. Page hoàn thành khi xem (completion view). */
  viewModule(courseId: number, m: CourseModule) {
    update(
      (s) => ({
        ...s,
        lastAccess: { ...s.lastAccess, [courseId]: nowSeconds() },
        lastModule: { ...s.lastModule, [courseId]: m.id },
        completions:
          m.modname === "page" && m.completion === 2 && s.completions[m.id] == null
            ? { ...s.completions, [m.id]: nowSeconds() }
            : s.completions,
      }),
      true,
    );
  },
  /** Hoàn thành tự động: video xem tới 90%, mở link ngoài */
  completeModule(cmid: number) {
    update((s) => (s.completions[cmid] != null ? s : { ...s, completions: { ...s.completions, [cmid]: nowSeconds() } }), true);
  },
  /** LEARN-09: core_completion_update_activity_completion_status_manually */
  setManualCompletion(cmid: number, done: boolean) {
    update((s) => {
      const completions = { ...s.completions };
      if (done) completions[cmid] = nowSeconds();
      else delete completions[cmid];
      return { ...s, completions };
    }, true);
  },
  /** QUIZ-02: mod_quiz_start_attempt */
  startAttempt(cmid: number) {
    update((s) => {
      if (s.drafts[cmid]) return s;
      const draft: QuizDraft = { attempt: (s.attempts[cmid]?.length ?? 0) + 1, timestart: nowSeconds(), answers: {}, current: 1 };
      const info = findModule(cmid);
      return {
        ...s,
        drafts: { ...s.drafts, [cmid]: draft },
        lastAccess: info ? { ...s.lastAccess, [info.courseId]: nowSeconds() } : s.lastAccess,
        lastModule: info ? { ...s.lastModule, [info.courseId]: cmid } : s.lastModule,
      };
    });
  },
  /** QUIZ-02: mod_quiz_save_attempt (tự lưu) */
  saveDraft(cmid: number, patch: Partial<Pick<QuizDraft, "answers" | "current">>) {
    update((s) => (s.drafts[cmid] ? { ...s, drafts: { ...s.drafts, [cmid]: { ...s.drafts[cmid], ...patch } } } : s));
  },
  /** QUIZ-04/05/06: mod_quiz_process_attempt (finishattempt=1) */
  submitAttempt(cmid: number): StoredAttempt | undefined {
    const s = current;
    const draft = s?.drafts[cmid];
    const quiz = getQuiz(cmid);
    if (!s || !draft || !quiz) return undefined;
    const before = summarizeQuiz(s, cmid)!;
    const { sumgrades, grade } = gradeAnswers(getQuestions(cmid), draft.answers, quiz);
    const finish = Math.min(nowSeconds(), quiz.timelimit ? draft.timestart + quiz.timelimit : nowSeconds());
    const result: StoredAttempt = {
      id: cmid * 10 + draft.attempt,
      quiz: quiz.id,
      attempt: draft.attempt,
      state: "finished",
      timestart: draft.timestart,
      timefinish: Math.max(finish, draft.timestart + 1),
      sumgrades,
      grade,
      answers: draft.answers,
    };
    update((st) => {
      const drafts = { ...st.drafts };
      delete drafts[cmid];
      let notifications = st.notifications;
      if (!before.passed && grade >= quiz.gradepass) {
        const info = findModule(cmid)!;
        const course = getCourseInfo(info.courseId)!;
        const sections = buildAllCourses(st).find((v) => v.info.id === info.courseId)!.sections;
        const nextSection = sections.find((x) => x.section === info.section.section + 1);
        notifications = [
          newNotification(
            `Bạn đã đạt ${quiz.name}`,
            `${course.fullname}: điểm ${formatGrade(grade)}/${quiz.grade}.${nextSection ? ` ${sectionShortName(nextSection)} đã được mở.` : ""}`,
            `/courses/${course.id}`,
            "mod_quiz",
          ),
          ...notifications,
        ];
      }
      return { ...st, drafts, notifications, attempts: { ...st.attempts, [cmid]: [...(st.attempts[cmid] ?? []), result] } };
    }, true);
    return result;
  },
  /** COURSE-04: core_course_set_favourite_courses */
  toggleFavourite(courseId: number) {
    update((s) => ({
      ...s,
      favourites: s.favourites.includes(courseId) ? s.favourites.filter((id) => id !== courseId) : [...s.favourites, courseId],
    }));
  },
  /** NOTI-02: core_message_mark_notification_read */
  markRead(id: number) {
    update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  },
  /** NOTI-02: core_message_mark_all_notifications_as_read */
  markAllRead() {
    update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },
};

export function formatGrade(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, "").replace(".", ",");
}

// ---------- React context ----------

export interface LearningContextValue {
  ready: boolean;
  state: LearnerState | null;
  courses: CourseView[];
  quizzes: QuizListItem[];
  unread: number;
  actions: typeof actions;
  course: (id: number) => CourseView | undefined;
}

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo<LearningContextValue>(() => {
    const views = state ? buildAllCourses(state) : [];
    return {
      ready: !!state,
      state,
      courses: views,
      quizzes: state ? buildQuizList(state, views) : [],
      unread: state ? state.notifications.filter((n) => !n.read).length : 0,
      actions,
      course: (id: number) => views.find((v) => v.info.id === id),
    };
  }, [state]);
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning phải nằm trong LearningProvider");
  return ctx;
}
