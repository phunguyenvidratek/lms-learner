/** Admin CSET-01..03. Moodle: /course/edit.php?category={id} */
import { CourseSettingsForm } from "@/components/admin/course/course-settings-form";

export const metadata = { title: "Tạo khóa mới" };

export default async function NewCoursePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <CourseSettingsForm categoryId={category ? Number(category) : undefined} />;
}
