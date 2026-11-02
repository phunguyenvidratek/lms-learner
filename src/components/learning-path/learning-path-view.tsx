"use client";

import Link from "next/link";
import { Check, Lock, PlayCircle } from "lucide-react";
import { CourseImage } from "@/components/common/course-image";
import { MoodleHtml } from "@/components/common/moodle-html";
import { ProgressRing } from "@/components/common/progress-ring";
import { CourseStatusBadge } from "@/components/common/status-badge";
import { courseCta } from "@/components/course/course-cta";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLearning } from "@/lib/store/learning-store";
import { cn, formatDate, formatDuration } from "@/lib/utils";
import type { LearningPath } from "@/types/moodle";

/** LP-01 (lộ trình nhiều khóa theo thứ tự, khóa sau mở khi xong khóa trước), LP-02 (trang lộ trình) */
export function LearningPathView({ path }: { path: LearningPath }) {
  const { course } = useLearning();
  const steps = path.steps.map((s) => ({ ...s, view: course(s.courseid)! }));
  const percent = Math.round(steps.reduce((sum, s) => sum + s.view.progress, 0) / steps.length);
  const done = steps.filter((s) => s.view.status === "completed").length;
  const current = steps.find((s) => !s.view.locked && s.view.status !== "completed");
  const totalDuration = steps.reduce((sum, s) => sum + s.view.counts.duration, 0);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-brand-950 p-6 text-white sm:p-8">
        <div className="absolute -right-16 -bottom-24 size-72 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={percent} size={96} stroke={8} barClassName="stroke-success" trackClassName="stroke-white/15">
            <span className="text-xl font-bold">{percent}%</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-brand-200">Lộ trình học</p>
            <h1 className="mt-1 text-2xl font-bold">{path.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">{path.description}</p>
            <p className="mt-3 text-sm text-white/80">
              {done}/{steps.length} khóa hoàn thành • {formatDuration(totalDuration)} nội dung
            </p>
          </div>
          {current && (
            <Button asChild size="lg" className="bg-white text-brand-800 hover:bg-brand-50">
              <Link href={courseCta(current.view).href!}>
                <PlayCircle /> Học tiếp
              </Link>
            </Button>
          )}
        </div>
      </section>

      <ol className="relative space-y-4">
        {steps.map((s, i) => {
          const v = s.view;
          const completed = v.status === "completed";
          const isCurrent = current?.courseid === s.courseid;
          const cta = courseCta(v);
          const showStage = i === 0 || steps[i - 1].stage !== s.stage;
          return (
            <li key={s.courseid} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-x-4">
              {i < steps.length - 1 && (
                <span className={cn("absolute top-10 bottom-[-16px] left-[19px] w-0.5", completed ? "bg-success" : "bg-border")} aria-hidden />
              )}
              <span
                className={cn(
                  "relative z-10 mt-1 flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold",
                  completed && "border-success bg-success text-white",
                  isCurrent && "border-primary bg-primary text-white ring-4 ring-brand-100",
                  v.locked && "border-border bg-muted text-muted-foreground",
                  !completed && !isCurrent && !v.locked && "border-primary bg-card text-primary",
                )}
              >
                {completed ? <Check className="size-5" /> : v.locked ? <Lock className="size-4" /> : i + 1}
              </span>
              <div>
                {showStage && <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{s.stage}</p>}
                <div className={cn("flex flex-col overflow-hidden rounded-xl border bg-card sm:flex-row", isCurrent && "border-primary shadow-md", v.locked && "opacity-80")}>
                  <CourseImage src={v.info.courseimage} alt={v.info.fullname} className={cn("aspect-video sm:aspect-auto sm:w-48 sm:shrink-0", v.locked && "grayscale")} sizes="(min-width: 640px) 192px, 100vw" />
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">Bước {i + 1}</span>
                      <CourseStatusBadge status={v.status} locked={v.locked} />
                    </div>
                    <Link href={`/courses/${v.info.id}`} className="font-bold hover:text-primary">
                      {v.info.fullname}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {v.counts.lessons} bài học • {formatDuration(v.counts.duration)} • {v.counts.quizzes} bài kiểm tra
                    </p>
                    {v.locked ? (
                      <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <Lock className="mt-0.5 size-3.5 shrink-0" /> <MoodleHtml inline html={v.lockReason ?? ""} />
                      </p>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="min-w-40 flex-1 space-y-1">
                          <Progress value={v.progress} indicatorClassName={completed ? "bg-success" : undefined} />
                          <p className="text-xs text-muted-foreground">
                            {completed && v.completedAt ? `Hoàn thành ngày ${formatDate(v.completedAt)}` : `${v.progress}% hoàn thành`}
                          </p>
                        </div>
                        <Button asChild size="sm" variant={isCurrent ? "default" : "outline-primary"}>
                          <Link href={cta.href!}>{cta.label}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
