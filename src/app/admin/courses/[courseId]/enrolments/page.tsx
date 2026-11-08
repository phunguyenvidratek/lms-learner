/** Admin ENR-04, ENR-02. Moodle: /enrol/instances.php?id={courseId} */
import { EnrolMethodsView } from "@/components/admin/enrol/enrol-methods-view";

export const metadata = { title: "Cách ghi danh" };

export default async function EnrolMethodsPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <EnrolMethodsView courseId={Number((await params).courseId)} />;
}
