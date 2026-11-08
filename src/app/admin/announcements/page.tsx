/** Admin NOTI-02, HOME-03. Moodle: /mod/forum/view.php?f={site news forum} */
import { AnnouncementsView } from "@/components/admin/calendar/calendar-views";
import { mod_forum_get_forum_discussions_site_news } from "@/lib/admin-data";

export const metadata = { title: "Thông báo chung" };

export default async function AnnouncementsPage() {
  return <AnnouncementsView announcements={await mod_forum_get_forum_discussions_site_news()} />;
}
