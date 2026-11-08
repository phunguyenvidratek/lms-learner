/** Admin ENR-01..03. Moodle: /user/index.php?id={courseId} */
import { ParticipantsView } from "@/components/admin/enrol/participants-view";

export const metadata = { title: "Học viên của khóa" };

export default async function ParticipantsPage({ params }: { params: Promise<{ courseId: string }> }) {
  return <ParticipantsView courseId={Number((await params).courseId)} />;
}
