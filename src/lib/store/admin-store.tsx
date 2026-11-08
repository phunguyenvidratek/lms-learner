"use client";

/**
 * Store phía client của admin portal. Chỉ lưu phần admin thêm hoặc sửa trong mockup, ví dụ bài mới,
 * cài đặt khóa, ghi danh, người dùng mới. Dữ liệu này phủ lên mock gốc và lưu localStorage
 * (key vigo-lms:admin:v1, ?reset=1 xóa cùng store learner vì cùng prefix).
 *
 * Không đồng bộ sang learner portal: learner đọc nội dung khóa ở server (src/lib/data.ts).
 * Tiến độ học viên đọc từ useLearning() (người học thật) và hồ sơ mẫu (src/lib/mock/admin/learner-profiles.ts).
 * Mỗi màn admin mới bổ sung action của mình ở đây, giữ một nguồn để số liệu không lệch giữa các màn.
 */
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { baseDataset, type AdminDataset } from "@/lib/admin";
import { useLearning } from "@/lib/store/learning-store";
import type { ModName, QuizQuestion } from "@/types/moodle";
import type {
  AddedModule,
  AdminAnnouncement,
  AdminCourse,
  AdminModule,
  AdminState,
  AdminUser,
  Cohort,
  CohortMember,
  CompletionCriteria,
  CourseCategory,
  EnrolInstance,
  QuizSettings,
  UserEnrolment,
} from "@/types/moodle-admin";

const STATE_KEY = "vigo-lms:admin:v1";

export type { AddedModule, AdminState };

function emptyState(): AdminState {
  return {
    v: 1,
    editing: true,
    courses: {},
    newCourses: [],
    addedModules: [],
    updatedModules: {},
    deletedModules: [],
    users: [],
    updatedUsers: {},
    cohortMembers: [],
    enrolInstances: [],
    userEnrolments: [],
    sections: {},
    addedSections: {},
    cohorts: [],
    announcements: [],
    quizSettings: {},
    completion: {},
    recycle: {},
    enrolStatus: {},
    quizQuestions: {},
    defaultCompletion: {},
    roleAssignments: [],
    deletedEnrolInstances: [],
    categories: [],
    assignGrades: {},
  };
}

// ---------- External store ----------

let current: AdminState | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  // ?reset=1 do learning-store xử lý (xóa mọi key vigo-lms:); ở đây chỉ cần bắt đầu từ rỗng
  const reset = new URL(window.location.href).searchParams.get("reset") === "1";
  try {
    const raw = reset ? null : localStorage.getItem(STATE_KEY);
    const parsed = raw ? (JSON.parse(raw) as AdminState) : null;
    current = parsed?.v === 1 ? { ...emptyState(), ...parsed } : emptyState();
  } catch {
    current = emptyState();
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== STATE_KEY) return;
    try {
      current = e.newValue ? (JSON.parse(e.newValue) as AdminState) : emptyState();
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

function update(fn: (s: AdminState) => AdminState) {
  if (!current) return;
  const next = fn(current);
  if (next === current) return;
  current = next;
  persist();
  listeners.forEach((l) => l());
}

// ---------- Actions ----------

let seq = 0;
/** Id cho bản ghi mới tạo trong mockup (không trùng id mock) */
export function newId() {
  seq += 1;
  return 900000 + (Math.floor(Date.now() / 1000) % 90000) * 10 + (seq % 10);
}

const actions = {
  /** SHELL-04: lưu trạng thái thu gọn sidebar như user preference */
  setSidebarCollapsed(v: boolean) {
    update((s) => ({ ...s, sidebarCollapsed: v }));
  },
  setEditing(editing: boolean) {
    update((s) => (s.editing === editing ? s : { ...s, editing }));
  },
  /** course/edit.php?category= (tạo khóa mới) */
  createCourse(course: AdminCourse) {
    update((s) => ({ ...s, newCourses: [...s.newCourses, course] }));
  },
  /** course/editsection.php */
  updateSection(courseid: number, section: number, patch: { name?: string; summary?: string; visible?: number }) {
    const key = `${courseid}:${section}`;
    update((s) => ({ ...s, sections: { ...s.sections, [key]: { ...s.sections[key], ...patch } } }));
  },
  /** course/changenumsections.php (Thêm phần) */
  addSection(courseid: number) {
    update((s) => ({ ...s, addedSections: { ...s.addedSections, [courseid]: (s.addedSections[courseid] ?? 0) + 1 } }));
  },
  /** cohort/edit.php */
  addCohort(cohort: Cohort) {
    update((s) => ({ ...s, cohorts: [...s.cohorts, cohort] }));
  },
  /** cohort/assign.php */
  addCohortMembers(members: CohortMember[]) {
    update((s) => ({ ...s, cohortMembers: [...s.cohortMembers, ...members] }));
  },
  /** course/editcategory.php */
  addCategory(c: CourseCategory) {
    update((s) => ({ ...s, categories: [...s.categories, c] }));
  },
  /** grade/report/grader: lưu điểm bài nộp */
  gradeAssign(cmid: number, userid: number, grade: number) {
    update((s) => ({ ...s, assignGrades: { ...s.assignGrades, [`${cmid}:${userid}`]: grade } }));
  },
  /** mod/forum/post.php (Site announcements) */
  postAnnouncement(a: AdminAnnouncement) {
    update((s) => ({ ...s, announcements: [a, ...s.announcements] }));
  },
  /** course/modedit.php?update= (quiz) */
  updateQuizSettings(cmid: number, patch: Partial<QuizSettings>) {
    update((s) => ({ ...s, quizSettings: { ...s.quizSettings, [cmid]: { ...s.quizSettings[cmid], ...patch } } }));
  },
  /** local/quizexcel/import.php: thêm câu hỏi đã kiểm tra vào quiz */
  importQuestions(cmid: number, questions: QuizQuestion[]) {
    update((s) => ({ ...s, quizQuestions: { ...s.quizQuestions, [cmid]: [...(s.quizQuestions[cmid] ?? []), ...questions] } }));
  },
  /** course/defaultcompletion.php */
  setDefaultCompletion(courseid: number, modname: ModName, value: AdminState["defaultCompletion"][string]) {
    update((s) => ({ ...s, defaultCompletion: { ...s.defaultCompletion, [`${courseid}:${modname}`]: value } }));
  },
  /** course/completion.php */
  setCompletion(courseid: number, criteria: CompletionCriteria) {
    update((s) => ({ ...s, completion: { ...s.completion, [courseid]: criteria } }));
  },
  /** enrol/instances.php: bật/tắt cách ghi danh */
  setEnrolStatus(id: number, status: 0 | 1) {
    update((s) => ({ ...s, enrolStatus: { ...s.enrolStatus, [id]: status } }));
  },
  /** admin/tool/recyclebin: khôi phục bài */
  restoreModule(cmid: number) {
    update((s) => {
      const recycle = { ...s.recycle };
      delete recycle[cmid];
      return { ...s, recycle, deletedModules: s.deletedModules.filter((x) => x !== cmid) };
    });
  },
  /** admin/tool/recyclebin: xóa hẳn */
  purgeModule(cmid: number) {
    update((s) => {
      const recycle = { ...s.recycle };
      delete recycle[cmid];
      return { ...s, recycle };
    });
  },
  /** course/edit.php (lưu cài đặt khóa) */
  updateCourse(id: number, patch: Partial<AdminCourse>) {
    update((s) => ({ ...s, courses: { ...s.courses, [id]: { ...s.courses[id], ...patch } } }));
  },
  /** course/modedit.php?add=<modname>&course=&section= */
  addModule(courseid: number, section: number, module: AdminModule) {
    update((s) => ({ ...s, addedModules: [...s.addedModules, { courseid, section, module }] }));
  },
  /** course/modedit.php?update=<cmid> */
  updateModule(cmid: number, patch: Partial<AdminModule>) {
    update((s) => ({ ...s, updatedModules: { ...s.updatedModules, [cmid]: { ...s.updatedModules[cmid], ...patch } } }));
  },
  /** course/mod.php?delete=<cmid> (vào Thùng rác) */
  deleteModule(cmid: number) {
    update((s) =>
      s.deletedModules.includes(cmid)
        ? s
        : { ...s, deletedModules: [...s.deletedModules, cmid], recycle: { ...s.recycle, [cmid]: Math.floor(Date.now() / 1000) } },
    );
  },
  /** user/editadvanced.php?id=-1 */
  addUser(user: AdminUser, cohortid?: number) {
    update((s) => ({
      ...s,
      users: [...s.users, user],
      cohortMembers: cohortid ? [...s.cohortMembers, { cohortid, userid: user.id, timeadded: user.timecreated }] : s.cohortMembers,
    }));
  },
  /** user/editadvanced.php?id=<userid> */
  updateUser(id: number, patch: Partial<AdminUser>) {
    update((s) => ({ ...s, updatedUsers: { ...s.updatedUsers, [id]: { ...s.updatedUsers[id], ...patch } } }));
  },
  /** enrol_manual_enrol_users / thêm instance enrol_cohort */
  addEnrolments(instances: EnrolInstance[], enrolments: UserEnrolment[], roles: AdminState["roleAssignments"] = []) {
    update((s) => ({
      ...s,
      enrolInstances: [...s.enrolInstances, ...instances],
      userEnrolments: [...s.userEnrolments, ...enrolments],
      roleAssignments: [...s.roleAssignments, ...roles],
    }));
  },
  /** enrol/instances.php: xóa cách ghi danh (kèm lượt ghi danh của nó) */
  deleteEnrolInstance(id: number) {
    update((s) => ({ ...s, deletedEnrolInstances: [...s.deletedEnrolInstances, id] }));
  },
  /** Bỏ mọi thay đổi của admin (dữ liệu learner giữ nguyên) */
  reset() {
    update(() => emptyState());
  },
};

// ---------- Gộp dữ liệu ----------

function mergeDataset(base: AdminDataset, s: AdminState | null): AdminDataset {
  if (!s) return base;
  const patchUser = (u: AdminUser) => (s.updatedUsers[u.id] ? { ...u, ...s.updatedUsers[u.id] } : u);
  return {
    ...base,
    courses: [...base.courses, ...s.newCourses].map((c) => (s.courses[c.id] ? { ...c, ...s.courses[c.id] } : c)),
    users: [...base.users, ...s.users].map(patchUser),
    cohorts: [...base.cohorts, ...s.cohorts],
    categories: [...base.categories, ...s.categories].map((c) => ({
      ...c,
      coursecount: [...base.courses, ...s.newCourses].filter((x) => (s.courses[x.id]?.categoryid ?? x.categoryid) === c.id).length,
    })),
    cohortMembers: [...base.cohortMembers, ...s.cohortMembers],
    enrolInstances: [...base.enrolInstances, ...s.enrolInstances]
      .filter((i) => !s.deletedEnrolInstances.includes(i.id))
      .map((i) => (s.enrolStatus[i.id] !== undefined ? { ...i, status: s.enrolStatus[i.id] } : i)),
    userEnrolments: [...base.userEnrolments, ...s.userEnrolments],
    roleAssignments: [...base.roleAssignments, ...s.roleAssignments],
    admin: s,
  };
}

// ---------- React context ----------

export interface AdminContextValue {
  ready: boolean;
  state: AdminState | null;
  /** Dữ liệu đã gộp, truyền vào các hàm của src/lib/admin.ts */
  ds: AdminDataset;
  actions: typeof actions;
}

const AdminContext = createContext<AdminContextValue | null>(null);

/** Đặt trong src/app/admin/layout.tsx (nằm trong LearningProvider của root layout) */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const learning = useLearning();
  const value = useMemo<AdminContextValue>(
    () => ({
      ready: !!state && learning.ready,
      state,
      ds: mergeDataset(baseDataset(learning.state), state),
      actions,
    }),
    [state, learning.ready, learning.state],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin phải nằm trong AdminProvider");
  return ctx;
}
