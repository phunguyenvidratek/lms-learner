import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Bài kiểm tra" };

export default function TestsPage() {
  return (
    <>
      <PageHeader title="Bài kiểm tra" />
      <ScreenPlaceholder screen="TEST" title="Tests" references={["07-quiz-intro"]} />
    </>
  );
}
