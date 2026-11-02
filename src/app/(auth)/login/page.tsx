import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckSquare, TrendingUp } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Đăng nhập" };

/** AUTH-01, AUTH-02, AUTH-03. Mockup: bấm Đăng nhập chỉ chuyển sang Dashboard. */
export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden flex-col justify-center gap-8 overflow-hidden bg-brand-700 px-16 text-white lg:flex">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-brand-500/40" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-brand-900/50" />
        <div className="relative space-y-6">
          <Logo inverted />
          <p className="text-xs font-semibold tracking-[0.3em] text-white/70">HỆ THỐNG ĐÀO TẠO NỘI BỘ</p>
          <h1 className="max-w-md text-4xl leading-tight font-bold">Học đúng, học đủ, áp dụng ngay vào công việc.</h1>
          <ul className="space-y-3 text-white/85">
            <li className="flex items-center gap-3"><BookOpen className="size-5" /> Thư viện khóa học về hoạt chất, sản phẩm, kỹ thuật</li>
            <li className="flex items-center gap-3"><TrendingUp className="size-5" /> Theo dõi tiến độ từng khóa</li>
            <li className="flex items-center gap-3"><CheckSquare className="size-5" /> Kiểm tra sau mỗi phần, có kết quả ngay</li>
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Chào mừng trở lại</h2>
            <p className="mt-1 text-sm text-muted-foreground">Đăng nhập để tiếp tục học</p>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard">Đăng nhập bằng Google</Link>
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            HOẶC
            <span className="h-px flex-1 bg-border" />
          </div>

          <form action="/dashboard" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" name="username" autoComplete="username" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Input id="password" name="password" type="password" autoComplete="current-password" />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Đăng nhập
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
