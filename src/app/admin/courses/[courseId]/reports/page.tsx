/** Admin SHELL-05 (tab Báo cáo). Moodle: /report/view.php?courseid={courseId} */
import { CourseReportsView } from "@/components/admin/reports/course-reports";

export const metadata = { title: "Báo cáo của khóa" };

export default async function CourseReportsPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <CourseReportsView courseId={Number((await params).courseId)} />;
}
