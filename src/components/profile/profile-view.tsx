"use client";

import Link from "next/link";
import { Award, BookOpen, Building2, CalendarDays, ClipboardCheck, IdCard, Mail, UsersRound } from "lucide-react";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { initials } from "@/components/layout/app-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLearning } from "@/lib/store/learning-store";
import { formatDate } from "@/lib/utils";
import type { SiteInfo } from "@/types/moodle";

/** PROF-01 (thông tin cá nhân), PROF-03 (đổi mật khẩu) */
export function ProfileView({ user }: { user: SiteInfo }) {
  const { courses, quizzes, state } = useLearning();
  const completed = courses.filter((c) => c.status === "completed").length;
  const passed = quizzes.filter((q) => q.summary.passed).length;
  const viaGoogle = state?.session?.via === "google";

  const info = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: UsersRound, label: "Phòng ban", value: user.department },
    { icon: Building2, label: "Đơn vị", value: user.institution },
    { icon: IdCard, label: "Mã nhân viên", value: user.idnumber },
    { icon: CalendarDays, label: "Tham gia từ", value: formatDate(user.firstaccess) },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="h-24 bg-brand-950" />
          <div className="px-6 pb-6">
            <Avatar className="-mt-10 size-20 border-4 border-card text-2xl">
              <AvatarFallback className="bg-primary text-primary-foreground">{initials(user.fullname)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-3 text-xl font-bold">{user.fullname}</h2>
            <p className="text-sm text-muted-foreground">
              {user.department} • @{user.username}
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {info.map((i) => (
                <div key={i.label} className="flex items-start gap-3">
                  <i.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{i.label}</dt>
                    <dd className="truncate text-sm font-medium">{i.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-muted-foreground">Thông tin cá nhân do Phòng Nhân sự quản lý. Cần cập nhật, vui lòng liên hệ hr@vigo.vn.</p>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {[
            { icon: BookOpen, label: "Khóa đang học", value: courses.filter((c) => c.status === "inprogress").length, href: "/courses?tab=inprogress" },
            { icon: Award, label: "Chứng nhận", value: completed, href: "/certificates" },
            { icon: ClipboardCheck, label: "Bài kiểm tra đạt", value: passed, href: "/tests" },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="rounded-xl border bg-card p-4 hover:shadow-md">
              <s.icon className="size-5 text-primary" />
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Link>
          ))}
        </section>
      </div>

      <section id="doi-mat-khau" className="h-fit scroll-mt-24 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-bold">Đổi mật khẩu</h2>
        {viaGoogle ? (
          <p className="mt-2 text-sm text-muted-foreground">Bạn đang đăng nhập bằng tài khoản Google. Mật khẩu được quản lý trong tài khoản Google của bạn.</p>
        ) : (
          <>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">Áp dụng cho tài khoản đăng nhập bằng tên đăng nhập và mật khẩu.</p>
            <ChangePasswordForm />
          </>
        )}
      </section>
    </div>
  );
}
