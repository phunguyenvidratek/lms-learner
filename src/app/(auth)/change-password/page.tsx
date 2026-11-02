import type { Metadata } from "next";
import { ForceChangePassword } from "@/components/auth/force-change-password";

export const metadata: Metadata = { title: "Đổi mật khẩu" };

/** AUTH-05 */
export default function ChangePasswordPage() {
  return <ForceChangePassword />;
}
