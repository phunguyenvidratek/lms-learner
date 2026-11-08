/** Admin SHELL-05 (Thêm > Dùng lại khóa). Moodle: /backup/import.php?id={courseId} */
import { ReuseView } from "@/components/admin/course/course-more-views";

export const metadata = { title: "Dùng lại khóa" };

export default async function ReusePage({ params }: { params: Promise<{ courseId: string }> }) {
  return <ReuseView courseId={Number((await params).courseId)} />;
}
