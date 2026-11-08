/** Admin DASH. Moodle: /my/ */
import { AdminPage, AdminPageHeader } from "@/components/admin/layout/page-header";

export const metadata = { title: "Tổng quan" };

export default function AdminHome() {
  return (
    <AdminPage>
      <AdminPageHeader title="Tổng quan" description="Số liệu đào tạo, việc cần xử lý và lối tắt." />
    </AdminPage>
  );
}
