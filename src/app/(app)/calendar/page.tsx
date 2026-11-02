import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Lịch" };

export default function CalendarPage() {
  return (
    <>
      <PageHeader title="Lịch" />
      <ScreenPlaceholder screen="CAL" title="Calendar" references={[]} />
    </>
  );
}
