import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Tổng quan" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Tổng quan" />
      <ScreenPlaceholder screen="DASH" title="Dashboard" references={["01-my-learning"]} />
    </>
  );
}
