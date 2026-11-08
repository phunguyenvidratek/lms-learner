/** Moodle: /course/view.php?id= . Trang khóa của người soạn mở thẳng tab Nội dung. */
import { redirect } from "next/navigation";

export default async function CourseIndex({ params }: { params: Promise<{ courseId: string }> }) {
  redirect(`/admin/courses/${(await params).courseId}/edit`);
}
