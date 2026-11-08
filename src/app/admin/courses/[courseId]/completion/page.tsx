/** Admin COMP-01..03. Moodle: /course/completion.php?id={courseId} */
import { CourseCompletionView } from "@/components/admin/completion/completion-views";

export const metadata = { title: "Hoàn thành khóa" };

export default async function CompletionPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <CourseCompletionView courseId={Number((await params).courseId)} />;
}
