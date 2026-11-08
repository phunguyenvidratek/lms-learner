/**
 * Type dữ liệu quản trị, mô phỏng response Moodle 5.1 (rút gọn). Tên field giữ đúng như Moodle
 * (bảng DB hoặc web service ghi trong comment) để khi nối thật chỉ đổi nguồn ở src/lib/admin-data.ts.
 */
import type { Announcement, CourseInfo, CourseModule, CourseSection } from "./moodle";

/** core_user_get_users > users[] (user + customfields) */
export interface AdminUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  idnumber: string;
  /** Field core "Department" của Moodle: dùng làm chức danh, không phải phòng ban */
  department: string;
  institution: string;
  city: string;
  /** manual = tài khoản thường, oauth2 = đăng nhập Google */
  auth: "manual" | "oauth2";
  suspended: boolean;
  /** 0 = chưa đăng nhập lần nào */
  firstaccess: number;
  lastaccess: number;
  timecreated: number;
  /** Profile field tùy chỉnh. phongban: tên phòng ban hiển thị trên danh sách (USER-02) */
  customfields: { shortname: string; name: string; value: string }[];
  /** Vai trò cấp hệ thống (role_assignments contextlevel 10) */
  systemroles: ("manager" | "coursecreator")[];
}

/** core_cohort_get_cohorts > cohorts[]. VIGO gọi cohort là "Phòng ban". */
export interface Cohort {
  id: number;
  name: string;
  idnumber: string;
  description: string;
  visible: boolean;
  /** Bảng cohort.component: rỗng = tạo tay */
  component: string;
  timecreated: number;
}

/** cohort_members */
export interface CohortMember {
  cohortid: number;
  userid: number;
  timeadded: number;
}

/** core_course_get_categories > categories[] */
export interface CourseCategory {
  id: number;
  name: string;
  idnumber: string;
  description: string;
  parent: number;
  sortorder: number;
  /** Số khóa trực tiếp trong danh mục */
  coursecount: number;
  visible: number;
  depth: number;
  /** Ví dụ "/1/3" */
  path: string;
}

/**
 * Khóa học theo góc nhìn admin: core_course_get_courses (bảng course) + course custom fields.
 * Phần nội dung hiển thị (summary, ảnh...) dùng chung CourseInfo của learner.
 */
export interface AdminCourse extends CourseInfo {
  categoryid: number;
  idnumber: string;
  /** 1 = hiển thị với học viên, 0 = ẩn */
  visible: 0 | 1;
  format: "topics" | "weeks" | "singleactivity";
  /** Bật Completion tracking */
  enablecompletion: 0 | 1;
  showcompletionconditions: 0 | 1;
  timecreated: number;
  /** Course custom field "Nhóm chương trình" (MYC-03) */
  programgroup: ProgramGroup;
}

export type ProgramGroup = "Foundational" | "Brands" | "Integrated";

/** core_enrol_get_course_enrolment_methods + bảng enrol */
export interface EnrolInstance {
  id: number;
  courseid: number;
  /** manual = ghi danh thủ công, cohort = đồng bộ phòng ban, self = tự ghi danh, guest = khách */
  enrol: "manual" | "cohort" | "self" | "guest";
  /** 0 = bật, 1 = tắt (ENROL_INSTANCE_ENABLED / DISABLED) */
  status: 0 | 1;
  name: string;
  /** enrol_cohort: customint1 = cohortid */
  customint1?: number;
  /** Vai trò gán khi ghi danh */
  roleid: number;
  /** Thời hạn ghi danh (giây), 0 = không giới hạn */
  enrolperiod: number;
  timecreated: number;
}

/** user_enrolments */
export interface UserEnrolment {
  id: number;
  enrolid: number;
  userid: number;
  /** 0 = đang hoạt động, 1 = tạm dừng */
  status: 0 | 1;
  timestart: number;
  timeend: number;
  timecreated: number;
}

/** Vai trò core (bảng role) */
export interface Role {
  id: number;
  shortname: "manager" | "coursecreator" | "editingteacher" | "teacher" | "student";
  /** Nhãn tiếng Việt theo Language customisation (SHELL-06) */
  name: string;
}

// ---------- Cài đặt bài kiểm tra (course/modedit.php?update=<quiz cmid>) ----------

export type ReviewWhen = "during" | "immediately" | "open" | "closed";
export type ReviewItem = "attempt" | "correctness" | "marks" | "specificfeedback" | "generalfeedback" | "rightanswer" | "overallfeedback";

/** Field của form quiz (bảng quiz). Đủ các nhóm của Moodle 5.1, nhóm đã tắt ở site ghi chú trong form. */
export interface QuizSettings {
  name: string;
  intro: string;
  showdescription: boolean;
  timeopen: number;
  timeclose: number;
  /** giây, 0 = không giới hạn */
  timelimit: number;
  overduehandling: "autosubmit" | "graceperiod" | "autoabandon";
  graceperiod: number;
  gradepass: number;
  /** 0 = không giới hạn */
  attempts: number;
  /** 1 điểm cao nhất, 2 trung bình, 3 lần đầu, 4 lần cuối */
  grademethod: 1 | 2 | 3 | 4;
  /** 0 = tất cả câu một trang */
  questionsperpage: number;
  navmethod: "free" | "seq";
  shuffleanswers: boolean;
  preferredbehaviour: "deferredfeedback" | "adaptive" | "adaptivenopenalty" | "immediatefeedback" | "immediatecbm" | "interactive";
  canredoquestions: boolean;
  attemptonlast: boolean;
  review: Record<ReviewWhen, Record<ReviewItem, boolean>>;
  showuserpicture: 0 | 1 | 2;
  decimalpoints: number;
  questiondecimalpoints: number;
  showblocks: boolean;
  quizpassword: string;
  subnet: string;
  delay1: number;
  delay2: number;
  browsersecurity: "-" | "securewindow";
  visible: 0 | 1;
  idnumber: string;
  groupmode: 0 | 1 | 2;
}

// ---------- Điều kiện hoàn thành khóa (course/completion.php) ----------

export interface CompletionCriteria {
  /** Điều kiện chung: 1 = mọi điều kiện, 2 = bất kỳ */
  aggregation: 1 | 2;
  /** Condition: Activity completion */
  activities: number[];
  activityaggregation: 1 | 2;
  /** Condition: Course grade (điểm khóa tối thiểu, null = không dùng) */
  grade: number | null;
  /** Condition: Date */
  date: number | null;
  /** Condition: Enrolment duration (ngày) */
  enrolperiod: number | null;
  /** Condition: Unenrolment */
  unenrol: boolean;
  /** Condition: Manual self completion */
  selfcompletion: boolean;
  /** Condition: Completion of other courses */
  othercourses: number[];
  /** Condition: Manual completion by others (roleid) */
  roles: number[];
}

// ---------- Thay đổi admin tạo trong mockup (src/lib/store/admin-store.tsx) ----------

export interface AddedModule {
  courseid: number;
  section: number;
  module: AdminModule;
}

export interface AdminState {
  v: 1;
  /** Công tắc Chế độ chỉnh sửa trên thanh trên cùng (user preference editing của Moodle) */
  editing: boolean;
  /** course/edit.php: field khóa đã sửa */
  courses: Record<number, Partial<AdminCourse>>;
  newCourses: AdminCourse[];
  addedModules: AddedModule[];
  /** course/modedit.php?update=: field module đã sửa */
  updatedModules: Record<number, Partial<AdminModule>>;
  deletedModules: number[];
  users: AdminUser[];
  updatedUsers: Record<number, Partial<AdminUser>>;
  cohortMembers: CohortMember[];
  enrolInstances: EnrolInstance[];
  userEnrolments: UserEnrolment[];
  /** course/editsection.php: khóa "courseid:section" */
  sections: Record<string, { name?: string; summary?: string; visible?: number }>;
  /** Phần mới thêm: courseid -> số phần thêm */
  addedSections: Record<number, number>;
  cohorts: Cohort[];
  announcements: Announcement[];
  quizSettings: Record<number, Partial<QuizSettings>>;
  completion: Record<number, CompletionCriteria>;
  /** Thùng rác: cmid -> thời điểm xóa */
  recycle: Record<number, number>;
  /** enrol.status đã đổi: enrolid -> 0 bật, 1 tắt */
  enrolStatus: Record<number, 0 | 1>;
}

/**
 * Module theo góc nhìn người soạn: CourseModule + field cấu hình của course_modules.
 * availability là JSON điều kiện truy cập chuẩn Moodle (core_availability), ví dụ
 * {"op":"&","c":[{"type":"completion","cm":1112,"e":1}],"showc":[true]}.
 * Mockup: điều kiện grade dùng "cm" (cmid quiz) thay cho "id" (grade item id) cho dễ tra.
 */
export interface AdminModule extends CourseModule {
  availability?: string | null;
  /** Completion: yêu cầu xem bài */
  completionview?: 0 | 1;
  /** Completion: yêu cầu nhận điểm */
  completionusegrade?: 0 | 1;
  /** Completion: yêu cầu đạt điểm (quiz) */
  completionpassgrade?: 0 | 1;
  /** Completion: hoặc hết lượt làm (quiz) */
  completionattemptsexhausted?: 0 | 1;
  /** drivevideo: % xem tối thiểu */
  completionpercent?: number;
  /** Ngày nhắc trên Dòng thời gian */
  completionexpected?: number;
  idnumber?: string;
  showdescription?: 0 | 1;
}

export interface AdminSection extends CourseSection {
  visible: number;
  modules: AdminModule[];
  /** JSON điều kiện truy cập của phần */
  availability?: string | null;
}

export interface AdminAlert {
  id: string;
  kind: "grading" | "noStudents" | "noQuestions" | "closing" | "exhausted";
  title: string;
  detail: string;
  href: string;
  action: string;
}
