/** Admin NOTI-02. Moodle: /mod/forum/post.php?forum={site news forum} */
import { AnnouncementForm } from "@/components/admin/calendar/calendar-views";

export const metadata = { title: "Đăng thông báo" };

export default function NewAnnouncementPage() {
  return <AnnouncementForm />;
}
