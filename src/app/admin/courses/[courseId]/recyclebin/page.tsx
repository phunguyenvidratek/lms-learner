/** Admin SHELL-05 (Thêm > Thùng rác). Moodle: /admin/tool/recyclebin/index.php?contextid= */
import { RecycleBinView } from "@/components/admin/course/course-more-views";

export const metadata = { title: "Thùng rác" };

export default async function RecycleBinPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <RecycleBinView courseId={Number((await params).courseId)} />;
}
