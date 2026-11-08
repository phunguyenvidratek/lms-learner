/** Admin RPT-04. Moodle: /grade/report/grader/index.php?id={courseId} */
import { GraderView } from "@/components/admin/reports/course-reports";

export const metadata = { title: "Sổ điểm" };

export default async function GradesPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <GraderView courseId={Number((await params).courseId)} />;
}
