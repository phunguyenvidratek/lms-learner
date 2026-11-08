/** Admin USER-01. Moodle: /user/editadvanced.php?id={userId} */
import { UserForm } from "@/components/admin/users/user-form";

export const metadata = { title: "Sửa người dùng" };

export default async function EditUserPage({ params }: { params: Promise<{ userId: string }> }) {
  return <UserForm userId={Number((await params).userId)} />;
}
