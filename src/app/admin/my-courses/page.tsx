/** Admin MYC-01..04. Moodle: /my/courses.php */
import { MyCoursesView } from "@/components/admin/course/my-courses-view";

export const metadata = { title: "Khóa học của tôi" };

export default function MyCoursesPage() {
  return <MyCoursesView />;
}
