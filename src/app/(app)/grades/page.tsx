import type { Metadata } from "next";
import { GradesView } from "@/components/grades/grades-view";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Điểm" };

/** GRADE: điểm theo khóa */
export default function GradesPage() {
  return (
    <>
      <PageHeader title="Điểm" description="Kết quả học tập theo từng khóa và từng bài kiểm tra." />
      <GradesView />
    </>
  );
}
