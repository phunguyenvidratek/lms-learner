import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Điểm" };

export default function GradesPage() {
  return (
    <>
      <PageHeader title="Điểm" />
      <ScreenPlaceholder screen="GRADE" title="Grades" references={[]} />
    </>
  );
}
