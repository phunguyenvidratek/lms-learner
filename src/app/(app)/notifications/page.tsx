import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { NotificationsView } from "@/components/notifications/notifications-view";

export const metadata: Metadata = { title: "Thông báo" };

/** NOTI: thông báo */
export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Thông báo" />
      <NotificationsView />
    </>
  );
}
