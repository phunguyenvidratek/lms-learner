/** Admin QUIZ-06. Moodle: /question/banks.php?courseid={courseId} */
import { CourseBanksView } from "@/components/admin/quiz/question-banks-view";

export const metadata = { title: "Ngân hàng câu hỏi" };

export default async function CourseBanksPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <CourseBanksView courseId={Number((await params).courseId)} />;
}
