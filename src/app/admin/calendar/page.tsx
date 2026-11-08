/** Admin NOTI-01. Moodle: /calendar/view.php?view=month */
import { CalendarView } from "@/components/admin/calendar/calendar-views";
import { core_calendar_get_calendar_monthly_view } from "@/lib/admin-data";

export const metadata = { title: "Lịch" };

export default async function CalendarPage() {
  return <CalendarView events={await core_calendar_get_calendar_monthly_view()} />;
}
