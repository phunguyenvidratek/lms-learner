/** Admin USER-02. Moodle: /admin/user.php */
import { UsersView } from "@/components/admin/users/users-view";

export const metadata = { title: "Người dùng" };

export default function UsersPage() {
  return <UsersView />;
}
