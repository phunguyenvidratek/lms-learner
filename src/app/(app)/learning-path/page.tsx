import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Lộ trình học" };

export default function LearningPathPage() {
  return (
    <>
      <PageHeader title="Lộ trình học" />
      <ScreenPlaceholder screen="LP" title="Learning Path" references={[]} />
    </>
  );
}
