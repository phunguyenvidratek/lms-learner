import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Quên mật khẩu" };

/** AUTH-03 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
