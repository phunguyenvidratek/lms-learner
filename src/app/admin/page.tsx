/** Admin DASH-01..04, HOME-01. Moodle: /my/ (Start page for users = Dashboard) */
import { DashboardView } from "@/components/admin/dashboard/dashboard-view";
import { core_calendar_get_calendar_monthly_view, mod_forum_get_forum_discussions_site_news } from "@/lib/admin-data";

export const metadata = { title: "Tổng quan" };

export default async function AdminHome() {
  const [events, announcements] = await Promise.all([core_calendar_get_calendar_monthly_view(), mod_forum_get_forum_discussions_site_news()]);
  return <DashboardView events={events} announcements={announcements} />;
}
