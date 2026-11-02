/**
 * Type mô phỏng response của Moodle Web Service (bản 5.x).
 * Chỉ giữ các field learner portal dùng. Tên field giữ đúng như Moodle trả về
 * để khi nối API thật chỉ cần đổi nguồn dữ liệu trong src/lib/data.ts.
 * Duy kiểm lại trên Site administration > Server > Web services > API Documentation.
 */

/** core_webservice_get_site_info */
export interface SiteInfo {
  sitename: string;
  userid: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  userpictureurl: string;
  lang: string;
}

/** core_course_get_enrolled_courses_by_timeline_classification > courses[] */
export interface EnrolledCourse {
  id: number;
  fullname: string;
  shortname: string;
  summary: string; // HTML
  courseimage: string; // pluginfile url, cần token
  progress: number | null; // % activity completion, null nếu khóa không bật completion
  hasprogress: boolean;
  isfavourite: boolean;
  hidden: boolean;
  lastaccess?: number | null;
  startdate: number;
  enddate: number;
  coursecategory: string;
  /** Không có trong WS: mockup tự thêm, lấy từ core_completion_get_course_completion_status */
  completed?: boolean;
}

export type TimelineClassification = "all" | "inprogress" | "future" | "past" | "favourites" | "hidden";

/** core_completion_get_activities_completion_status > statuses[] (rút gọn, gộp vào module) */
export interface CompletionData {
  state: 0 | 1 | 2 | 3; // 0 chưa xong, 1 xong, 2 xong và đạt, 3 xong nhưng không đạt
  timecompleted: number;
  /** 0 = không theo dõi, 1 = thủ công (Mark as done), 2 = tự động theo điều kiện */
  tracking: 0 | 1 | 2;
  isautomatic: boolean;
}

/** Loại module hay gặp. drivevideo là custom của team (link Google Drive) - tên thật chờ Đạt Trần chốt. */
export type ModName =
  | "page"
  | "resource"
  | "url"
  | "folder"
  | "book"
  | "label"
  | "quiz"
  | "forum"
  | "assign"
  | "h5pactivity"
  | "feedback"
  | "glossary"
  | "qbank"
  | "drivevideo";

/** core_course_get_contents > sections[].modules[] */
export interface CourseModule {
  id: number; // cmid
  instance: number;
  name: string;
  modname: ModName;
  description?: string; // HTML
  url?: string;
  uservisible: boolean;
  visible: number;
  availabilityinfo?: string | null; // HTML, lý do bị khóa
  completion: 0 | 1 | 2;
  completiondata?: CompletionData;
  contents?: ModuleContentFile[];
  /** Không có trong Moodle: thời lượng video, lấy từ custom field của module video */
  customdata_duration?: number;
}

export interface ModuleContentFile {
  type: "file" | "url" | "content";
  filename: string;
  fileurl: string;
  filesize: number;
  mimetype?: string;
}

/** core_course_get_contents > sections[] */
export interface CourseSection {
  id: number;
  name: string;
  section: number; // số thứ tự
  summary: string;
  uservisible: boolean;
  availabilityinfo?: string | null;
  modules: CourseModule[];
}

/** core_completion_get_course_completion_status */
export interface CourseCompletionStatus {
  completed: boolean;
  aggregation: 1 | 2; // 1 = tất cả, 2 = bất kỳ
  completions: { type: number; title: string; status: string; complete: boolean; details: { criteria: string; requirement: string; status: string } }[];
}

/** mod_quiz_get_quizzes_by_courses > quizzes[] (rút gọn) */
export interface Quiz {
  id: number;
  coursemodule: number;
  course: number;
  name: string;
  intro: string;
  timeopen: number;
  timeclose: number;
  timelimit: number; // giây, 0 = không giới hạn
  attempts: number; // 0 = không giới hạn
  grademethod: number;
  sumgrades: number;
  grade: number; // điểm tối đa
  gradepass: number; // grade to pass
  preferredbehaviour: "deferredfeedback" | "immediatefeedback" | "interactive";
}

/** mod_quiz_get_user_quiz_attempts > attempts[] */
export interface QuizAttempt {
  id: number;
  quiz: number;
  attempt: number;
  state: "inprogress" | "overdue" | "finished" | "abandoned";
  timestart: number;
  timefinish: number;
  sumgrades: number | null;
}

/**
 * Câu hỏi đã chuẩn hóa cho UI. Moodle (mod_quiz_get_attempt_data) trả HTML render sẵn,
 * nên đây là dạng FE mong muốn sau khi parse HTML hoặc sau khi BE viết API JSON (điểm chưa chốt QUIZ-02).
 */
export interface QuizQuestion {
  slot: number;
  type: "multichoice" | "multichoiceset" | "truefalse";
  text: string;
  options: { value: string; label: string }[];
  /** Chỉ có khi review */
  correct?: string[];
  feedback?: string;
}

/** message_popup_get_popup_notifications > notifications[] */
export interface Notification {
  id: number;
  subject: string;
  smallmessage: string;
  contexturl: string | null;
  timecreated: number;
  read: boolean;
  component: string;
}

/** core_calendar_* > events[] */
export interface CalendarEvent {
  id: number;
  name: string;
  description: string;
  eventtype: "site" | "course" | "user" | "close" | "open";
  timestart: number;
  timeduration: number;
  courseid?: number;
  coursename?: string;
  location?: string;
}

/** mod_forum_get_forum_discussions > discussions[] (site announcements) */
export interface Announcement {
  id: number;
  name: string;
  message: string; // HTML
  created: number;
  userfullname: string;
}

/** gradereport_overview_get_course_grades > grades[] */
export interface CourseGrade {
  courseid: number;
  coursename: string;
  grade: string; // dạng hiển thị, ví dụ "8.00"
  rawgrade: string | null;
  gradepass?: number;
}
