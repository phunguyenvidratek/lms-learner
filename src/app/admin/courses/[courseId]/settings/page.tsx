/** Admin CSET-02, CSET-03. Moodle: /course/edit.php?id={courseId} */
import { CourseSettingsForm } from "@/components/admin/course/course-settings-form";

export const metadata = { title: "Cài đặt khóa" };

export default async function CourseSettingsPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <CourseSettingsForm courseId={Number((await params).courseId)} />;
}
