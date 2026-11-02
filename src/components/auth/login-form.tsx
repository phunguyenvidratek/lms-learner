"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLearning } from "@/lib/store/learning-store";
import { PasswordInput } from "./password-input";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

/** AUTH-01 (tên đăng nhập, mật khẩu, ẩn/hiện, báo lỗi, quay về trang trước), AUTH-02 (Google), AUTH-05 */
export function LoginForm({ from }: { from?: string }) {
  const { ready, state, actions } = useLearning();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"password" | "google" | null>(null);
  const target = from && from.startsWith("/") && !from.startsWith("//") ? from : "/dashboard";

  // Đã đăng nhập thì vào thẳng ứng dụng
  useEffect(() => {
    if (ready && state?.session && !loading) router.replace(target);
  }, [ready, state?.session, loading, router, target]);

  const finish = (username: string, via: "password" | "google") => {
    const { mustChangePassword } = actions.login(username, via);
    router.replace(mustChangePassword ? "/change-password" : target);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!username || !password) {
      setError(!username && !password ? "Nhập tên đăng nhập và mật khẩu." : !username ? "Nhập tên đăng nhập." : "Nhập mật khẩu.");
      return;
    }
    setError(null);
    setLoading("password");
    window.setTimeout(() => finish(username, "password"), 600);
  };

  const onGoogle = () => {
    setError(null);
    setLoading("google");
    window.setTimeout(() => finish("minhanh.tran", "google"), 900);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Chào mừng trở lại</h2>
        <p className="mt-1 text-sm text-muted-foreground">Đăng nhập bằng tài khoản được Phòng Đào tạo cấp.</p>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={onGoogle} disabled={!!loading}>
        {loading === "google" ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
        {loading === "google" ? "Đang kết nối Google..." : "Đăng nhập bằng Google"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        HOẶC
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-destructive" role="alert">
            <AlertCircle className="size-4 shrink-0" /> {error}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input id="username" name="username" autoComplete="username" autoCapitalize="none" placeholder="vd: minhanh.tran" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <PasswordInput id="password" name="password" autoComplete="current-password" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="remember" defaultChecked /> Ghi nhớ đăng nhập
        </label>
        <Button type="submit" size="lg" className="w-full" disabled={!!loading}>
          {loading === "password" && <Loader2 className="animate-spin" />}
          {loading === "password" ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </div>
  );
}
