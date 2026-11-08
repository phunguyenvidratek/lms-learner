"use client";

/**
 * Admin DASH-01 (4 thẻ số liệu, mỗi thẻ link báo cáo), DASH-02 (lối tắt 5 nút), DASH-03 (việc cần xử lý),
 * DASH-04 (bố cục 2 cột: việc chính trái, lịch thu nhỏ + thông báo phải), HOME-01 (trang đầu sau đăng nhập).
 * Moodle: /my/ (Default Dashboard + block custom).
 */
import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  FilePlus2,
  Megaphone,
  UserPlus,
  Users,
  UsersRound,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ADMIN_USER_ID, adminAlerts, courseSections, courseStats, myCourses, siteOverview } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { useNow } from "@/lib/use-now";
import { cn, formatDate, stripHtml } from "@/lib/utils";
import type { Announcement, CalendarEvent } from "@/types/moodle";
import type { AdminAlert } from "@/types/moodle-admin";
import { PercentBar, StatCard } from "../common/data";
import { AdminPage, AdminPageHeader } from "../layout/page-header";
import { MiniCalendar } from "./mini-calendar";

const ALERT_STYLE: Record<AdminAlert["kind"], { icon: React.ComponentType<{ className?: string }>; tone: string; label: string }> = {
  grading: { icon: Inbox, tone: "bg-brand-50 text-brand-600", label: "Chờ chấm" },
  exhausted: { icon: AlertTriangle, tone: "bg-danger-soft text-destructive", label: "Hết lượt" },
  closing: { icon: ClipboardList, tone: "bg-warning-soft text-warning", label: "Sắp đóng" },
  noQuestions: { icon: FilePlus2, tone: "bg-warning-soft text-warning", label: "Chưa có câu hỏi" },
  noStudents: { icon: UsersRound, tone: "bg-muted text-muted-foreground", label: "Chưa có học viên" },
};

function QuizPicker({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { ds } = useAdmin();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nhập câu hỏi từ Excel</DialogTitle>
          <DialogDescription>Chọn bài kiểm tra cần thêm câu hỏi.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {ds.courses.map((c) => {
            const qs = courseSections(ds, c.id).flatMap((s) => s.modules.filter((m) => m.modname === "quiz"));
            if (!qs.length) return null;
            return (
              <div key={c.id}>
                <p className="mb-1 text-xs font-semibold text-muted-foreground">{c.fullname}</p>
                <div className="divide-y rounded-lg border">
                  {qs.map((q) => (
                    <Link key={q.id} href={`/admin/quiz/${q.id}/import`} className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted">
                      {q.name}
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DashboardView({ events, announcements }: { events: CalendarEvent[]; announcements: Announcement[] }) {
  const { ds, state } = useAdmin();
  const now = useNow();
  const [picker, setPicker] = useState(false);
  const o = siteOverview(ds, now);
  const alerts = adminAlerts(ds, now);
  const mine = myCourses(ds, ADMIN_USER_ID).filter((c) => c.visible === 1);
  const news = [...(state?.announcements ?? []), ...announcements].sort((a, b) => b.created - a.created).slice(0, 3);

  const shortcuts = [
    { label: "Tạo khóa", icon: BookOpen, href: "/admin/courses/new" },
    { label: "Thêm người dùng", icon: UserPlus, href: "/admin/users/new" },
    { label: "Ghi danh phòng ban", icon: Users, href: "/admin/cohorts" },
    { label: "Nhập câu hỏi Excel", icon: FileSpreadsheet, onClick: () => setPicker(true) },
    { label: "Đăng thông báo", icon: Megaphone, href: "/admin/announcements/new" },
  ];

  return (
    <AdminPage>
      <AdminPageHeader title="Tổng quan" description="Số liệu đào tạo, việc đang chờ bạn và các khóa bạn phụ trách." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 2xl:grid-cols-4">
            <StatCard label="Khóa đang mở" value={o.openCourses} hint={`${ds.courses.length - o.openCourses} khóa đang ẩn`} icon={BookOpen} href="/admin/reports/tien-do-khoa" />
            <StatCard
              label="Học viên hoạt động 30 ngày"
              value={o.activeLearners}
              hint={`Trên ${o.totalLearners} học viên đang ghi danh`}
              icon={Users}
              href="/admin/reports/hoat-dong"
            />
            <StatCard label="Tỉ lệ hoàn thành" value={`${o.completionRate}%`} hint="Lượt ghi danh đã hoàn thành khóa" icon={CheckCircle2} tone="success" href="/admin/reports/tien-do-phong-ban" />
            <StatCard label="Bài chờ chấm" value={o.pendingGrading} hint="Chưa có bài nộp cần chấm" icon={Inbox} tone="muted" href="/admin/reports/ket-qua-kiem-tra" />
          </div>

          <section aria-labelledby="loi-tat">
            <h2 id="loi-tat" className="sr-only">
              Lối tắt
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
              {shortcuts.map((s) => {
                const inner = (
                  <>
                    <s.icon className="size-5" />
                    <span>{s.label}</span>
                  </>
                );
                const cls = "h-auto flex-col gap-1.5 py-3 text-center whitespace-normal";
                return s.href ? (
                  <Button key={s.label} variant="outline" className={cls} asChild>
                    <Link href={s.href}>{inner}</Link>
                  </Button>
                ) : (
                  <Button key={s.label} variant="outline" className={cls} onClick={s.onClick}>
                    {inner}
                  </Button>
                );
              })}
            </div>
          </section>

          <section id="viec-can-xu-ly" className="scroll-mt-24 rounded-xl border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Việc cần xử lý</h2>
              <Badge variant={alerts.length ? "warning" : "success"}>{alerts.length} việc</Badge>
            </div>
            {alerts.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="Không có việc tồn đọng" description="Mọi khóa đều có học viên, bài kiểm tra đều có câu hỏi." className="m-4 border-0" />
            ) : (
              <ul className="divide-y">
                {alerts.map((a) => {
                  const st = ALERT_STYLE[a.kind];
                  return (
                    <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3 sm:flex-nowrap">
                      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", st.tone)}>
                        <st.icon className="size-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1 basis-[calc(100%-3rem)] sm:basis-auto">
                        <p className="text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.detail}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="ml-12 sm:ml-0">
                        <Link href={a.href}>{a.action}</Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Khóa tôi phụ trách</h2>
              <Link href="/admin/my-courses" className="text-sm font-medium text-primary hover:underline">
                Xem tất cả
              </Link>
            </div>
            {mine.length === 0 ? (
              <EmptyState icon={BookOpen} title="Chưa phụ trách khóa nào" className="m-4 border-0" />
            ) : (
              <ul className="divide-y">
                {mine.map((c) => {
                  const st = courseStats(ds, c.id);
                  return (
                    <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
                      <div className="min-w-0 flex-1 basis-56">
                        <Link href={`/admin/courses/${c.id}/edit`} className="font-medium hover:text-primary">
                          {c.fullname}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {st.students} học viên · {st.inprogress} đang học · {st.completed} hoàn thành
                        </p>
                      </div>
                      <PercentBar value={st.avgProgress} />
                      <Link href={`/admin/courses/${c.id}/reports/progress`} className="text-sm font-medium text-primary hover:underline">
                        Tiến độ
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <MiniCalendar events={events} now={now} />
          <section className="rounded-xl border bg-card p-4 shadow-xs">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Thông báo chung</h2>
              <Link href="/admin/announcements/new" className="text-sm font-medium text-primary hover:underline">
                Đăng mới
              </Link>
            </div>
            {news.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có thông báo.</p>
            ) : (
              <ul className="space-y-3">
                {news.map((a) => (
                  <li key={a.id}>
                    <Link href={`/admin/announcements#tb-${a.id}`} className="group block rounded-lg border p-3 hover:bg-muted/40">
                      <p className="line-clamp-2 text-sm font-medium group-hover:text-primary">{a.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(a.created)}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{stripHtml(a.message)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
      <QuizPicker open={picker} onOpenChange={setPicker} />
    </AdminPage>
  );
}
