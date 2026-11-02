"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Award, Check, CheckCircle2, ChevronLeft, ChevronRight, Download, Eye, Lock } from "lucide-react";
import { MoodleHtml } from "@/components/common/moodle-html";
import { CourseForum } from "@/components/course/course-forum";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsLineList, TabsLineTrigger } from "@/components/ui/tabs";
import { moduleHref, type CourseView } from "@/lib/learning";
import { useLearning } from "@/lib/store/learning-store";
import { cn, formatDuration, formatFileSize } from "@/lib/utils";
import { resolveVideoSource } from "@/lib/video";
import type { CourseModule, ForumDiscussion } from "@/types/moodle";
import { CourseContentList } from "./course-content-list";
import { PageContent, ResourceContent, UnsupportedContent, UrlContent } from "./lesson-content";
import { VideoPlayer } from "./video-player";

function useNeighbours(view: CourseView, cmid: number) {
  const i = view.playable.findIndex((m) => m.id === cmid);
  return { prev: i > 0 ? view.playable[i - 1] : undefined, next: i >= 0 ? view.playable[i + 1] : undefined };
}

/** LEARN-09: nút Đánh dấu hoàn thành (thủ công) hoặc trạng thái hoàn thành tự động */
function CompletionControl({ module }: { module: CourseModule }) {
  const { actions } = useLearning();
  const cd = module.completiondata;
  if (!cd) return null;
  const done = cd.state === 1 || cd.state === 2;
  if (cd.tracking === 1)
    return (
      <Button
        variant={done ? "success" : "outline-primary"}
        onClick={() => actions.setManualCompletion(module.id, !done)}
        aria-pressed={done}
      >
        {done ? <CheckCircle2 /> : <Check />}
        {done ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
      </Button>
    );
  if (done)
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-success-soft px-3 py-2 text-sm font-semibold text-success">
        <CheckCircle2 className="size-4" /> Đã hoàn thành
      </span>
    );
  const hint = module.modname === "drivevideo" ? "Tự hoàn thành khi xem tới 90% video" : module.modname === "url" ? "Hoàn thành khi mở liên kết" : "Hoàn thành khi mở bài";
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
      <Eye className="size-4" /> {hint}
    </span>
  );
}

function NavButton({ courseId, module, dir }: { courseId: number; module?: CourseModule; dir: "prev" | "next" }) {
  if (!module)
    return dir === "next" ? (
      <Button asChild variant="outline">
        <Link href={`/courses/${courseId}`}>Về trang khóa học</Link>
      </Button>
    ) : (
      <span />
    );
  return (
    <Button asChild variant={dir === "next" ? "default" : "outline"} className="max-w-[48%] min-w-0">
      <Link href={moduleHref(courseId, module)} title={module.name}>
        {dir === "prev" && <ChevronLeft />}
        <span className="truncate">
          <span className="hidden sm:inline">{dir === "prev" ? "Bài trước: " : "Tiếp theo: "}</span>
          <span className="sm:hidden">{dir === "prev" ? "Bài trước" : "Tiếp theo"}</span>
          <span className="hidden sm:inline">{module.name}</span>
        </span>
        {dir === "next" && <ChevronRight />}
      </Link>
    </Button>
  );
}

/** LEARN-13 (Tổng quan), LEARN-14 (Tài liệu), thông báo khóa (CDET-08) */
function LessonTabs({ view, module, discussions }: { view: CourseView; module: CourseModule; discussions: ForumDiscussion[] }) {
  const section = view.sections.find((s) => s.modules.some((m) => m.id === module.id))!;
  const files = [
    ...(module.modname !== "resource" ? (module.contents ?? []) : []),
    ...section.modules.filter((m) => m.modname === "resource" && m.uservisible).flatMap((m) => m.contents ?? []),
  ].filter((f, i, arr) => arr.findIndex((x) => x.fileurl === f.fileurl) === i);
  const videoDuration = view.sections.flatMap((s) => s.modules).filter((m) => m.modname === "drivevideo").reduce((s, m) => s + (m.customdata_duration ?? 0), 0);
  const news = discussions.filter((d) => d.forumtype === "news").length;

  return (
    <Tabs defaultValue="tong-quan" className="gap-0">
      <TabsLineList className="px-4 sm:px-8">
        <TabsLineTrigger value="noi-dung" className="lg:hidden">
          Nội dung
        </TabsLineTrigger>
        <TabsLineTrigger value="tong-quan">Tổng quan</TabsLineTrigger>
        <TabsLineTrigger value="tai-lieu">Tài liệu {files.length > 0 && <span className="text-muted-foreground">({files.length})</span>}</TabsLineTrigger>
        <TabsLineTrigger value="thong-bao">Thông báo {news > 0 && <span className="text-muted-foreground">({news})</span>}</TabsLineTrigger>
      </TabsLineList>
      <TabsContent value="noi-dung" className="lg:hidden">
        <div className="h-[70vh] border-b">
          <CourseContentList view={view} currentCmid={module.id} />
        </div>
      </TabsContent>
      <TabsContent value="tong-quan" className="px-4 py-6 sm:px-8">
        <div className="max-w-3xl space-y-0 divide-y">
          <div className="pb-6">
            <h2 className="text-xl font-semibold">Về bài học này</h2>
            <MoodleHtml html={module.description || section.summary} className="mt-2 text-sm leading-6" />
            <p className="mt-2 text-sm text-muted-foreground">Thuộc {section.name}</p>
          </div>
          <div className="grid gap-2 py-6 sm:grid-cols-[180px_1fr]">
            <p className="text-sm font-medium">Theo số liệu</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <div>Số phần: {view.sections.filter((s) => s.section > 0).length}</div>
              <div>Bài học: {view.counts.lessons}</div>
              <div>Video: {view.counts.videos} ({formatDuration(videoDuration)})</div>
              <div>Bài kiểm tra: {view.counts.quizzes}</div>
              <div>Ngôn ngữ: Tiếng Việt</div>
              <div>Giảng viên: {view.info.teacher}</div>
            </dl>
          </div>
          <div className="grid gap-2 py-6 sm:grid-cols-[180px_1fr]">
            <p className="text-sm font-medium">Chứng nhận</p>
            <div>
              <p className="text-sm">Nhận chứng nhận VIGO khi hoàn thành tất cả bài học và đạt các bài kiểm tra cuối phần.</p>
              {view.status === "completed" ? (
                <Button asChild variant="outline-primary" size="sm" className="mt-3">
                  <Link href={`/certificates/${view.info.id}`}>
                    <Award /> Xem chứng nhận
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="mt-3" disabled>
                  <Award /> Chứng nhận VIGO
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-2 py-6 sm:grid-cols-[180px_1fr]">
            <p className="text-sm font-medium">Mô tả khóa học</p>
            <MoodleHtml html={view.info.description} className="text-sm leading-6" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="tai-lieu" className="px-4 py-6 sm:px-8">
        {files.length ? (
          <ul className="max-w-3xl divide-y rounded-xl border">
            {files.map((f) => (
              <li key={f.fileurl} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-danger-soft text-[10px] font-bold text-destructive">PDF</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.filename}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(f.filesize)}</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <a href={f.fileurl} target="_blank" rel="noopener noreferrer">
                    Xem
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={f.fileurl} download={f.filename}>
                    <Download /> <span className="hidden sm:inline">Tải xuống</span>
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Bài học này không có tài liệu đính kèm.</p>
        )}
      </TabsContent>
      <TabsContent value="thong-bao" className="px-4 py-6 sm:px-8">
        <div className="max-w-3xl">
          <CourseForum discussions={discussions} type="news" />
        </div>
      </TabsContent>
    </Tabs>
  );
}

/** LEARN-01..06, LEARN-08..15: màn học một bài */
export function LessonView({
  courseId,
  cmid,
  pageHtml,
  discussions,
}: {
  courseId: number;
  cmid: number;
  pageHtml: string | null;
  discussions: ForumDiscussion[];
}) {
  const { course, actions } = useLearning();
  const view = course(courseId)!;
  const module = view.sections.flatMap((s) => s.modules).find((m) => m.id === cmid)!;
  const { prev, next } = useNeighbours(view, cmid);
  const visible = module.uservisible;

  // LEARN-10: ghi nhận đã xem khi mở bài
  useEffect(() => {
    if (visible) actions.viewModule(courseId, module);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, cmid, visible]);

  if (!visible) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
          <Lock className="size-6 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-xl font-bold">{module.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bài học chưa mở. <MoodleHtml inline html={module.availabilityinfo ?? ""} />.
        </p>
        <Button asChild className="mt-6">
          <Link href={view.next ? moduleHref(courseId, view.next) : `/courses/${courseId}`}>Đến bài cần học</Link>
        </Button>
      </div>
    );
  }

  const isVideo = module.modname === "drivevideo";
  const source = isVideo ? resolveVideoSource(module) : null;

  return (
    <div>
      {isVideo && source && (
        <div className="group/video relative bg-player">
          <div className="mx-auto max-w-[calc((100dvh-3.5rem-9rem)*16/9)]">
            <VideoPlayer
              cmid={module.id}
              source={source}
              title={module.name}
              onReachEnd={source.kind === "file" ? () => actions.completeModule(module.id) : undefined}
            />
          </div>
          {prev && (
            <Link
              href={moduleHref(courseId, prev)}
              aria-label={`Bài trước: ${prev.name}`}
              className="absolute top-1/2 left-0 hidden -translate-y-1/2 rounded-r-md bg-primary/90 p-1.5 text-white opacity-0 transition-opacity group-hover/video:opacity-100 sm:block"
            >
              <ChevronLeft className="size-6" />
            </Link>
          )}
          {next && (
            <Link
              href={moduleHref(courseId, next)}
              aria-label={`Tiếp theo: ${next.name}`}
              className="absolute top-1/2 right-0 hidden -translate-y-1/2 rounded-l-md bg-primary/90 p-1.5 text-white opacity-0 transition-opacity group-hover/video:opacity-100 sm:block"
            >
              <ChevronRight className="size-6" />
            </Link>
          )}
        </div>
      )}
      {module.modname === "page" && <PageContent module={module} html={pageHtml} />}
      {module.modname === "resource" && <ResourceContent module={module} />}
      {module.modname === "url" && <UrlContent module={module} />}
      {module.modname === "assign" && <UnsupportedContent module={module} />}

      <div className="border-b px-4 py-4 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link href="/courses" className="hover:text-primary hover:underline">
            Khóa học của tôi
          </Link>
          <ChevronRight className="size-3" />
          <Link href={`/courses/${courseId}`} className="hover:text-primary hover:underline">
            {view.info.fullname}
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{module.name}</span>
        </nav>
        <div className={cn("mt-2 flex flex-wrap items-center justify-between gap-3", !isVideo && module.modname !== "resource" && "mt-1")}>
          {isVideo || module.modname === "resource" ? (
            <h1 className="text-lg font-bold sm:text-xl">{module.name}</h1>
          ) : (
            <span />
          )}
          <CompletionControl module={module} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <NavButton courseId={courseId} module={prev} dir="prev" />
          <NavButton courseId={courseId} module={next} dir="next" />
        </div>
      </div>

      <LessonTabs view={view} module={module} discussions={discussions} />
    </div>
  );
}
