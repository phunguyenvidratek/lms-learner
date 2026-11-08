/** Admin CAT-01..03. Moodle: /course/management.php?categoryid= */
import { CourseManagementView } from "@/components/admin/course/course-management-view";

export const metadata = { title: "Quản lý khóa" };

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ categoryid?: string }> }) {
  const { categoryid } = await searchParams;
  return <CourseManagementView initialCategory={categoryid ? Number(categoryid) : null} />;
}
