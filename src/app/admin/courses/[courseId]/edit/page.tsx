/** Admin CED-01..07. Moodle: /course/view.php?id={courseId}&edit=on */
import { CourseEditor } from "@/components/admin/editor/course-editor";

export const metadata = { title: "Soạn nội dung khóa" };

export default async function CourseEditPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CourseEditor courseId={Number(courseId)} />;
}
