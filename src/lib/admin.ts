/**
 * Logic tính dùng chung của admin portal (vai trò giống src/lib/learning.ts phía learner).
 * Mọi số liệu tiến độ đi qua buildAllCourses()/summarizeQuiz() của learning.ts, không tự lưu %.
 * Hàm nhận một AdminDataset: dữ liệu mock + phần admin đã thêm/sửa (admin-store) + state thật của
 * người học trên learner portal (useLearning), để màn admin và learner cùng một số.
 */
import {
  buildAllCourses,
  getQuestions,
  questionScore,
  summarizeQuiz,
  type CourseView,
  type LearnerState,
  type QuizSummary,
} from "@/lib/learning";
import { adminCourses, categories, draftCourseContents, draftQuizzes } from "@/lib/mock/admin/courses";
import { courseRoleAssignments, enrolInstances, userEnrolments } from "@/lib/mock/admin/enrolments";
import { buildProfileState } from "@/lib/mock/admin/learner-profiles";
import { cohortMembers, cohorts, roles, ROLE_STUDENT, users } from "@/lib/mock/admin/users";
import { courseContents, quizzes, siteInfo } from "@/lib/mock/data";
import { DAY } from "@/lib/mock/time";
import type { CourseSection, Quiz } from "@/types/moodle";
import type {
  AdminCourse,
  AdminUser,
  Cohort,
  CohortMember,
  CourseCategory,
  EnrolInstance,
  Role,
  UserEnrolment,
} from "@/types/moodle-admin";

/** userid của người học trên learner portal */
export const LEARNER_USER_ID = siteInfo.userid;

export interface RoleAssignment {
  courseid: number;
  userid: number;
  roleid: number;
}

export interface AdminDataset {
  courses: AdminCourse[];
  categories: CourseCategory[];
  users: AdminUser[];
  cohorts: Cohort[];
  cohortMembers: CohortMember[];
  enrolInstances: EnrolInstance[];
  userEnrolments: UserEnrolment[];
  roleAssignments: RoleAssignment[];
  roles: Role[];
  /** State thật của người học trên learner portal (null khi chưa tải) */
  live: LearnerState | null;
}

/** Dữ liệu gốc, chưa có thay đổi của admin */
export function baseDataset(live: LearnerState | null = null): AdminDataset {
  return {
    courses: adminCourses,
    categories,
    users,
    cohorts,
    cohortMembers,
    enrolInstances,
    userEnrolments,
    roleAssignments: courseRoleAssignments,
    roles,
    live,
  };
}

// ---------- Tra cứu nội dung ----------

export function getAdminCourse(ds: AdminDataset, id: number) {
  return ds.courses.find((c) => c.id === id);
}

/** Nội dung khóa: khóa learner dùng chung courseContents, khóa nháp dùng nội dung riêng */
export function adminCourseContents(courseId: number): CourseSection[] {
  return courseContents[courseId] ?? draftCourseContents[courseId] ?? [];
}

export function adminQuiz(cmid: number): Quiz | undefined {
  return quizzes.find((q) => q.coursemodule === cmid) ?? draftQuizzes.find((q) => q.coursemodule === cmid);
}

export function roleName(ds: AdminDataset, roleid: number) {
  return ds.roles.find((r) => r.id === roleid)?.name ?? "";
}

export function userCohorts(ds: AdminDataset, userid: number) {
  const ids = ds.cohortMembers.filter((m) => m.userid === userid).map((m) => m.cohortid);
  return ds.cohorts.filter((c) => ids.includes(c.id));
}

// ---------- Tiến độ theo học viên ----------

const profileCache = new Map<number, LearnerState>();
const viewCache = new WeakMap<LearnerState, CourseView[]>();

/** LearnerState của một học viên: state thật nếu là người học learner, còn lại dựng từ hồ sơ mẫu */
export function learnerState(ds: AdminDataset, userid: number): LearnerState {
  if (userid === LEARNER_USER_ID && ds.live) return ds.live;
  let s = profileCache.get(userid);
  if (!s) {
    s = buildProfileState(userid);
    profileCache.set(userid, s);
  }
  return s;
}

/** Khóa học theo góc nhìn của một học viên (cùng hàm learner dùng) */
export function learnerCourseViews(ds: AdminDataset, userid: number): CourseView[] {
  const state = learnerState(ds, userid);
  let views = viewCache.get(state);
  if (!views) {
    views = buildAllCourses(state);
    viewCache.set(state, views);
  }
  return views;
}

/** Lần truy cập cuối: lấy mốc muộn nhất giữa lần đăng nhập và hoạt động học */
export function userLastAccess(ds: AdminDataset, user: AdminUser) {
  const state = learnerState(ds, user.id);
  return Math.max(user.lastaccess, ...Object.values(state.lastAccess), 0);
}

// ---------- Ghi danh ----------

export interface Enrolment {
  user: AdminUser;
  roleid: number;
  /** Các cách ghi danh của người này vào khóa (có thể vừa thủ công vừa đồng bộ) */
  methods: EnrolInstance[];
  timestart: number;
  /** true nếu mọi lượt ghi danh đều tạm dừng hoặc tài khoản bị khóa */
  suspended: boolean;
}

/** user/index.php: người được ghi danh vào khóa, lọc theo vai trò (mặc định Học viên) */
export function courseEnrolments(ds: AdminDataset, courseId: number, roleid: number | null = ROLE_STUDENT): Enrolment[] {
  const inst = ds.enrolInstances.filter((i) => i.courseid === courseId);
  const byUser = new Map<number, { ues: UserEnrolment[]; methods: EnrolInstance[] }>();
  for (const ue of ds.userEnrolments) {
    const method = inst.find((i) => i.id === ue.enrolid);
    if (!method) continue;
    const entry = byUser.get(ue.userid) ?? { ues: [], methods: [] };
    entry.ues.push(ue);
    entry.methods.push(method);
    byUser.set(ue.userid, entry);
  }
  const out: Enrolment[] = [];
  for (const [userid, { ues, methods }] of byUser) {
    const user = ds.users.find((u) => u.id === userid);
    if (!user) continue;
    const ra = ds.roleAssignments.find((r) => r.courseid === courseId && r.userid === userid);
    const rid = ra?.roleid ?? ROLE_STUDENT;
    if (roleid !== null && rid !== roleid) continue;
    out.push({
      user,
      roleid: rid,
      methods,
      timestart: Math.min(...ues.map((u) => u.timestart)),
      suspended: user.suspended || ues.every((u) => u.status === 1 || methods[ues.indexOf(u)].status === 1),
    });
  }
  return out.sort((a, b) => a.user.fullname.localeCompare(b.user.fullname, "vi"));
}

// ---------- Báo cáo tiến độ khóa ----------

export interface RosterRow extends Enrolment {
  view?: CourseView;
  progress: number;
  done: number;
  total: number;
  status: CourseView["status"];
  completedAt?: number;
  lastaccess?: number;
}

/** Học viên của khóa kèm tiến độ (ENR-03, RPT-03) */
export function courseRoster(ds: AdminDataset, courseId: number): RosterRow[] {
  return courseEnrolments(ds, courseId).map((e) => {
    const view = learnerCourseViews(ds, e.user.id).find((v) => v.info.id === courseId);
    return {
      ...e,
      view,
      progress: view?.progress ?? 0,
      done: view?.done ?? 0,
      total: view?.total ?? 0,
      status: view?.status ?? "notstarted",
      completedAt: view?.completedAt,
      lastaccess: learnerState(ds, e.user.id).lastAccess[courseId],
    };
  });
}

export interface CourseStats {
  students: number;
  completed: number;
  inprogress: number;
  notstarted: number;
  /** % hoàn thành trung bình của học viên */
  avgProgress: number;
}

export function courseStats(ds: AdminDataset, courseId: number): CourseStats {
  const rows = courseRoster(ds, courseId).filter((r) => !r.suspended);
  const n = rows.length;
  return {
    students: n,
    completed: rows.filter((r) => r.status === "completed").length,
    inprogress: rows.filter((r) => r.status === "inprogress").length,
    notstarted: rows.filter((r) => r.status === "notstarted").length,
    avgProgress: n ? Math.round(rows.reduce((s, r) => s + r.progress, 0) / n) : 0,
  };
}

// ---------- Kết quả bài kiểm tra ----------

export interface QuizReportRow {
  user: AdminUser;
  summary: QuizSummary;
}

export interface QuizReport {
  quiz: Quiz;
  rows: QuizReportRow[];
  attempted: number;
  passed: number;
  /** Điểm trung bình (điểm cao nhất mỗi người), thang quiz.grade */
  average: number | null;
  /** Câu sai nhiều nhất, tính trên mọi lượt đã nộp */
  mostMissed: { slot: number; text: string; wrong: number; total: number }[];
}

/** mod/quiz/report.php?mode=overview (QUIZ-05) */
export function quizReport(ds: AdminDataset, courseId: number, cmid: number): QuizReport | undefined {
  const quiz = adminQuiz(cmid);
  if (!quiz) return undefined;
  const rows: QuizReportRow[] = [];
  for (const e of courseEnrolments(ds, courseId)) {
    const summary = summarizeQuiz(learnerState(ds, e.user.id), cmid);
    if (summary) rows.push({ user: e.user, summary });
  }
  const tried = rows.filter((r) => r.summary.attempts.length);
  const questions = getQuestions(cmid);
  const missed = questions.map((q) => {
    let wrong = 0;
    let total = 0;
    for (const r of tried)
      for (const a of r.summary.attempts) {
        total++;
        if (questionScore(q, a.answers[q.slot]) < 1) wrong++;
      }
    return { slot: q.slot, text: q.text, wrong, total };
  });
  return {
    quiz,
    rows,
    attempted: tried.length,
    passed: tried.filter((r) => r.summary.passed).length,
    average: tried.length ? Math.round((tried.reduce((s, r) => s + (r.summary.best ?? 0), 0) / tried.length) * 100) / 100 : null,
    mostMissed: missed.filter((m) => m.wrong > 0).sort((a, b) => b.wrong - a.wrong),
  };
}

// ---------- Tổng quan site ----------

export interface SiteOverview {
  /** Khóa đang hiển thị */
  openCourses: number;
  /** Học viên có truy cập trong 30 ngày */
  activeLearners: number;
  totalLearners: number;
  /** % lượt ghi danh (học viên x khóa đang hiển thị) đã hoàn thành khóa */
  completionRate: number;
  /**
   * Bài nộp chờ chấm (mod_assign). Nội dung mẫu chưa có Assignment nên luôn 0,
   * xem Câu hỏi cho BA (admin) trong CLAUDE.md.
   */
  pendingGrading: number;
}

/** DASH-01. `now` lấy từ useNow() phía client. */
export function siteOverview(ds: AdminDataset, now: number): SiteOverview {
  const open = ds.courses.filter((c) => c.visible === 1);
  const learnerIds = new Set<number>();
  let enrolled = 0;
  let completed = 0;
  for (const c of open) {
    for (const r of courseRoster(ds, c.id)) {
      if (r.suspended) continue;
      learnerIds.add(r.user.id);
      enrolled++;
      if (r.status === "completed") completed++;
    }
  }
  const active = [...learnerIds].filter((id) => {
    const u = ds.users.find((x) => x.id === id)!;
    return userLastAccess(ds, u) >= now - 30 * DAY;
  }).length;
  return {
    openCourses: open.length,
    activeLearners: active,
    totalLearners: learnerIds.size,
    completionRate: enrolled ? Math.round((completed / enrolled) * 100) : 0,
    pendingGrading: 0,
  };
}
