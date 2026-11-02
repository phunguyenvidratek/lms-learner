/**
 * INT-03: một nguồn tính duy nhất cho tiến độ, trạng thái khóa, khóa phần và kết quả bài kiểm tra.
 * Hàm thuần: nhận nội dung khóa (phía Moodle) + trạng thái người học (store phía client)
 * và trả dữ liệu đúng hình dạng Moodle (completiondata, uservisible, availabilityinfo).
 * Khi nối Moodle thật, phần lớn giá trị ở đây do Moodle trả, chỉ còn lại phần trình bày.
 */
import { courseContents, courses, learningPaths, quizzes } from "@/lib/mock/data";
import { quizQuestions } from "@/lib/mock/questions";
import type {
  CourseInfo,
  CourseModule,
  CourseSection,
  Notification,
  Quiz,
  QuizQuestion,
  StoredAttempt,
} from "@/types/moodle";

// ---------- Trạng thái người học ----------

export interface Session {
  username: string;
  via: "password" | "google";
  at: number;
}

export interface QuizDraft {
  attempt: number;
  timestart: number;
  answers: Record<number, string[]>;
  current: number;
}

export interface LearnerState {
  v: 1;
  session: Session | null;
  /** AUTH-05: tài khoản đã đổi mật khẩu lần đầu */
  passwordChanged: string[];
  /** cmid -> thời điểm hoàn thành (module không phải quiz) */
  completions: Record<number, number>;
  /** quiz cmid -> các lượt đã nộp */
  attempts: Record<number, StoredAttempt[]>;
  /** quiz cmid -> lượt đang làm (tự lưu) */
  drafts: Record<number, QuizDraft>;
  favourites: number[];
  notifications: Notification[];
  lastAccess: Record<number, number>;
  lastModule: Record<number, number>;
  /** courseid -> thời điểm đạt course completion (dùng cấp chứng nhận) */
  courseCompleted: Record<number, number>;
}

// ---------- Hằng số và tra cứu ----------

/** CDET-05: module không hiện với người học hoặc không phải "một bài" */
const NOT_A_LESSON = new Set(["qbank", "label", "forum"]);

export type CourseStatus = "notstarted" | "inprogress" | "completed";

export function getCourseInfo(courseId: number): CourseInfo | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getQuiz(cmid: number): Quiz | undefined {
  return quizzes.find((q) => q.coursemodule === cmid);
}

export function getQuestions(cmid: number): QuizQuestion[] {
  return quizQuestions[cmid] ?? [];
}

export function findModule(cmid: number) {
  for (const [courseId, sections] of Object.entries(courseContents)) {
    for (const section of sections) {
      const module = section.modules.find((m) => m.id === cmid);
      if (module) return { courseId: Number(courseId), section, module };
    }
  }
  return undefined;
}

export function moduleHref(courseId: number, m: Pick<CourseModule, "id" | "modname">) {
  return m.modname === "quiz" ? `/quiz/${m.id}` : `/learn/${courseId}/${m.id}`;
}

/** Thứ tự phần học: "Phần 2: ..." -> "Phần 2" */
export function sectionShortName(section: Pick<CourseSection, "name" | "section">) {
  return section.name.split(":")[0] || `Phần ${section.section}`;
}

// ---------- Chấm điểm quiz ----------

/** Điểm 1 câu trên thang 0..1. Chọn nhiều: cộng theo đáp án đúng, trừ theo đáp án sai, không âm. */
export function questionScore(q: QuizQuestion, selected: string[] = []): number {
  const correct = q.correct ?? [];
  if (q.type !== "multichoiceset") return selected.length === 1 && selected[0] === correct[0] ? 1 : 0;
  if (!correct.length) return 0;
  const right = selected.filter((s) => correct.includes(s)).length;
  const wrong = selected.length - right;
  return Math.max(0, Math.round(((right - wrong) / correct.length) * 100) / 100);
}

export function gradeAnswers(questions: QuizQuestion[], answers: Record<number, string[]>, quiz: Quiz) {
  const sumgrades = questions.reduce((s, q) => s + questionScore(q, answers[q.slot]), 0);
  const grade = questions.length ? Math.round((sumgrades / questions.length) * quiz.grade * 100) / 100 : 0;
  return { sumgrades: Math.round(sumgrades * 100) / 100, grade };
}

export type QuizState = "locked" | "notstarted" | "inprogress" | "passed" | "failed" | "exhausted";

export interface QuizSummary {
  quiz: Quiz;
  attempts: StoredAttempt[];
  best: number | null;
  passed: boolean;
  attemptsLeft: number;
  draft?: QuizDraft;
  state: QuizState;
}

export function summarizeQuiz(state: LearnerState, cmid: number, locked = false): QuizSummary | undefined {
  const quiz = getQuiz(cmid);
  if (!quiz) return undefined;
  const attempts = state.attempts[cmid] ?? [];
  const best = attempts.length ? Math.max(...attempts.map((a) => a.grade)) : null;
  const passed = best !== null && best >= quiz.gradepass;
  const attemptsLeft = quiz.attempts ? Math.max(0, quiz.attempts - attempts.length) : Infinity;
  const draft = state.drafts[cmid];
  let s: QuizState;
  if (passed) s = "passed";
  else if (locked) s = "locked";
  else if (draft) s = "inprogress";
  else if (!attempts.length) s = "notstarted";
  else if (attemptsLeft === 0) s = "exhausted";
  else s = "failed";
  return { quiz, attempts, best, passed, attemptsLeft, draft, state: s };
}

// ---------- Dựng khóa học theo người học ----------

export interface CourseView {
  info: CourseInfo;
  sections: CourseSection[];
  progress: number;
  done: number;
  total: number;
  status: CourseStatus;
  locked: boolean;
  /** HTML ngắn, ví dụ "Mở sau khi hoàn thành khóa <strong>...</strong>" */
  lockReason?: string;
  prerequisite?: CourseInfo;
  completedAt?: number;
  lastaccess?: number;
  isfavourite: boolean;
  next?: CourseModule;
  /** Danh sách bài theo thứ tự để đi Trước/Tiếp (LEARN-11) */
  playable: CourseModule[];
  counts: { videos: number; pages: number; files: number; urls: number; quizzes: number; lessons: number; duration: number };
  quizzesPassed: number;
}

export function isTracked(m: CourseModule) {
  return m.completion > 0 && !NOT_A_LESSON.has(m.modname);
}

function isDone(state: LearnerState, m: CourseModule) {
  if (m.modname === "quiz") return summarizeQuiz(state, m.id)?.passed ?? false;
  return state.completions[m.id] != null;
}

/** CDET-05: module hiện trong outline (label vẫn hiện inline, forum chuyển sang tab, qbank ẩn) */
export function learnerModules(section: CourseSection): CourseModule[] {
  return section.modules.filter((m) => m.modname !== "qbank" && m.modname !== "forum");
}

export function sectionProgress(section: CourseSection) {
  const tracked = section.modules.filter(isTracked);
  const done = tracked.filter((m) => m.completiondata && m.completiondata.state > 0 && m.completiondata.state !== 3).length;
  const duration = section.modules.reduce((s, m) => s + (m.customdata_duration ?? 0), 0);
  return { done, total: tracked.length, duration };
}

export function prerequisiteOf(courseId: number): CourseInfo | undefined {
  for (const path of learningPaths) {
    const i = path.steps.findIndex((s) => s.courseid === courseId);
    if (i > 0) return getCourseInfo(path.steps[i - 1].courseid);
  }
  return undefined;
}

function buildCourse(state: LearnerState, info: CourseInfo, completedSet: Set<number>): CourseView {
  const raw = courseContents[info.id] ?? [];
  const prerequisite = prerequisiteOf(info.id);
  const courseLocked = !!prerequisite && !completedSet.has(prerequisite.id);
  const lockReason = courseLocked ? `Mở sau khi hoàn thành khóa <strong>${prerequisite!.fullname}</strong>` : undefined;

  let prevQuiz: { section: CourseSection; passed: boolean; locked: boolean } | null = null;
  const sections: CourseSection[] = raw.map((section) => {
    let locked = courseLocked;
    let availabilityinfo: string | null = courseLocked ? lockReason! : null;
    if (!courseLocked && section.section > 1 && prevQuiz && (!prevQuiz.passed || prevQuiz.locked)) {
      locked = true;
      availabilityinfo = `Cần đạt 8/10 bài kiểm tra <strong>${sectionShortName(prevQuiz.section)}</strong>`;
    }
    const modules = section.modules.map<CourseModule>((m) => {
      const tracked = isTracked(m);
      let completiondata: CourseModule["completiondata"];
      if (tracked) {
        let st: 0 | 1 | 2 | 3 = 0;
        let timecompleted = 0;
        if (m.modname === "quiz") {
          const qs = summarizeQuiz(state, m.id)!;
          if (qs.passed) {
            st = 2;
            timecompleted = qs.attempts.find((a) => a.grade >= qs.quiz.gradepass)?.timefinish ?? 0;
          } else if (qs.attempts.length) st = 3;
        } else if (state.completions[m.id] != null) {
          st = 1;
          timecompleted = state.completions[m.id];
        }
        completiondata = { state: st, timecompleted, tracking: m.completion === 1 ? 1 : 2, isautomatic: m.completion === 2 };
      }
      return { ...m, uservisible: !locked, availabilityinfo: locked ? availabilityinfo : null, completiondata };
    });
    const quizModule = section.modules.find((m) => m.modname === "quiz");
    if (quizModule) prevQuiz = { section, passed: isDone(state, quizModule), locked };
    return { ...section, uservisible: !locked, availabilityinfo, modules };
  });

  const all = sections.flatMap((s) => s.modules);
  const tracked = all.filter(isTracked);
  const done = tracked.filter((m) => isDone(state, m)).length;
  const total = tracked.length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const completed = total > 0 && done === total;
  const playable = sections
    .filter((s) => s.uservisible)
    .flatMap((s) => s.modules)
    .filter((m) => m.uservisible && !NOT_A_LESSON.has(m.modname));
  const next = playable.find((m) => isTracked(m) && !isDone(state, m)) ?? playable[0];
  const lessons = all.filter((m) => !NOT_A_LESSON.has(m.modname));

  return {
    info,
    sections,
    progress,
    done,
    total,
    status: completed ? "completed" : progress > 0 ? "inprogress" : "notstarted",
    locked: courseLocked,
    lockReason,
    prerequisite,
    completedAt: completed ? (state.courseCompleted[info.id] ?? Math.max(...tracked.map((m) => m.completiondata?.timecompleted ?? 0))) : undefined,
    lastaccess: state.lastAccess[info.id],
    isfavourite: state.favourites.includes(info.id),
    next,
    playable,
    counts: {
      videos: all.filter((m) => m.modname === "drivevideo").length,
      pages: all.filter((m) => m.modname === "page").length,
      files: all.filter((m) => m.modname === "resource").length,
      urls: all.filter((m) => m.modname === "url").length,
      quizzes: all.filter((m) => m.modname === "quiz").length,
      lessons: lessons.length,
      duration: all.reduce((s, m) => s + (m.customdata_duration ?? 0), 0),
    },
    quizzesPassed: all.filter((m) => m.modname === "quiz" && isDone(state, m)).length,
  };
}

/** Dựng toàn bộ khóa theo thứ tự lộ trình để biết khóa trước đã hoàn thành chưa. */
export function buildAllCourses(state: LearnerState): CourseView[] {
  const completedSet = new Set<number>();
  const order = [...learningPaths.flatMap((p) => p.steps.map((s) => s.courseid))];
  for (const c of courses) if (!order.includes(c.id)) order.push(c.id);
  const views = new Map<number, CourseView>();
  for (const id of order) {
    const info = getCourseInfo(id)!;
    const view = buildCourse(state, info, completedSet);
    if (view.status === "completed") completedSet.add(id);
    views.set(id, view);
  }
  return courses.map((c) => views.get(c.id)!);
}

/** Danh sách bài kiểm tra kèm trạng thái (TEST-01, DASH-05, GRADE-02) */
export function buildQuizList(state: LearnerState, views: CourseView[]) {
  return views.flatMap((v) =>
    v.sections.flatMap((s) =>
      s.modules
        .filter((m) => m.modname === "quiz")
        .map((m) => ({ course: v, section: s, module: m, summary: summarizeQuiz(state, m.id, !m.uservisible)! })),
    ),
  );
}

export type QuizListItem = ReturnType<typeof buildQuizList>[number];

/** Điểm khóa (GRADE-01): trung bình điểm cao nhất của các bài kiểm tra đã làm, thang 10 */
export function courseGrade(items: QuizListItem[]) {
  const graded = items.filter((i) => i.summary.best !== null);
  if (!graded.length) return null;
  return Math.round((graded.reduce((s, i) => s + (i.summary.best ?? 0), 0) / graded.length) * 100) / 100;
}
