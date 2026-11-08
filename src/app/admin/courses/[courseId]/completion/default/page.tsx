/** Admin COMP-03, ACT-06. Moodle: /course/defaultcompletion.php?id={courseId} */
import { DefaultCompletionView } from "@/components/admin/completion/completion-views";

export const metadata = { title: "Mặc định hoàn thành bài" };

export default async function DefaultCompletionPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <DefaultCompletionView courseId={Number((await params).courseId)} />;
}
