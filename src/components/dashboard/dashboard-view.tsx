"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarClock, ChevronLeft, ChevronRight, ClipboardCheck, Lock, Map as MapIcon, Megaphone, PlayCircle } from "lucide-react";
import { CourseImage } from "@/components/common/course-image";
import { EmptyState } from "@/components/common/empty-state";
import { ModuleIcon } from "@/components/common/module-icon";
import { MoodleHtml } from "@/components/common/moodle-html";
import { courseCta } from "@/components/course/course-cta";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { learningPaths } from "@/lib/mock/data";
import { useLearning } from "@/lib/store/learning-store";
import { useNow } from "@/lib/use-now";
import { cn, firstName, formatDate, formatDay, formatLongDate, formatTime, stripHtml } from "@/lib/utils";
import type { Announcement, SiteInfo } from "@/types/moodle";

const DAY = 86400;

/** DASH-04: banner thông báo chung, bấm xem chi tiết */
function Announcements({ items, initialOpen }: { items: Announcement[]; initialOpen?: number }) {
  const [index, setIndex] = useState(0);
  const [openId, setOpenId] = useState<number | null>(initialOpen ?? null);
  const now = useNow();
  const a = items[index];
  const opened = items.find((x) => x.id === openId);
  if (!a) return <EmptyState icon={Megaphone} title="Chưa có thông báo" description="Thông báo chung của Phòng Đào tạo sẽ hiển thị ở đây." />;
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Thông báo chung</h2>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Thông báo trước" onClick={() => setIndex((index - 1 + items.length) % items.length)} className="rounded-md p-1.5 hover:bg-muted">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Thông báo sau" onClick={() => setIndex((index + 1) % items.length)} className="rounded-md p-1.5 hover:bg-muted">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <button type="button" onClick={() => setOpenId(a.id)} className="mt-3 block w-full rounded-lg bg-brand-50 p-4 text-left transition-colors hover:bg-brand-100">
        <div className="flex items-center gap-2 text-xs text-brand-700">
          {now - a.created < 3 * DAY && <span className="rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">MỚI</span>}
          <span>{formatDate(a.created)}</span>
          <span>•</span>
          <span>{a.userfullname}</span>
        </div>
        <p className="mt-2 line-clamp-2 font-semibold text-brand-950">{a.name}</p>
        <p className="mt-1 line-clamp-2 text-sm text-brand-900/80">{stripHtml(a.message)}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Xem chi tiết <ArrowRight className="size-3.5" />
        </span>
      </button>
      <div className="mt-3 flex justify-center gap-1.5">
        {items.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-label={`Thông báo ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-primary" : "w-1.5 bg-brand-200")}
          />
        ))}
      </div>
      <Dialog open={!!opened} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
          {opened && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6 leading-snug">{opened.name}</DialogTitle>
                <DialogDescription>
                  {opened.userfullname} • {formatDate(opened.created)}
                </DialogDescription>
              </DialogHeader>
              <MoodleHtml html={opened.message} className="text-sm leading-6" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** DASH-01..05 */
export function DashboardView({ user, announcements, initialAnnouncement }: { user: SiteInfo; announcements: Announcement[]; initialAnnouncement?: number }) {
  const { courses, quizzes } = useLearning();
  const counts = {
    inprogress: courses.filter((c) => c.status === "inprogress").length,
    completed: courses.filter((c) => c.status === "completed").length,
    notstarted: courses.filter((c) => c.status === "notstarted").length,
  };
  const total = courses.length;

  // DASH-02: khóa truy cập gần nhất còn đang học, nếu không có thì khóa đầu tiên đã mở chưa hoàn thành
  const current = useMemo(() => {
    const open = courses.filter((c) => !c.locked && c.status !== "completed");
    return [...open].sort((a, b) => (b.lastaccess ?? 0) - (a.lastaccess ?? 0))[0];
  }, [courses]);

  const now = useNow();
  const upcoming = quizzes
    .filter((q) => q.summary.quiz.timeclose > now && !q.summary.passed && q.course.status !== "completed")
    .sort((a, b) => a.summary.quiz.timeclose - b.summary.quiz.timeclose)
    .slice(0, 5);

  const path = learningPaths[0];
  const pathCourses = path.steps.map((s) => courses.find((c) => c.info.id === s.courseid)!);
  const pathDone = pathCourses.filter((c) => c.status === "completed").length;
  const pathPercent = Math.round(pathCourses.reduce((s, c) => s + c.progress, 0) / pathCourses.length);

  const stats = [
    { key: "inprogress", label: "Đang học", value: counts.inprogress, bar: "bg-primary", text: "text-primary" },
    { key: "completed", label: "Hoàn thành", value: counts.completed, bar: "bg-success", text: "text-success" },
    { key: "notstarted", label: "Chưa bắt đầu", value: counts.notstarted, bar: "bg-muted-foreground/40", text: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-brand-950 px-5 py-7 text-white sm:px-8">
        <div className="absolute -top-24 right-10 size-64 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-brand-200">{formatLongDate(now)}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Chào {firstName(user.fullname)},</h1>
            <p className="mt-2 text-white/80">
              {counts.inprogress > 0 ? (
                <>
                  Bạn có <span className="font-semibold text-white">{counts.inprogress} khóa đang học</span>. Tiếp tục để hoàn thành lộ trình đúng hạn.
                </>
              ) : (
                "Bạn không có khóa nào đang học. Chọn một khóa để bắt đầu."
              )}
            </p>
          </div>
          <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/courses">
              Xem khóa học <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-bold">Học tiếp</h2>
            {current ? (
              <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs sm:flex-row">
                <Link href={`/courses/${current.info.id}`} className="relative block sm:w-72 sm:shrink-0">
                  <CourseImage src={current.info.courseimage} alt={current.info.fullname} className="aspect-video w-full sm:absolute sm:inset-0 sm:aspect-auto" sizes="(min-width: 640px) 288px, 100vw" preload />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                    <PlayCircle className="size-12 text-white" />
                  </span>
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{current.info.coursecategory}</p>
                    <Link href={`/courses/${current.info.id}`} className="mt-0.5 block text-lg font-bold hover:text-primary">
                      {current.info.fullname}
                    </Link>
                  </div>
                  {current.next && (
                    <p className="flex min-w-0 items-center gap-2 text-sm">
                      <ModuleIcon modname={current.next.modname} className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        <span className="text-muted-foreground">Bài tiếp theo: </span>
                        <span className="font-medium">{current.next.name}</span>
                      </span>
                    </p>
                  )}
                  <div className="space-y-1.5">
                    <Progress value={current.progress} />
                    <p className="text-xs text-muted-foreground">
                      {current.progress}% hoàn thành • {current.done}/{current.total} hoạt động
                    </p>
                  </div>
                  <Button asChild className="mt-auto w-full sm:w-fit">
                    <Link href={courseCta(current).href!}>
                      <PlayCircle /> {courseCta(current).label}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState icon={PlayCircle} title="Bạn đã hoàn thành tất cả khóa đang mở" description="Khóa tiếp theo sẽ mở theo lộ trình học." action={<Button asChild variant="outline"><Link href="/learning-path">Xem lộ trình</Link></Button>} />
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Bài kiểm tra sắp đến hạn</h2>
              <Link href="/tests" className="text-sm font-semibold text-primary hover:underline">
                Xem tất cả
              </Link>
            </div>
            {upcoming.length ? (
              <ul className="divide-y rounded-xl border bg-card">
                {upcoming.map(({ summary, course, module, section }) => {
                  const d = new Date(summary.quiz.timeclose * 1000);
                  const soon = summary.quiz.timeclose - now < 2 * DAY;
                  return (
                    <li key={module.id} className="flex items-center gap-4 p-4">
                      <div className={cn("flex w-12 shrink-0 flex-col items-center rounded-lg py-1.5", soon ? "bg-danger-soft text-destructive" : "bg-brand-50 text-brand-700")}>
                        <span className="text-[10px] font-semibold uppercase">Th {d.getMonth() + 1}</span>
                        <span className="text-lg leading-none font-bold">{d.getDate()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {summary.quiz.name} <span className="font-normal text-muted-foreground">• {section.name.split(":")[1]?.trim()}</span>
                        </p>
                        <p className="truncate text-sm text-muted-foreground">{course.info.fullname}</p>
                        <p className={cn("mt-0.5 flex items-center gap-1 text-xs", soon ? "font-semibold text-destructive" : "text-muted-foreground")}>
                          <CalendarClock className="size-3.5" /> Hạn {formatTime(summary.quiz.timeclose)}, {formatDay(summary.quiz.timeclose).toLowerCase()}
                          {summary.attempts.length > 0 && ` • Đã làm ${summary.attempts.length}/${summary.quiz.attempts} lần`}
                        </p>
                      </div>
                      {summary.state === "locked" ? (
                        <Button variant="outline" size="sm" disabled>
                          <Lock /> Chưa mở
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant={summary.state === "notstarted" ? "default" : "outline-primary"}>
                          <Link href={`/quiz/${module.id}`}>{summary.state === "inprogress" ? "Làm tiếp" : summary.attempts.length ? "Làm lại" : "Làm bài"}</Link>
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState icon={ClipboardCheck} title="Không có bài kiểm tra sắp đến hạn" description="Bài kiểm tra có hạn nộp sẽ hiển thị ở đây." />
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-5">
            <h2 className="font-bold">Tiến độ khóa học</h2>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-muted">
              {stats.map((s) => (
                <div key={s.key} className={cn("h-full transition-all", s.bar)} style={{ width: `${total ? (s.value / total) * 100 : 0}%` }} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <Link key={s.key} href={`/courses?tab=${s.key}`} className="rounded-lg border p-3 hover:border-brand-200 hover:bg-brand-50/50">
                  <p className={cn("text-2xl font-bold", s.text)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-[11px] text-muted-foreground">/{total} khóa</p>
                </Link>
              ))}
            </div>
          </section>

          <Announcements items={announcements} initialOpen={initialAnnouncement} />

          <Link href="/learning-path" className="block rounded-xl border bg-card p-5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <MapIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Lộ trình học</p>
                <p className="truncate font-semibold">{path.name}</p>
              </div>
            </div>
            <Progress value={pathPercent} className="mt-4" />
            <p className="mt-2 text-xs text-muted-foreground">
              {pathPercent}% lộ trình • {pathDone}/{pathCourses.length} khóa hoàn thành
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
