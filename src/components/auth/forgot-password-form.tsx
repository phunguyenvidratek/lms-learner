"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function maskEmail(value: string) {
  if (!value.includes("@")) return null;
  const [name, domain] = value.split("@");
  return `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

/** AUTH-03: nhập tên đăng nhập hoặc email, Moodle gửi mail đặt lại mật khẩu (core_auth_request_password_reset) */
export function ForgotPasswordForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("account") ?? "").trim();
    if (!value) return setError("Nhập tên đăng nhập hoặc email.");
    if (value.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setError("Email không đúng định dạng.");
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(value);
    }, 800);
  };

  if (sent !== null) {
    const masked = maskEmail(sent);
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <MailCheck className="size-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Kiểm tra email của bạn</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi tới {masked ? <span className="font-medium text-foreground">{masked}</span> : "email đăng ký của tài khoản"}. Liên kết có hiệu lực trong 30 phút.
          </p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link href="/login">Quay lại đăng nhập</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Không nhận được email?{" "}
          <button type="button" onClick={() => setSent(null)} className="font-medium text-primary hover:underline">
            Gửi lại
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/login" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Đăng nhập
      </Link>
      <div>
        <h2 className="text-2xl font-bold">Quên mật khẩu</h2>
        <p className="mt-1 text-sm text-muted-foreground">Nhập tên đăng nhập hoặc email công ty. Hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-destructive" role="alert">
            <AlertCircle className="size-4 shrink-0" /> {error}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="account">Tên đăng nhập hoặc email</Label>
          <Input id="account" name="account" autoComplete="username" autoCapitalize="none" placeholder="vd: minhanh.tran@vigo.vn" />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
        </Button>
      </form>
    </div>
  );
}
