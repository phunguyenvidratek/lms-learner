/** Admin RPT-01, RPT-02. Moodle: /reportbuilder/index.php */
import { ReportsIndexView } from "@/components/admin/reports/reports-views";

export const metadata = { title: "Báo cáo" };

export default function ReportsPage() {
  return <ReportsIndexView />;
}
