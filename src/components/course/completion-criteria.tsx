"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CourseView } from "@/lib/learning";
import { cn } from "@/lib/utils";

/** CDET-06: tiêu chí hoàn thành khóa (core_completion_get_course_completion_status) */
export function CompletionCriteria({ view }: { view: CourseView }) {
  const lessons = view.total - view.counts.quizzes;
  const lessonsDone = view.done - view.quizzesPassed;
  const criteria = [
    { title: "Hoàn thành tất cả bài học", detail: `${lessonsDone}/${lessons} bài`, complete: lessonsDone >= lessons },
    {
      title: "Đạt toàn bộ bài kiểm tra cuối phần",
      detail: `${view.quizzesPassed}/${view.counts.quizzes} bài đạt từ 8/10`,
      complete: view.quizzesPassed >= view.counts.quizzes,
    },
  ];
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">Điều kiện hoàn thành khóa</h2>
        {view.completedAt && <span className="text-xs font-semibold text-success">Đạt ngày {formatDate(view.completedAt)}</span>}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Cần đạt tất cả điều kiện để hoàn thành khóa và nhận chứng nhận.</p>
      <ul className="mt-4 space-y-3">
        {criteria.map((c) => (
          <li key={c.title} className="flex items-start gap-3">
            {c.complete ? <CheckCircle2 className="mt-0.5 size-5 text-success" /> : <Circle className="mt-0.5 size-5 text-input" />}
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-medium", c.complete && "text-success")}>{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
