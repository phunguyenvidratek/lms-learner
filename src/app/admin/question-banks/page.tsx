/** Admin QUIZ-06, SHELL-03. Moodle không có trang cấp site: lối vào chọn khóa rồi tới /question/banks.php?courseid= */
import { QuestionBanksIndexView } from "@/components/admin/quiz/question-banks-view";

export const metadata = { title: "Ngân hàng câu hỏi" };

export default function QuestionBanksPage() {
  return <QuestionBanksIndexView />;
}
