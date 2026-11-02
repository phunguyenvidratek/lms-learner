"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Award,
  CalendarClock,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Heart,
  Languages,
  Lock,
  MonitorPlay,
  Paperclip,
  Smartphone,
  UsersRound,
} from "lucide-react";
import { CourseImage } from "@/components/common/course-image";
import { MoodleHtml } from "@/components/common/moodle-html";
import { CourseStatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsLineList, TabsLineTrigger } from "@/components/ui/tabs";
import { useLearning } from "@/lib/store/learning-store";
import { cn, formatDate, formatDuration, stripHtml } from "@/lib/utils";
import type { ForumDiscussion } from "@/types/moodle";
import { CompletionCriteria } from "./completion-criteria";
import { courseCta } from "./course-cta";
import { CourseCurriculum } from "./course-curriculum";
import { CourseForum } from "./course-forum";

export type CourseTab = "noi-dung" | "thong-bao" | "hoi-dap";

/** CDET-01, CDET-02, CDET-03, CDET-04, CDET-06, CDET-08. Bố cục tham chiếu trang khóa học Udemy (ảnh 11-13). */
export function CourseDetailView({
  courseId,
  discussions,
  initialTab = "noi-dung",
}: {
  courseId: number;
  discussions: ForumDiscussion[];
  initialTab?: CourseTab;
}) {
  const { course, actions } = useLearning();
  const view = course(courseId)!;
  const [tab, setTab] = useState<CourseTab>(initialTab);
  const { info, counts } = view;
  const cta = courseCta(view);
  const news = discussions.filter((d) => d.forumtype === "news").length;
  const qanda = discussions.filter((d) => d.forumtype === "qanda").length;

  const includes = [
    { icon: MonitorPlay, text: `${counts.videos} video bài giảng (${formatDuration(view.sections.flatMap((s) => s.modules).filter((m) => m.modname === "drivevideo").reduce((s, m) => s + (m.customdata_duration ?? 0), 0))})` },
    { icon: FileText, text: `${counts.pages} bài đọc` },
    { icon: Paperclip, text: `${counts.files} tài liệu PDF tải về` },
    { icon: ClipboardCheck, text: `${counts.quizzes} bài kiểm tra cuối phần` },
    { icon: Smartphone, text: "Học trên máy tính và điện thoại" },
    { icon: Award, text: "Chứng nhận hoàn thành" },
  ];

  const sideCard = (
    <div className="overflow-hidden rounded-xl border bg-card shadow-md">
      <CourseImage src={info.courseimage} alt={info.fullname} className="aspect-video" sizes="360px" preload />
      <div className="space-y-4 p-5">
        {!view.locked && view.status !== "notstarted" && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{view.progress}% hoàn thành</span>
              <span className="text-muted-foreground">
                {view.done}/{view.total} hoạt động
              </span>
            </div>
            <Progress value={view.progress} indicatorClassName={view.status === "completed" ? "bg-success" : undefined} />
          </div>
        )}
        {view.locked ? (
          <div className="space-y-3">
            <Button size="lg" className="w-full" disabled>
              <Lock /> Chưa mở
            </Button>
            <p className="text-sm text-muted-foreground">
              <MoodleHtml inline html={view.lockReason ?? ""} />.
            </p>
            {view.prerequisite && (
              <Button asChild variant="outline-primary" className="w-full">
                <Link href={`/courses/${view.prerequisite.id}`}>Đến khóa {view.prerequisite.fullname}</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Button asChild size="lg" className="w-full">
              <Link href={cta.href!}>{cta.label}</Link>
            </Button>
            {view.status === "completed" ? (
              <Button asChild variant="outline-primary" className="w-full">
                <Link href={`/certificates/${info.id}`}>
                  <Award /> Xem chứng nhận
                </Link>
              </Button>
            ) : (
              view.next && (
                <p className="text-center text-xs text-muted-foreground">
                  Bài tiếp theo: <span className="font-medium text-foreground">{view.next.name}</span>
                </p>
              )
            )}
          </div>
        )}
        <div className="grid grid-cols-3 divide-x rounded-lg bg-muted/60 py-3 text-center">
          <div>
            <p className="text-lg font-bold">{view.total}</p>
            <p className="text-[11px] text-muted-foreground">Hoạt động</p>
          </div>
          <div>
            <p className="text-lg font-bold text-success">{view.done}</p>
            <p className="text-[11px] text-muted-foreground">Đã hoàn thành</p>
          </div>
          <div>
            <p className="text-lg font-bold">{counts.quizzes}</p>
            <p className="text-[11px] text-muted-foreground">Bài kiểm tra</p>
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">Khóa học này bao gồm:</p>
          <ul className="space-y-2 text-sm">
            {includes.map((i) => (
              <li key={i.text} className="flex items-center gap-3">
                <i.icon className="size-4 shrink-0 text-muted-foreground" />
                {i.text}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={() => actions.toggleFavourite(info.id)}
          aria-pressed={view.isfavourite}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <Heart className={cn("size-4", view.isfavourite && "fill-destructive text-destructive")} />
          {view.isfavourite ? "Đã yêu thích" : "Thêm vào yêu thích"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      <div className="min-w-0 space-y-8">
        <section className="relative overflow-hidden rounded-2xl bg-brand-950 px-5 py-7 text-white sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-brand-700/30 blur-2xl" />
          <nav className="relative flex flex-wrap items-center gap-1 text-sm text-brand-200" aria-label="Breadcrumb">
            <Link href="/courses" className="hover:text-white hover:underline">
              Khóa học của tôi
            </Link>
            <ChevronRight className="size-3.5" />
            <span>{info.coursecategory}</span>
          </nav>
          <h1 className="relative mt-3 text-2xl leading-tight font-bold sm:text-3xl">{info.fullname}</h1>
          <p className="relative mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{stripHtml(info.summary)}</p>
          <div className="relative mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
            <CourseStatusBadge status={view.status} locked={view.locked} />
            <span className="flex items-center gap-1.5">
              <UsersRound className="size-4" /> {info.teacher}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-4" /> Cập nhật {formatDate(info.timemodified)}
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="size-4" /> Tiếng Việt
            </span>
          </div>
          {info.enddate > 0 && !view.locked && view.status !== "completed" && (
            <p className="relative mt-3 text-sm text-warning-soft">Hạn hoàn thành: {formatDate(info.enddate)}</p>
          )}
        </section>

        <div className="lg:hidden">{sideCard}</div>

        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="text-xl font-bold">Bạn sẽ học được</h2>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {info.objectives.map((o) => (
              <li key={o} className="flex gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {o}
              </li>
            ))}
          </ul>
        </section>

        <Tabs value={tab} onValueChange={(v) => setTab(v as CourseTab)}>
          <TabsLineList>
            <TabsLineTrigger value="noi-dung">Nội dung khóa học</TabsLineTrigger>
            <TabsLineTrigger value="thong-bao">Thông báo {news > 0 && <span className="text-muted-foreground">({news})</span>}</TabsLineTrigger>
            <TabsLineTrigger value="hoi-dap">Hỏi đáp {qanda > 0 && <span className="text-muted-foreground">({qanda})</span>}</TabsLineTrigger>
          </TabsLineList>
          <TabsContent value="noi-dung" className="space-y-8 pt-2">
            <CourseCurriculum view={view} />
            <CompletionCriteria view={view} />
            <section>
              <h2 className="text-xl font-bold">Yêu cầu</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {info.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold">Mô tả</h2>
              <MoodleHtml html={info.description} className="mt-2" />
            </section>
          </TabsContent>
          <TabsContent value="thong-bao" className="pt-2">
            <CourseForum discussions={discussions} type="news" />
          </TabsContent>
          <TabsContent value="hoi-dap" className="pt-2">
            <CourseForum discussions={discussions} type="qanda" />
          </TabsContent>
        </Tabs>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24">{sideCard}</div>
      </aside>
    </div>
  );
}
