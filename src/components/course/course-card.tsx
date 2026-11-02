"use client";

import Link from "next/link";
import { Clock, Heart, Lock, PlayCircle } from "lucide-react";
import { CourseImage } from "@/components/common/course-image";
import { MoodleHtml } from "@/components/common/moodle-html";
import { CourseStatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CourseView } from "@/lib/learning";
import { useLearning } from "@/lib/store/learning-store";
import { cn, formatDuration, stripHtml } from "@/lib/utils";
import { courseCta } from "./course-cta";

/** COURSE-01 (card), COURSE-02 (nút theo trạng thái), COURSE-04 (yêu thích), COURSE-06 (số bài, thời lượng) */
export function CourseCard({ view }: { view: CourseView }) {
  const { actions } = useLearning();
  const { info } = view;
  const cta = courseCta(view);
  const completed = view.status === "completed";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md">
      <div className="relative">
        <Link href={`/courses/${info.id}`} className="block" tabIndex={-1} aria-hidden>
          <CourseImage
            src={info.courseimage}
            alt={info.fullname}
            className="aspect-video"
            imgClassName={cn("transition-transform duration-300 group-hover:scale-[1.03]", view.locked && "grayscale-[60%]")}
          />
          {view.locked && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/35">
              <span className="flex size-11 items-center justify-center rounded-full bg-white/90 text-foreground">
                <Lock className="size-5" />
              </span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => actions.toggleFavourite(info.id)}
          aria-label={view.isfavourite ? "Bỏ yêu thích" : "Yêu thích"}
          aria-pressed={view.isfavourite}
          className="absolute top-2.5 right-2.5 flex size-9 items-center justify-center rounded-full bg-white/95 text-foreground shadow-sm hover:bg-white"
        >
          <Heart className={cn("size-[18px]", view.isfavourite && "fill-destructive text-destructive")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">{info.coursecategory}</span>
          <CourseStatusBadge status={view.status} locked={view.locked} />
        </div>
        <div>
          <Link href={`/courses/${info.id}`} className="line-clamp-2 leading-snug font-bold hover:text-primary">
            {info.fullname}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">{info.teacher}</p>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{stripHtml(info.summary)}</p>
        <p className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <PlayCircle className="size-3.5" /> {view.counts.lessons} bài học
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {formatDuration(view.counts.duration)}
          </span>
        </p>

        <div className="mt-auto space-y-3 pt-1">
          {view.locked ? (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Lock className="mt-0.5 size-3 shrink-0" />
              <MoodleHtml inline html={view.lockReason ?? ""} />
            </p>
          ) : (
            <div className="space-y-1.5">
              <Progress value={view.progress} indicatorClassName={completed ? "bg-success" : undefined} />
              <p className="text-xs text-muted-foreground">
                <span className={cn("font-semibold", completed ? "text-success" : "text-foreground")}>{view.progress}%</span> hoàn thành
              </p>
            </div>
          )}
          {cta.href ? (
            <Button asChild variant={completed ? "outline-primary" : "default"} className="w-full">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/courses/${info.id}`}>Xem chi tiết</Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
