/**
 * Type dữ liệu quản trị, mô phỏng response Moodle 5.1 (rút gọn). Tên field giữ đúng như Moodle
 * (bảng DB hoặc web service ghi trong comment) để khi nối thật chỉ đổi nguồn ở src/lib/admin-data.ts.
 */
import type { CourseInfo } from "./moodle";

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
