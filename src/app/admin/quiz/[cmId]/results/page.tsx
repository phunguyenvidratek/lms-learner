/** Admin QUIZ-05. Moodle: /mod/quiz/report.php?id={cmId}&mode=overview */
import { QuizResultsView } from "@/components/admin/quiz/quiz-results-view";

export const metadata = { title: "Kết quả bài kiểm tra" };

export default async function QuizResultsPage({ params }: { params: Promise<{ cmId: string }> }) {
  return <QuizResultsView cmid={Number((await params).cmId)} />;
}
