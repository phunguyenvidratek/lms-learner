/** Moodle: /mod/quiz/view.php?id= . Người soạn mở thẳng trang câu hỏi. */
import { redirect } from "next/navigation";

export default async function QuizIndex({ params }: { params: Promise<{ cmId: string }> }) {
  redirect(`/admin/quiz/${(await params).cmId}/edit`);
}
