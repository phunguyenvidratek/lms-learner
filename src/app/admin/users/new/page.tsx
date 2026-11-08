/** Admin USER-01. Moodle: /user/editadvanced.php?id=-1 */
import { UserForm } from "@/components/admin/users/user-form";

export const metadata = { title: "Thêm người dùng" };

export default function NewUserPage() {
  return <UserForm />;
}
