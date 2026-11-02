import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { core_webservice_get_site_info, mod_forum_get_forum_discussions_site_news } from "@/lib/data";

export const metadata: Metadata = { title: "Tổng quan" };

type Props = { searchParams: Promise<{ announcement?: string }> };

/** DASH: tổng quan */
export default async function DashboardPage({ searchParams }: Props) {
  const { announcement } = await searchParams;
  const [user, announcements] = await Promise.all([core_webservice_get_site_info(), mod_forum_get_forum_discussions_site_news()]);
  return (
    <DashboardView
      key={announcement ?? "home"}
      user={user}
      announcements={announcements}
      initialAnnouncement={announcement ? Number(announcement) : undefined}
    />
  );
}
