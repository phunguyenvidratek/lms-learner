/**
 * Logic tính dùng chung của admin portal (vai trò giống src/lib/learning.ts phía learner).
 * Mọi số liệu tiến độ đi qua buildAllCourses()/summarizeQuiz() của learning.ts, không tự lưu %.
 * Hàm nhận một AdminDataset: dữ liệu mock + phần admin đã thêm/sửa (admin-store) + state thật của
 * người học trên learner portal (useLearning), để màn admin và learner cùng một số.
 */
import {
  buildAllCourses,
  defaultCriteria,
  getQuestions,
  questionScore,
  summarizeQuiz,
  type CourseCriteria,
  type CourseView,
  type LearnerState,
  type QuizSummary,
} from "@/lib/learning";
import { adminCourses, categories, draftCourseContents, draftQuizzes } from "@/lib/mock/admin/courses";
import { courseRoleAssignments, enrolInstances, userEnrolments } from "@/lib/mock/admin/enrolments";
import { buildProfileState } from "@/lib/mock/admin/learner-profiles";
import { assignSubmissions } from "@/lib/mock/admin/submissions";
import { cohortMembers, cohorts, roles, ROLE_STUDENT, users } from "@/lib/mock/admin/users";
import { courseContents, quizzes, siteInfo } from "@/lib/mock/data";
import { DAY } from "@/lib/mock/time";
import type { CourseSection, ModName, Quiz, QuizQuestion } from "@/types/moodle";
import type {
  AdminAlert,
  AdminModule,
  AdminSection,
  AdminState,
  AdminCourse,
  CompletionCriteria,
  QuizSettings,
  ReviewItem,
  ReviewWhen,
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
  /** Thay đổi admin tạo trong mockup (null = chưa có) */
  admin: AdminState | null;
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
    admin: null,
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
const viewCache = new WeakMap<LearnerState, { crit: unknown; views: CourseView[] }>();

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
  const crit = ds.admin?.completion;
  const cached = viewCache.get(state);
  if (cached && cached.crit === crit) return cached.views;
  const views = buildAllCourses(state, crit && Object.keys(crit).length ? criteriaForLearning(crit) : undefined);
  viewCache.set(state, { crit, views });
  return views;
}

function criteriaForLearning(all: Record<number, CompletionCriteria>): Record<number, CourseCriteria> {
  return Object.fromEntries(
    Object.entries(all).map(([id, c]) => [id, { aggregation: c.aggregation, activities: c.activities, activityaggregation: c.activityaggregation, grade: c.grade }]),
  );
}

// ---------- Điều kiện hoàn thành khóa (Admin COMP) ----------

/** Điều kiện hiện hành: admin đã sửa, nếu chưa thì mặc định của learning.ts (khớp learner) */
export function courseCriteria(ds: AdminDataset, courseId: number): CompletionCriteria {
  const saved = ds.admin?.completion[courseId];
  if (saved) return saved;
  const d = defaultCriteria(courseId);
  return { ...d, date: null, enrolperiod: null, unenrol: false, selfcompletion: false, othercourses: [], roles: [] };
}

/** COMP-01: câu tóm tắt "Học viên hoàn thành khóa khi: ..." */
export function completionSentence(ds: AdminDataset, courseId: number, c: CompletionCriteria): string {
  const mods = courseSections(ds, courseId).flatMap((s) => s.modules);
  const parts: string[] = [];
  if (c.activities.length) {
    const picked = mods.filter((m) => c.activities.includes(m.id));
    const quizzes = picked.filter((m) => m.modname === "quiz");
    const lessons = picked.length - quizzes.length;
    const what = [lessons ? `${lessons} bài học` : "", quizzes.length ? `đạt ${quizzes.length} bài kiểm tra` : ""].filter(Boolean).join(" và ");
    parts.push(c.activityaggregation === 1 ? `hoàn thành ${what}` : `hoàn thành ít nhất một trong ${picked.length} bài đã chọn`);
  }
  if (c.grade != null) parts.push(`điểm khóa từ ${formatNum(c.grade)}/10`);
  if (c.date) parts.push(`tới ngày ${new Date(c.date * 1000).toLocaleDateString("vi-VN")}`);
  if (c.enrolperiod) parts.push(`đã ghi danh ${c.enrolperiod} ngày`);
  if (c.unenrol) parts.push("bị hủy ghi danh");
  if (c.selfcompletion) parts.push("tự đánh dấu hoàn thành khóa");
  if (c.othercourses.length) {
    const names = c.othercourses.map((id) => getAdminCourse(ds, id)?.fullname).filter(Boolean);
    parts.push(`hoàn thành khóa ${names.join(", ")}`);
  }
  if (c.roles.length) parts.push(`được ${c.roles.map((r) => roleName(ds, r)).join(", ")} đánh dấu hoàn thành`);
  if (!parts.length) return "Chưa đặt điều kiện. Khóa sẽ không bao giờ được tính là hoàn thành.";
  return `Học viên hoàn thành khóa khi ${parts.join(c.aggregation === 1 ? ", và " : ", hoặc ")}.`;
}

// ---------- Câu hỏi của bài kiểm tra ----------

/** Câu hỏi mock + câu đã nhập Excel trong mockup */
export function quizQuestionsOf(ds: AdminDataset, cmid: number): QuizQuestion[] {
  return [...getQuestions(cmid), ...(ds.admin?.quizQuestions[cmid] ?? [])];
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

/**
 * user/index.php: người được ghi danh vào khóa, lọc theo vai trò (mặc định Học viên).
 * Ghi danh thủ công đọc từ user_enrolments (ghi 1 lần). Đồng bộ phòng ban (enrol_cohort) tính từ thành viên
 * hiện tại của cohort, nên người mới vào phòng ban tự có trong khóa, như Moodle.
 */
export function courseEnrolments(ds: AdminDataset, courseId: number, roleid: number | null = ROLE_STUDENT): Enrolment[] {
  const inst = ds.enrolInstances.filter((i) => i.courseid === courseId);
  const byUser = new Map<number, { starts: number[]; active: boolean[]; methods: EnrolInstance[] }>();
  const add = (userid: number, method: EnrolInstance, timestart: number, active: boolean) => {
    const entry = byUser.get(userid) ?? { starts: [], active: [], methods: [] };
    entry.starts.push(timestart);
    entry.active.push(active && method.status === 0);
    entry.methods.push(method);
    byUser.set(userid, entry);
  };
  for (const method of inst) {
    if (method.enrol === "cohort") {
      for (const m of ds.cohortMembers.filter((x) => x.cohortid === method.customint1))
        add(m.userid, method, Math.max(method.timecreated, m.timeadded), true);
    } else {
      for (const ue of ds.userEnrolments.filter((x) => x.enrolid === method.id)) add(ue.userid, method, ue.timestart, ue.status === 0);
    }
  }
  const out: Enrolment[] = [];
  for (const [userid, { starts, active, methods }] of byUser) {
    const user = ds.users.find((u) => u.id === userid);
    if (!user) continue;
    const ra = ds.roleAssignments.find((r) => r.courseid === courseId && r.userid === userid);
    const rid = ra?.roleid ?? ROLE_STUDENT;
    if (roleid !== null && rid !== roleid) continue;
    out.push({
      user,
      roleid: rid,
      methods,
      timestart: Math.min(...starts),
      suspended: user.suspended || active.every((a) => !a),
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
  const quiz = effectiveQuiz(ds, cmid);
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

// ---------- Bài nộp chờ chấm ----------

export function pendingSubmissions() {
  return assignSubmissions.filter((x) => x.status === "submitted" && x.grade === null);
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
  /** Bài nộp chờ chấm (mod_assign: đã nộp, chưa có điểm) */
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
    pendingGrading: pendingSubmissions().length,
  };
}

// ---------- Nội dung khóa theo góc nhìn người soạn (Admin CED, ACT) ----------

/** Nhãn loại bài bằng chữ (CED-01). Tên theo bảng chọn ACT-01. */
export const MOD_TYPE_LABEL: Record<ModName, string> = {
  drivevideo: "Bài video",
  page: "Bài đọc",
  resource: "Tài liệu",
  url: "Liên kết",
  quiz: "Bài kiểm tra",
  assign: "Bài nộp",
  feedback: "Khảo sát",
  forum: "Diễn đàn",
  label: "Văn bản",
  qbank: "Ngân hàng câu hỏi",
  folder: "Thư mục",
  book: "Sách",
  h5pactivity: "H5P",
  glossary: "Thuật ngữ",
  subsection: "Phần con",
};

/** Điều kiện mở phần theo quy tắc của learner (learning.ts): đạt bài kiểm tra phần trước */
function sectionAvailability(courseId: number, section: number): string | null {
  if (section <= 1) return null;
  const prev = adminCourseContents(courseId).find((s) => s.section === section - 1);
  const quiz = prev?.modules.find((m) => m.modname === "quiz");
  if (!quiz) return null;
  const q = adminQuiz(quiz.id);
  const min = q ? Math.round((q.gradepass / q.grade) * 100) : 80;
  return JSON.stringify({ op: "&", c: [{ type: "grade", cm: quiz.id, min }], showc: [true] });
}

/** Mặc định completion của module mock (khớp completion 1/2 của learner) */
function withCompletionFields(m: AdminModule): AdminModule {
  if (m.completion !== 2) return m;
  if (m.completionview || m.completionpassgrade || m.completionusegrade || m.completionpercent) return m;
  if (m.modname === "quiz") return { ...m, completionusegrade: 1, completionpassgrade: 1 };
  if (m.modname === "drivevideo") return { ...m, completionpercent: 90 };
  return { ...m, completionview: 1 };
}

/** Nội dung khóa đã gộp thay đổi của admin (thêm phần, thêm/sửa/xóa bài, sửa phần) */
export function courseSections(ds: AdminDataset, courseId: number): AdminSection[] {
  const a = ds.admin;
  const base = adminCourseContents(courseId);
  const sections: AdminSection[] = base.map((s) => ({
    ...s,
    visible: 1,
    availabilityinfo: null,
    modules: s.modules.map((m) => withCompletionFields({ ...m })),
    availability: sectionAvailability(courseId, s.section),
  }));
  const extra = a?.addedSections[courseId] ?? 0;
  const last = sections.reduce((n, s) => Math.max(n, s.section), 0);
  for (let i = 1; i <= extra; i++) {
    sections.push({
      id: courseId * 1000 + 900 + i,
      name: `Phần ${last + i}`,
      section: last + i,
      summary: "",
      uservisible: true,
      visible: 1,
      modules: [],
    });
  }
  if (a) {
    for (const add of a.addedModules.filter((x) => x.courseid === courseId)) {
      sections.find((s) => s.section === add.section)?.modules.push(add.module);
    }
    for (const s of sections) {
      const patch = a.sections[`${courseId}:${s.section}`];
      if (patch) Object.assign(s, patch);
      s.modules = s.modules
        .filter((m) => !a.deletedModules.includes(m.id))
        .map((m) => (a.updatedModules[m.id] ? withCompletionFields({ ...m, ...a.updatedModules[m.id] }) : m));
    }
  }
  return sections;
}

/** Điều kiện mở của phần (JSON availability), tính theo quy tắc learner */
export function sectionAvailabilityOf(section: AdminSection): string | null {
  return section.availability ?? null;
}

export function findAdminModule(ds: AdminDataset, cmid: number) {
  for (const c of ds.courses) {
    for (const s of courseSections(ds, c.id)) {
      const m = s.modules.find((x) => x.id === cmid);
      if (m) return { course: c, section: s, module: m };
    }
  }
  return undefined;
}

/** Cài đặt quiz hiện hành = quiz mock + phần admin đã sửa */
export function effectiveQuiz(ds: AdminDataset, cmid: number): Quiz | undefined {
  let q = adminQuiz(cmid);
  const added = ds.admin?.addedModules.find((a) => a.module.id === cmid && a.module.modname === "quiz");
  if (!q && added)
    q = {
      id: cmid,
      coursemodule: cmid,
      course: added.courseid,
      name: added.module.name,
      intro: added.module.description ?? "",
      timeopen: 0,
      timeclose: 0,
      timelimit: 900,
      attempts: 3,
      grademethod: 1,
      sumgrades: 0,
      grade: 10,
      gradepass: 8,
      preferredbehaviour: "deferredfeedback",
    };
  if (!q) return undefined;
  const p = ds.admin?.quizSettings[cmid];
  if (!p) return q;
  return {
    ...q,
    name: p.name ?? q.name,
    timeopen: p.timeopen ?? q.timeopen,
    timeclose: p.timeclose ?? q.timeclose,
    timelimit: p.timelimit ?? q.timelimit,
    attempts: p.attempts ?? q.attempts,
    grademethod: p.grademethod ?? q.grademethod,
    gradepass: p.gradepass ?? q.gradepass,
  };
}

/** Chip điều kiện hoàn thành (CED-01): "Xem bài", "Đạt 8/10", "Tự đánh dấu" */
export function completionRule(ds: AdminDataset, m: AdminModule): string | null {
  if (m.completion === 0) return null;
  if (m.completion === 1) return "Tự đánh dấu";
  const parts: string[] = [];
  if (m.completionview) parts.push("Xem bài");
  if (m.completionpercent) parts.push(`Xem ${m.completionpercent}% video`);
  if (m.completionpassgrade) {
    const q = effectiveQuiz(ds, m.id);
    parts.push(q ? `Đạt ${formatNum(q.gradepass)}/${formatNum(q.grade)}` : "Đạt điểm");
    if (m.completionattemptsexhausted) parts.push("hoặc hết lượt");
  } else if (m.completionusegrade) parts.push("Có điểm");
  return parts.join(", ") || "Theo điều kiện";
}

function formatNum(n: number) {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100).replace(".", ",");
}

export interface AvailabilityCondition {
  type: "completion" | "grade" | "date" | "profile";
  cm?: number;
  e?: 0 | 1;
  min?: number;
  d?: ">=" | "<";
  t?: number;
  /** profile: trường hồ sơ, phép so sánh, giá trị */
  sf?: "department" | "email" | "institution" | "city";
  op?: "isequalto" | "contains" | "startswith";
  v?: string;
}

export interface AvailabilityTree {
  op: "&" | "|";
  c: AvailabilityCondition[];
}

export function parseAvailabilityTree(json: string | null | undefined): AvailabilityTree {
  if (!json) return { op: "&", c: [] };
  try {
    const t = JSON.parse(json) as { op?: "&" | "|"; c?: AvailabilityCondition[] };
    return { op: t.op === "|" ? "|" : "&", c: t.c ?? [] };
  } catch {
    return { op: "&", c: [] };
  }
}

export function parseAvailability(json: string | null | undefined): AvailabilityCondition[] {
  if (!json) return [];
  try {
    const tree = JSON.parse(json) as { c?: AvailabilityCondition[] };
    return tree.c ?? [];
  } catch {
    return [];
  }
}

export function buildAvailability(conds: AvailabilityCondition[], op: "&" | "|" = "&"): string | null {
  if (!conds.length) return null;
  return op === "&" ? JSON.stringify({ op, c: conds, showc: conds.map(() => true) }) : JSON.stringify({ op, c: conds, show: true });
}

const PROFILE_FIELD = { department: "Chức danh", email: "Email", institution: "Đơn vị", city: "Thành phố" };
const PROFILE_OP = { isequalto: "là", contains: "có chứa", startswith: "bắt đầu bằng" };

/** Mô tả điều kiện mở: ngắn cho chip (CED-02), đủ cho phần chi tiết */
export function describeCondition(ds: AdminDataset, c: AvailabilityCondition): { short: string; full: string } {
  const name = c.cm ? (findAdminModule(ds, c.cm)?.module.name ?? `bài #${c.cm}`) : "";
  if (c.type === "completion") return { short: `Mở sau: ${name}`, full: `Bài "${name}" được đánh dấu hoàn thành` };
  if (c.type === "grade") {
    const q = c.cm ? adminQuiz(c.cm) : undefined;
    const pts = q && c.min != null ? `${formatNum((c.min / 100) * q.grade)}/${formatNum(q.grade)}` : `${c.min}%`;
    return { short: `Cần đạt ${pts}: ${name}`, full: `Đạt từ ${pts} điểm ở "${name}"` };
  }
  if (c.type === "profile") {
    const t = `${PROFILE_FIELD[c.sf ?? "department"]} ${PROFILE_OP[c.op ?? "isequalto"]} "${c.v ?? ""}"`;
    return { short: t, full: t };
  }
  const when = c.t ? new Date(c.t * 1000).toLocaleDateString("vi-VN") : "";
  return c.d === "<"
    ? { short: `Đóng sau ${when}`, full: `Trước ngày ${when}` }
    : { short: `Mở từ ${when}`, full: `Từ ngày ${when}` };
}

/** Tóm tắt phần (CED-06) */
export function sectionSummary(section: AdminSection) {
  const lessons = section.modules.filter((m) => m.modname !== "label" && m.modname !== "qbank" && m.modname !== "forum");
  return {
    lessons: lessons.filter((m) => m.modname !== "quiz").length,
    quizzes: lessons.filter((m) => m.modname === "quiz").length,
    hidden: section.visible === 0,
    restricted: !!sectionAvailabilityOf(section),
  };
}

// ---------- Việc cần xử lý (Admin DASH-03) ----------

export function adminAlerts(ds: AdminDataset, now: number): AdminAlert[] {
  const out: AdminAlert[] = [];
  const pending = pendingSubmissions();
  for (const cmid of new Set(pending.map((p) => p.cmid))) {
    const found = findAdminModule(ds, cmid);
    if (!found) continue;
    const n = pending.filter((p) => p.cmid === cmid).length;
    out.push({
      id: `grading-${cmid}`,
      kind: "grading",
      title: `${n} bài nộp chờ chấm: ${found.module.name}`,
      detail: found.course.fullname,
      href: `/admin/courses/${found.course.id}/grades`,
      action: "Chấm bài",
    });
  }
  for (const c of ds.courses) {
    const students = courseEnrolments(ds, c.id).filter((e) => !e.suspended);
    if (!students.length)
      out.push({
        id: `nostudents-${c.id}`,
        kind: "noStudents",
        title: `Khóa chưa có học viên: ${c.fullname}`,
        detail: c.visible ? "Khóa đang hiển thị nhưng chưa ghi danh ai." : "Khóa đang ẩn. Ghi danh trước khi mở cho học viên.",
        href: `/admin/courses/${c.id}/participants`,
        action: "Ghi danh",
      });
    for (const s of courseSections(ds, c.id))
      for (const m of s.modules) {
        if (m.modname !== "quiz") continue;
        const q = effectiveQuiz(ds, m.id);
        if (!q) continue;
        if (!quizQuestionsOf(ds, m.id).length)
          out.push({
            id: `noq-${m.id}`,
            kind: "noQuestions",
            title: `Bài kiểm tra chưa có câu hỏi: ${m.name}`,
            detail: c.fullname,
            href: `/admin/quiz/${m.id}/edit`,
            action: "Thêm câu hỏi",
          });
        if (!students.length) continue;
        const rows = quizReport(ds, c.id, m.id)?.rows ?? [];
        if (q.timeclose && q.timeclose > now && q.timeclose - now <= 7 * DAY) {
          const notPassed = rows.filter((r) => !r.summary.passed).length;
          out.push({
            id: `closing-${m.id}`,
            kind: "closing",
            title: `${m.name} đóng sau ${Math.max(1, Math.ceil((q.timeclose - now) / DAY))} ngày`,
            detail: `${c.fullname}: ${notPassed} học viên chưa đạt.`,
            href: `/admin/quiz/${m.id}/results`,
            action: "Xem kết quả",
          });
        }
        for (const r of rows.filter((x) => x.summary.state === "exhausted"))
          out.push({
            id: `exhausted-${m.id}-${r.user.id}`,
            kind: "exhausted",
            title: `${r.user.fullname} hết lượt, chưa đạt ${m.name}`,
            detail: `${c.fullname}: điểm cao nhất ${formatNum(r.summary.best ?? 0)}/${formatNum(q.grade)}.`,
            href: `/admin/quiz/${m.id}/results`,
            action: "Xem kết quả",
          });
      }
  }
  const order: AdminAlert["kind"][] = ["grading", "exhausted", "closing", "noQuestions", "noStudents"];
  return out.sort((x, y) => order.indexOf(x.kind) - order.indexOf(y.kind));
}

// ---------- Khóa học của tôi (Admin MYC) ----------

/** /my/courses.php: khóa người dùng được ghi danh (mọi vai trò) + khóa họ vừa tạo trong mockup */
export function myCourses(ds: AdminDataset, userid: number): AdminCourse[] {
  const created = new Set(ds.admin?.newCourses.map((c) => c.id) ?? []);
  return ds.courses.filter(
    (c) => created.has(c.id) || courseEnrolments(ds, c.id, null).some((e) => e.user.id === userid),
  );
}

// ---------- Báo cáo dựng sẵn (Admin RPT-01) ----------

export { reportDefs, type ReportDef, type ReportId } from "@/lib/mock/admin/reports";

/** Người đang dùng admin mockup (không qua đăng nhập) */
export { ADMIN_USER_ID } from "@/lib/mock/admin/users";

// ---------- Tạo bài mới (Admin ACT-06: mặc định hoàn thành theo loại) ----------

/**
 * Default activity completion cấp site (Site administration > Courses > Default activity completion):
 * Video = xem 90%, Bài đọc, Tài liệu, Liên kết = xem bài, Bài kiểm tra = đạt điểm, Bài nộp = có điểm.
 * Văn bản, Diễn đàn, Phần con không theo dõi.
 */
export function defaultCompletion(modname: ModName): Pick<
  AdminModule,
  "completion" | "completionview" | "completionpercent" | "completionusegrade" | "completionpassgrade"
> {
  switch (modname) {
    case "drivevideo":
      return { completion: 2, completionpercent: 90 };
    case "quiz":
      return { completion: 2, completionusegrade: 1, completionpassgrade: 1 };
    case "assign":
      return { completion: 2, completionusegrade: 1 };
    case "page":
    case "resource":
    case "url":
    case "book":
    case "folder":
    case "h5pactivity":
    case "feedback":
      return { completion: 2, completionview: 1 };
    default:
      return { completion: 0 };
  }
}

export function createModule(id: number, modname: ModName, name: string, extra: Partial<AdminModule> = {}): AdminModule {
  return {
    id,
    instance: id,
    name,
    modname,
    url: `/mod/${modname}/view.php?id=${id}`,
    uservisible: true,
    visible: 1,
    ...defaultCompletion(modname),
    ...extra,
  };
}

// ---------- Cài đặt bài kiểm tra (Admin QUIZ-01) ----------

const REVIEW_ITEMS: ReviewItem[] = ["attempt", "correctness", "marks", "specificfeedback", "generalfeedback", "rightanswer", "overallfeedback"];
const all = (v: boolean) => Object.fromEntries(REVIEW_ITEMS.map((k) => [k, v])) as Record<ReviewItem, boolean>;

/**
 * Mặc định quiz theo rule VIGO (điểm chưa chốt số 5): 3 lượt, đạt 8/10, điểm cao nhất.
 * Xem lại đáp án: khớp learner hiện tại (xem đáp án đúng ngay sau khi nộp, câu hỏi BA learner số 4).
 */
export function quizSettingsOf(ds: AdminDataset, cmid: number): QuizSettings {
  const q = effectiveQuiz(ds, cmid);
  const saved = ds.admin?.quizSettings[cmid] ?? {};
  const mod = findAdminModule(ds, cmid)?.module;
  const review: Record<ReviewWhen, Record<ReviewItem, boolean>> = {
    during: { ...all(false), attempt: true },
    immediately: { ...all(true), specificfeedback: true },
    open: all(true),
    closed: all(true),
  };
  return {
    name: mod?.name ?? q?.name ?? "",
    intro: q?.intro ?? "",
    showdescription: false,
    timeopen: q?.timeopen ?? 0,
    timeclose: q?.timeclose ?? 0,
    timelimit: q?.timelimit ?? 900,
    overduehandling: "autosubmit",
    graceperiod: 0,
    gradepass: q?.gradepass ?? 8,
    attempts: q?.attempts ?? 3,
    grademethod: (q?.grademethod ?? 1) as QuizSettings["grademethod"],
    questionsperpage: 1,
    navmethod: "free",
    shuffleanswers: true,
    preferredbehaviour: "deferredfeedback",
    canredoquestions: false,
    attemptonlast: false,
    review,
    showuserpicture: 0,
    decimalpoints: 2,
    questiondecimalpoints: -1,
    showblocks: false,
    quizpassword: "",
    subnet: "",
    delay1: 0,
    delay2: 0,
    browsersecurity: "-",
    visible: (mod?.visible ?? 1) as 0 | 1,
    idnumber: mod?.idnumber ?? "",
    groupmode: 0,
    ...saved,
  };
}

// ---------- Nhập câu hỏi Excel (Admin QUIZ-04) ----------

export { QUIZ_COLUMNS, sampleImportRows } from "@/lib/mock/admin/quiz-import";

export interface ImportRow {
  line: number;
  cells: string[];
  errors: { column: string; message: string }[];
  question?: QuizQuestion;
}

const TYPE_MAP: Record<string, QuizQuestion["type"]> = { "chọn một": "multichoice", "chọn nhiều": "multichoiceset", "đúng/sai": "truefalse" };

/** Kiểm tra từng dòng, trả lỗi theo dòng và cột (local_quizexcel validate) */
export function validateImportRows(rows: string[][], startSlot: number): ImportRow[] {
  return rows.map((cells, i) => {
    const [type = "", text = "", a = "", b = "", c = "", d = "", e = "", correct = "", mark = ""] = cells.map((x) => (x ?? "").trim());
    const errors: ImportRow["errors"] = [];
    const t = TYPE_MAP[type.toLowerCase()];
    if (!t) errors.push({ column: "Loại câu", message: `"${type || "trống"}" không hợp lệ, dùng Chọn một, Chọn nhiều hoặc Đúng/Sai.` });
    if (!text) errors.push({ column: "Câu hỏi", message: "Thiếu nội dung câu hỏi." });
    if (mark && Number.isNaN(Number(mark.replace(",", ".")))) errors.push({ column: "Điểm", message: "Điểm phải là số." });
    const letters = ["A", "B", "C", "D", "E"];
    const opts = [a, b, c, d, e];
    let question: QuizQuestion | undefined;
    if (t === "truefalse") {
      const v = correct.toLowerCase();
      if (v !== "đúng" && v !== "sai") errors.push({ column: "Đáp án đúng", message: "Câu Đúng/Sai cần ghi Đúng hoặc Sai." });
      else
        question = {
          slot: 0,
          type: t,
          text: `<p>${text}</p>`,
          options: [
            { value: "true", label: "Đúng" },
            { value: "false", label: "Sai" },
          ],
          correct: [v === "đúng" ? "true" : "false"],
        };
    } else if (t) {
      const filled = opts.map((o, k) => ({ letter: letters[k], label: o })).filter((o) => o.label);
      if (filled.length < 2) errors.push({ column: "Đáp án A-E", message: "Cần ít nhất 2 đáp án." });
      const picks = correct.split(/[,;\s]+/).filter(Boolean).map((x) => x.toUpperCase());
      if (!picks.length) errors.push({ column: "Đáp án đúng", message: "Thiếu đáp án đúng." });
      const missing = picks.filter((p) => !filled.some((f) => f.letter === p));
      if (missing.length) errors.push({ column: "Đáp án đúng", message: `Đáp án ${missing.join(", ")} để trống.` });
      if (t === "multichoice" && picks.length > 1) errors.push({ column: "Đáp án đúng", message: "Câu Chọn một chỉ có 1 đáp án đúng." });
      if (!errors.length)
        question = {
          slot: 0,
          type: t,
          text: `<p>${text}</p>`,
          options: filled.map((f) => ({ value: f.letter.toLowerCase(), label: f.label })),
          correct: picks.map((p) => p.toLowerCase()),
        };
    }
    return { line: i + 2, cells, errors, question: errors.length ? undefined : question && { ...question, slot: startSlot + i } };
  });
}

/** Đọc CSV (dấu phẩy, có ngoặc kép) */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

// ---------- Ghi danh, phòng ban (Admin ENR, COH) ----------

export { ROLE_STUDENT, ROLE_EDITINGTEACHER } from "@/lib/mock/admin/users";

export function cohortMembersOf(ds: AdminDataset, cohortid: number) {
  const ids = new Set(ds.cohortMembers.filter((m) => m.cohortid === cohortid).map((m) => m.userid));
  return ds.users.filter((u) => ids.has(u.id));
}

/** COH-02: khóa đang đồng bộ tự động với phòng ban (enrol_cohort đang bật) */
export function cohortSyncCourses(ds: AdminDataset, cohortid: number) {
  const ids = ds.enrolInstances.filter((i) => i.enrol === "cohort" && i.customint1 === cohortid).map((i) => ({ courseid: i.courseid, active: i.status === 0 }));
  return ids
    .map((x) => ({ course: getAdminCourse(ds, x.courseid), active: x.active }))
    .filter((x): x is { course: AdminCourse; active: boolean } => !!x.course);
}

/** Số người theo từng cách ghi danh của khóa */
export function enrolInstanceCount(ds: AdminDataset, inst: EnrolInstance) {
  if (inst.enrol === "cohort") return ds.cohortMembers.filter((m) => m.cohortid === inst.customint1).length;
  return ds.userEnrolments.filter((u) => u.enrolid === inst.id).length;
}

export function enrolMethodName(ds: AdminDataset, inst: EnrolInstance) {
  if (inst.enrol === "manual") return "Ghi danh thủ công";
  if (inst.enrol === "cohort") return `Đồng bộ phòng ban: ${ds.cohorts.find((c) => c.id === inst.customint1)?.name ?? ""}`;
  if (inst.enrol === "self") return "Tự ghi danh";
  return "Khách";
}
