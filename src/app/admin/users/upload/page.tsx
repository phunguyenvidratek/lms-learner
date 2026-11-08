/** Admin USER-03. Moodle: /admin/tool/uploaduser/index.php */
import { UploadUsersView } from "@/components/admin/users/upload-users-view";

export const metadata = { title: "Nhập người dùng" };

export default function UploadUsersPage() {
  return <UploadUsersView />;
}
