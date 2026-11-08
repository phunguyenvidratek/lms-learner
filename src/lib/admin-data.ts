/**
 * Lớp truy cập dữ liệu phía server cho admin portal (tương tự src/lib/data.ts của learner).
 * Mỗi hàm đặt tên theo Moodle web service tương ứng. Mockup trả dữ liệu tĩnh trong src/lib/mock/admin.
 * Admin thật vẫn là trang PHP của Moodle 5.1 + Boost Union: các hàm này chỉ để mockup có dữ liệu,
 * không phải API cần làm thêm.
 *
 * Số liệu phụ thuộc tiến độ học viên (%, trạng thái, kết quả quiz) tính phía client qua useAdmin()
 * (src/lib/store/admin-store.tsx) vì cần state thật của learner portal.
 */
import { adminCourseContents, adminQuiz } from "@/lib/admin";
import { adminCourses, categories, draftQuizzes } from "@/lib/mock/admin/courses";
import { enrolInstances } from "@/lib/mock/admin/enrolments";
import { ADMIN_USER_ID, cohortMembers, cohorts, roles, users } from "@/lib/mock/admin/users";
import { announcements, calendarEvents, quizzes } from "@/lib/mock/data";
import { quizQuestions } from "@/lib/mock/questions";

/** Người đang dùng admin (mockup không qua đăng nhập) */
export async function core_webservice_get_site_info() {
  return users.find((u) => u.id === ADMIN_USER_ID)!;
}

export async function core_course_get_categories() {
  return categories;
}

export async function core_course_get_courses() {
  return adminCourses;
}

export async function core_course_get_courses_by_field(id: number) {
  return adminCourses.find((c) => c.id === id);
}

export async function core_course_get_contents(courseid: number) {
  return adminCourseContents(courseid);
}

export async function mod_quiz_get_quizzes_by_courses(courseids: number[]) {
  return [...quizzes, ...draftQuizzes].filter((q) => courseids.includes(q.course));
}

export async function mod_quiz_get_quiz(cmid: number) {
  return adminQuiz(cmid);
}

/** Câu hỏi của quiz (mod/quiz/edit.php). Quiz khóa nháp chưa có câu hỏi. */
export async function mod_quiz_get_quiz_questions(cmid: number) {
  return quizQuestions[cmid] ?? [];
}

export async function core_user_get_users() {
  return users;
}

export async function core_cohort_get_cohorts() {
  return cohorts;
}

export async function core_cohort_get_cohort_members(cohortids: number[]) {
  return cohortMembers.filter((m) => cohortids.includes(m.cohortid));
}

export async function core_enrol_get_course_enrolment_methods(courseid: number) {
  return enrolInstances.filter((i) => i.courseid === courseid);
}

export async function core_role_get_roles() {
  return roles;
}

export async function core_calendar_get_calendar_monthly_view() {
  return calendarEvents;
}

export async function mod_forum_get_forum_discussions_site_news() {
  return announcements;
}
