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
import type { CourseModule } from "@/types/moodle";
import type { AdminCourse, AdminUser, CohortMember, EnrolInstance, UserEnrolment } from "@/types/moodle-admin";

const STATE_KEY = "vigo-lms:admin:v1";

/** Bài admin thêm vào một phần của khóa (course/modedit.php?add=...) */
export interface AddedModule {
  courseid: number;
  section: number;
  module: CourseModule;
}

export interface AdminState {
  v: 1;
  /** course/edit.php: field khóa đã sửa */
  courses: Record<number, Partial<AdminCourse>>;
  /** Khóa mới tạo trong mockup */
  newCourses: AdminCourse[];
  addedModules: AddedModule[];
  /** course/modedit.php?update=: field module đã sửa */
  updatedModules: Record<number, Partial<CourseModule>>;
  deletedModules: number[];
  users: AdminUser[];
  updatedUsers: Record<number, Partial<AdminUser>>;
  cohortMembers: CohortMember[];
  enrolInstances: EnrolInstance[];
  userEnrolments: UserEnrolment[];
}

function emptyState(): AdminState {
  return {
    v: 1,
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

const actions = {
  /** course/edit.php (lưu cài đặt khóa) */
  updateCourse(id: number, patch: Partial<AdminCourse>) {
    update((s) => ({ ...s, courses: { ...s.courses, [id]: { ...s.courses[id], ...patch } } }));
  },
  /** course/modedit.php?add=<modname>&course=&section= */
  addModule(courseid: number, section: number, module: CourseModule) {
    update((s) => ({ ...s, addedModules: [...s.addedModules, { courseid, section, module }] }));
  },
  /** course/modedit.php?update=<cmid> */
  updateModule(cmid: number, patch: Partial<CourseModule>) {
    update((s) => ({ ...s, updatedModules: { ...s.updatedModules, [cmid]: { ...s.updatedModules[cmid], ...patch } } }));
  },
  /** course/mod.php?delete=<cmid> (vào Thùng rác) */
  deleteModule(cmid: number) {
    update((s) => (s.deletedModules.includes(cmid) ? s : { ...s, deletedModules: [...s.deletedModules, cmid] }));
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
  addEnrolments(instances: EnrolInstance[], enrolments: UserEnrolment[]) {
    update((s) => ({
      ...s,
      enrolInstances: [...s.enrolInstances, ...instances],
      userEnrolments: [...s.userEnrolments, ...enrolments],
    }));
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
    cohortMembers: [...base.cohortMembers, ...s.cohortMembers],
    enrolInstances: [...base.enrolInstances, ...s.enrolInstances],
    userEnrolments: [...base.userEnrolments, ...s.userEnrolments],
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
