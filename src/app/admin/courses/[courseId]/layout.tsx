/** Admin SHELL-05, SHELL-07: khung trang khóa (tiêu đề, tab). Moodle: secondary navigation của khóa. */
import { CourseFrame } from "@/components/admin/layout/course-frame";

export default async function CourseLayout({
  params,
  children,
}: {
  params: Promise<{ courseId: string }>;
  children: React.ReactNode;
}) {
  const { courseId } = await params;
  return <CourseFrame courseId={Number(courseId)}>{children}</CourseFrame>;
}
