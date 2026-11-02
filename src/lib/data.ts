/**
 * Lớp truy cập dữ liệu. Mỗi hàm đặt tên theo Moodle web service function tương ứng.
 * Mockup: trả mock data. Khi nối Moodle thật: thay phần thân hàm bằng lời gọi
 *   POST {MOODLE_URL}/webservice/rest/server.php
 *   wstoken=...&wsfunction=<tên>&moodlewsrestformat=json&<tham số>
 * Giữ nguyên chữ ký hàm để UI không phải sửa.
 */
import * as mock from "@/lib/mock/data";
import type {
  CourseModule,
  CourseSection,
  EnrolledCourse,
  TimelineClassification,
} from "@/types/moodle";

// ---------- Web service functions ----------

export async function core_webservice_get_site_info() {
  return mock.siteInfo;
}

export async function core_course_get_enrolled_courses_by_timeline_classification(
  classification: TimelineClassification = "all",
): Promise<EnrolledCourse[]> {
  const all = mock.enrolledCourses.filter((c) => !c.hidden);
  switch (classification) {
    case "favourites":
      return all.filter((c) => c.isfavourite);
    case "hidden":
      return mock.enrolledCourses.filter((c) => c.hidden);
    default:
      return all;
  }
}

export async function core_course_get_contents(courseid: number): Promise<CourseSection[]> {
  return mock.courseContents[courseid] ?? [];
}

export async function core_completion_get_course_completion_status(courseid: number) {
  return mock.completionStatus[courseid] ?? null;
}

export async function mod_quiz_get_quizzes_by_courses(courseids: number[]) {
  return mock.quizzes.filter((q) => courseids.includes(q.course));
}

export async function mod_quiz_get_user_quiz_attempts(quizid: number) {
  return mock.quizAttempts[quizid] ?? [];
}

export async function message_popup_get_popup_notifications() {
  return mock.notifications;
}

export async function message_popup_get_unread_popup_notification_count() {
  return mock.notifications.filter((n) => !n.read).length;
}

export async function mod_forum_get_forum_discussions_site_news() {
  return mock.announcements;
}

export async function core_calendar_get_calendar_monthly_view() {
  return mock.calendarEvents;
}

export async function gradereport_overview_get_course_grades() {
  return mock.courseGrades;
}

// ---------- Logic dùng chung (theo backlog INT-03, CDET-05) ----------

export type CourseStatus = "notstarted" | "inprogress" | "completed";

/**
 * INT-03: một định nghĩa trạng thái khóa dùng cho mọi màn.
 * Completed dựa vào course completion, không dựa vào progress 100%.
 * (Điểm chưa chốt: BA chốt lại với Vi/Thiện.)
 */
export function getCourseStatus(course: EnrolledCourse): CourseStatus {
  if (course.completed) return "completed";
  if (!course.progress) return "notstarted";
  return "inprogress";
}

/** CDET-05: bỏ module không dành cho người học khỏi outline. Label hiển thị inline. */
const HIDDEN_FOR_LEARNER = new Set(["qbank"]);

export function learnerModules(section: CourseSection): CourseModule[] {
  return section.modules.filter((m) => !HIDDEN_FOR_LEARNER.has(m.modname));
}

/** Module "học được" để đi Previous/Next (bỏ label, forum, module bị khóa). */
export function playableModules(sections: CourseSection[]): CourseModule[] {
  return sections
    .filter((s) => s.uservisible)
    .flatMap(learnerModules)
    .filter((m) => m.uservisible && m.modname !== "label" && m.modname !== "forum");
}

export function isModuleDone(m: CourseModule): boolean {
  return m.completiondata ? m.completiondata.state === 1 || m.completiondata.state === 2 : false;
}

export function sectionProgress(section: CourseSection) {
  const tracked = learnerModules(section).filter((m) => m.completion > 0);
  return { done: tracked.filter(isModuleDone).length, total: tracked.length };
}

/** DASH-02 / CDET: bài đầu tiên chưa hoàn thành, dùng cho nút Học tiếp */
export function nextModuleToLearn(sections: CourseSection[]): CourseModule | undefined {
  const list = playableModules(sections);
  return list.find((m) => m.completion > 0 && !isModuleDone(m)) ?? list[0];
}
