"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CourseStatus } from "@/lib/data";
import { cn, stripHtml } from "@/lib/utils";
import type { EnrolledCourse } from "@/types/moodle";

const statusLabel: Record<CourseStatus, { text: string; variant: "success" | "secondary" | "muted" }> = {
  completed: { text: "Hoàn thành", variant: "success" },
  inprogress: { text: "Đang học", variant: "secondary" },
  notstarted: { text: "Chưa bắt đầu", variant: "muted" },
};

const cta: Record<CourseStatus, string> = {
  completed: "Xem lại khóa học",
  inprogress: "Học tiếp",
  notstarted: "Bắt đầu học",
};

/**
 * COURSE-01, COURSE-02, COURSE-04. Card khóa học dùng chung cho My Courses, Dashboard, Catalog.
 * Ảnh khóa: mockup dùng gradient, bản thật dùng courseimage (pluginfile + token, xem INT-02).
 */
export function CourseCard({
  course,
  status,
  cover,
}: {
  course: EnrolledCourse;
  status: CourseStatus;
  cover: string;
}) {
  const [fav, setFav] = useState(course.isfavourite);
  const progress = course.progress ?? 0;
  const label = statusLabel[status];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md">
      <Link href={`/courses/${course.id}`} className="relative block aspect-[16/9] overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br transition-transform group-hover:scale-105", cover)} />
        <div className="absolute inset-0 flex items-end p-4">
          <span className="line-clamp-2 text-lg font-bold text-white/95 drop-shadow">{course.fullname}</span>
        </div>
        <Badge variant={label.variant} className="absolute top-3 left-3 shadow-sm">
          {label.text}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{course.coursecategory}</p>
            <Link href={`/courses/${course.id}`} className="mt-0.5 line-clamp-2 font-semibold hover:text-primary">
              {course.fullname}
            </Link>
          </div>
          <button
            onClick={() => setFav((v) => !v)}
            aria-label={fav ? "Bỏ yêu thích" : "Yêu thích"}
            aria-pressed={fav}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <Heart className={cn("size-5", fav && "fill-destructive text-destructive")} />
          </button>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{stripHtml(course.summary)}</p>

        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className={cn("font-semibold", status === "completed" ? "text-success" : "text-primary")}>{progress}%</span>
          </div>
          <Progress value={progress} indicatorClassName={status === "completed" ? "bg-success" : undefined} />
        </div>

        <Button asChild variant={status === "completed" ? "success" : "default"} className="w-full">
          <Link href={`/courses/${course.id}`}>
            {cta[status]} <ArrowRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}
