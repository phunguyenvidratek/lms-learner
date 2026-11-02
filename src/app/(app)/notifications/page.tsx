import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Thông báo" };

export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Thông báo" />
      <ScreenPlaceholder screen="NOTI" title="Notifications" references={[]} />
    </>
  );
}
