/** Admin QUIZ-02, QUIZ-03. Moodle: /mod/quiz/edit.php?cmid={cmId} */
import { QuizQuestionsView } from "@/components/admin/quiz/quiz-questions-view";

export const metadata = { title: "Câu hỏi bài kiểm tra" };

export default async function QuizEditPage({ params }: { params: Promise<{ cmId: string }> }) {
  return <QuizQuestionsView cmid={Number((await params).cmId)} />;
}
