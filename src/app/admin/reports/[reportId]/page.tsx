/** Admin RPT-01. Moodle: /reportbuilder/view.php?id={reportid} */
import { ReportView } from "@/components/admin/reports/reports-views";

export const metadata = { title: "Báo cáo" };

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  return <ReportView id={(await params).reportId} />;
}
