import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Hồ sơ" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Hồ sơ" />
      <ScreenPlaceholder screen="PROF" title="Profile" references={[]} />
    </>
  );
}
