import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TestsView } from "@/components/tests/tests-view";

export const metadata: Metadata = { title: "Bài kiểm tra" };

/** TEST: tổng hợp bài kiểm tra */
export default function TestsPage() {
  return (
    <>
      <PageHeader title="Bài kiểm tra" description="Bài kiểm tra cuối phần của các khóa bạn được giao. Cần đạt từ 8/10, tối đa 3 lần làm, tính lần cao nhất." />
      <TestsView />
    </>
  );
}
