import type { Metadata } from "next";
import { CalendarView } from "@/components/calendar/calendar-view";
import { PageHeader } from "@/components/layout/page-header";
import { core_calendar_get_calendar_monthly_view } from "@/lib/data";

export const metadata: Metadata = { title: "Lịch" };

/** CAL: lịch đào tạo, hạn bài kiểm tra, sự kiện khóa học */
export default async function CalendarPage() {
  const events = await core_calendar_get_calendar_monthly_view();
  return (
    <>
      <PageHeader title="Lịch" description="Lịch đào tạo tập trung, hạn bài kiểm tra và sự kiện của các khóa học." />
      <CalendarView events={events} />
    </>
  );
}
