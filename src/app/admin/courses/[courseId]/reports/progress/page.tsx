/** Admin RPT-03. Moodle: /report/progress/index.php?course={courseId} */
import { ProgressReportView } from "@/components/admin/reports/course-reports";

export const metadata = { title: "Hoàn thành bài" };

export default async function ProgressReportPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <ProgressReportView courseId={Number((await params).courseId)} />;
}
