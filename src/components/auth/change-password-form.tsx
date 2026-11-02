"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLearning } from "@/lib/store/learning-store";
import { PasswordInput } from "./password-input";

type Errors = Partial<Record<"current" | "next" | "confirm", string>>;

/** Kiểm tra theo chính sách mật khẩu Moodle mặc định (rút gọn): tối thiểu 8 ký tự, có chữ và số */
function validate(current: string, next: string, confirm: string): Errors {
  const e: Errors = {};
  if (!current) e.current = "Nhập mật khẩu hiện tại.";
  if (next.length < 8) e.next = "Mật khẩu mới cần ít nhất 8 ký tự.";
  else if (!/[a-zA-Z]/.test(next) || !/\d/.test(next)) e.next = "Mật khẩu mới cần có cả chữ và số.";
  else if (next === current) e.next = "Mật khẩu mới phải khác mật khẩu hiện tại.";
  if (confirm !== next) e.confirm = "Mật khẩu nhập lại không khớp.";
  return e;
}

/** PROF-03, AUTH-05: đổi mật khẩu. Bản thật chuyển sang trang đổi mật khẩu của Moodle (chưa có WS core). */
export function ChangePasswordForm({ onDone, submitLabel = "Đổi mật khẩu" }: { onDone?: () => void; submitLabel?: string }) {
  const { actions } = useLearning();
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const e = validate(String(data.get("current") ?? ""), String(data.get("next") ?? ""), String(data.get("confirm") ?? ""));
    setErrors(e);
    setDone(false);
    if (Object.keys(e).length) return;
    setSaving(true);
    window.setTimeout(() => {
      actions.changePassword();
      setSaving(false);
      setDone(true);
      form.reset();
      onDone?.();
    }, 700);
  };

  const field = (name: keyof Errors, label: string, autoComplete: string) => (
    <div className="space-y-2">
      <Label htmlFor={`pw-${name}`}>{label}</Label>
      <PasswordInput id={`pw-${name}`} name={name} autoComplete={autoComplete} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `pw-${name}-err` : undefined} />
      {errors[name] && (
        <p id={`pw-${name}-err`} className="text-sm text-destructive">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {field("current", "Mật khẩu hiện tại", "current-password")}
      {field("next", "Mật khẩu mới", "new-password")}
      {field("confirm", "Nhập lại mật khẩu mới", "new-password")}
      <p className="text-xs text-muted-foreground">Tối thiểu 8 ký tự, gồm cả chữ và số.</p>
      {done && !onDone && (
        <p className="flex items-center gap-2 rounded-md bg-success-soft px-3 py-2 text-sm text-success" role="status">
          <CheckCircle2 className="size-4" /> Đã đổi mật khẩu. Lần đăng nhập sau dùng mật khẩu mới.
        </p>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? "Đang lưu..." : submitLabel}
      </Button>
    </form>
  );
}
