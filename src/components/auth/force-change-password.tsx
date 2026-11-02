"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useLearning } from "@/lib/store/learning-store";
import { ChangePasswordForm } from "./change-password-form";

/** AUTH-05: tài khoản tạo với "Force password change" phải đổi mật khẩu trước khi học */
export function ForceChangePassword() {
  const { ready, state, actions } = useLearning();
  const router = useRouter();

  useEffect(() => {
    if (ready && !state?.session) router.replace("/login");
  }, [ready, state?.session, router]);

  if (!ready || !state?.session) return null;

  return (
    <div className="space-y-6">
      <div className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <ShieldCheck className="size-6" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Đổi mật khẩu lần đầu</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chào <span className="font-medium text-foreground">{state.session.username}</span>, vì lý do bảo mật bạn cần đặt mật khẩu mới trước khi bắt đầu học.
        </p>
      </div>
      <ChangePasswordForm submitLabel="Lưu mật khẩu và tiếp tục" onDone={() => router.replace("/dashboard")} />
      <button
        type="button"
        onClick={() => {
          actions.logout();
          router.replace("/login");
        }}
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Đăng xuất
      </button>
    </div>
  );
}
