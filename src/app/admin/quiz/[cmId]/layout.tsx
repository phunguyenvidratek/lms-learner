/** Admin QUIZ: khung trang bài kiểm tra. Moodle: secondary navigation của mod_quiz. */
import { QuizFrame } from "@/components/admin/layout/course-frame";

export default async function QuizLayout({ params, children }: { params: Promise<{ cmId: string }>; children: React.ReactNode }) {
  const { cmId } = await params;
  return <QuizFrame cmid={Number(cmId)}>{children}</QuizFrame>;
}
