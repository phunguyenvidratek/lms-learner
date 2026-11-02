/**
 * Lớp truy cập dữ liệu phía server. Mỗi hàm đặt tên theo Moodle web service function tương ứng.
 * Mockup: trả nội dung tĩnh trong src/lib/mock. Khi nối Moodle thật: thay phần thân hàm bằng lời gọi
 *   POST {MOODLE_URL}/webservice/rest/server.php
 *   wstoken=...&wsfunction=<tên>&moodlewsrestformat=json&<tham số>
 * Giữ nguyên chữ ký hàm để UI không phải sửa.
 *
 * Tiến độ cá nhân (completiondata, lượt làm quiz, yêu thích, thông báo đã đọc) trong mockup do
 * store phía client giữ (src/lib/store), logic tính nằm ở src/lib/learning.ts.
 */
import * as mock from "@/lib/mock/data";
import { pageContents } from "@/lib/mock/pages";
import { findModule } from "@/lib/learning";
import type { CourseInfo, CourseSection } from "@/types/moodle";

export async function core_webservice_get_site_info() {
  return mock.siteInfo;
}

export async function core_course_get_courses_by_field(id: number): Promise<CourseInfo | undefined> {
  return mock.courses.find((c) => c.id === id);
}

export async function core_course_get_contents(courseid: number): Promise<CourseSection[]> {
  return mock.courseContents[courseid] ?? [];
}

/** Tìm module theo cmid (core_course_get_course_module) */
export async function core_course_get_course_module(cmid: number) {
  return findModule(cmid);
}

export async function mod_page_get_pages_by_courses(cmid: number) {
  return pageContents[cmid] ?? null;
}

export async function mod_quiz_get_quizzes_by_courses(courseids: number[]) {
  return mock.quizzes.filter((q) => courseids.includes(q.course));
}

export async function mod_forum_get_forum_discussions(courseid: number) {
  return mock.forumDiscussions.filter((d) => d.courseid === courseid);
}

export async function mod_forum_get_forum_discussions_site_news() {
  return mock.announcements;
}

export async function core_calendar_get_calendar_monthly_view() {
  return mock.calendarEvents;
}

export async function local_learningpath_get_paths() {
  return mock.learningPaths;
}
