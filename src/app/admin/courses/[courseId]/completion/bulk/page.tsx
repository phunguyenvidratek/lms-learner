/** Admin COMP-03. Moodle: /course/bulkcompletion.php?id={courseId} */
import { BulkCompletionView } from "@/components/admin/completion/completion-views";

export const metadata = { title: "Sửa hàng loạt hoàn thành" };

export default async function BulkCompletionPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <BulkCompletionView courseId={Number((await params).courseId)} />;
}
