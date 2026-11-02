import Image from "next/image";
import { BookOpen, CheckSquare, TrendingUp } from "lucide-react";
import { Logo } from "@/components/layout/logo";

/** Khung chung các màn đăng nhập, quên mật khẩu, đổi mật khẩu lần đầu */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-brand-900 text-white lg:block">
        <Image src="/images/courses/rejuran-internal.jpg" alt="" fill sizes="50vw" className="object-cover opacity-30" preload />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-800/70 to-brand-950/95" />
        <div className="relative flex h-full flex-col justify-between p-14">
          <Logo inverted />
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.3em] text-white/70">HỆ THỐNG ĐÀO TẠO NỘI BỘ</p>
            <h1 className="max-w-md text-4xl leading-tight font-bold">Học đúng, học đủ, áp dụng ngay vào công việc.</h1>
            <ul className="space-y-3 text-white/85">
              <li className="flex items-center gap-3">
                <BookOpen className="size-5" /> Khóa học về sản phẩm, kỹ thuật và an toàn
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp className="size-5" /> Theo dõi tiến độ và lộ trình của bạn
              </li>
              <li className="flex items-center gap-3">
                <CheckSquare className="size-5" /> Kiểm tra sau mỗi phần, có kết quả ngay
              </li>
            </ul>
          </div>
          <p className="text-sm text-white/60">© {new Date().getFullYear()} VIGO. Hỗ trợ: daotao@vigo.vn</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
