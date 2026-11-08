/** Admin QUIZ-04. Moodle: /local/quizexcel/import.php?cmid={cmId} */
import { QuizImportView } from "@/components/admin/quiz/quiz-import-view";

export const metadata = { title: "Thêm câu hỏi từ Excel" };

export default async function QuizImportPage({ params }: { params: Promise<{ cmId: string }> }) {
  return <QuizImportView cmid={Number((await params).cmId)} />;
}
