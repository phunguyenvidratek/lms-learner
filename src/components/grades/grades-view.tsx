"use client";

import Link from "next/link";
import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { BarChart3, ChevronDown } from "lucide-react";
import { CourseImage } from "@/components/common/course-image";
import { EmptyState } from "@/components/common/empty-state";
import { QuizStateBadge } from "@/components/tests/quiz-state-badge";
import { Badge } from "@/components/ui/badge";
import { courseGrade, type QuizListItem } from "@/lib/learning";
import { formatGrade, useLearning } from "@/lib/store/learning-store";
import { cn } from "@/lib/utils";

/** Phản hồi theo mức điểm (mod_quiz_get_quiz_feedback_for_grade) */
function feedback(best: number | null) {
  if (best === null) return "-";
  if (best >= 9) return "Nắm vững kiến thức";
  if (best >= 8) return "Đạt yêu cầu";
  return "Cần ôn lại trước khi làm lại";
}

/** GRADE-01 (tổng quan điểm theo khóa), GRADE-02 (chi tiết từng bài kiểm tra) */
export function GradesView() {
  const { courses, quizzes } = useLearning();
  const rows = courses
    .filter((c) => !c.locked)
    .map((c) => {
      const items = quizzes.filter((q) => q.course.info.id === c.info.id);
      return { view: c, items, grade: courseGrade(items) };
    });
  const [open, setOpen] = useState<string[]>(rows.filter((r) => r.view.status === "inprogress").map((r) => String(r.view.info.id)));

  const graded = rows.filter((r) => r.grade !== null);
  const avg = graded.length ? graded.reduce((s, r) => s + (r.grade ?? 0), 0) / graded.length : null;
  const passedQuizzes = quizzes.filter((q) => q.summary.passed).length;
  const attempted = quizzes.filter((q) => q.summary.attempts.length).length;

  if (!rows.length) return <EmptyState icon={BarChart3} title="Chưa có điểm" description="Điểm sẽ hiển thị khi bạn làm bài kiểm tra." />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="rounded-xl border bg-card p-3 sm:p-5">
          <p className="text-xs text-muted-foreground sm:text-sm">Điểm trung bình</p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl text-primary">{avg !== null ? formatGrade(Math.round(avg * 100) / 100) : "-"}<span className="text-base font-medium text-muted-foreground">/10</span></p>
        </div>
        <div className="rounded-xl border bg-card p-3 sm:p-5">
          <p className="text-xs text-muted-foreground sm:text-sm">Khóa đã hoàn thành</p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl text-success">
            {rows.filter((r) => r.view.status === "completed").length}
            <span className="text-base font-medium text-muted-foreground">/{courses.length}</span>
          </p>
        </div>
        <div className="rounded-xl border bg-card p-3 sm:p-5">
          <p className="text-xs text-muted-foreground sm:text-sm">Bài kiểm tra đạt</p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">
            {passedQuizzes}
            <span className="text-base font-medium text-muted-foreground">/{attempted}</span>
          </p>
        </div>
      </div>

      <AccordionPrimitive.Root type="multiple" value={open} onValueChange={setOpen} className="space-y-3">
        {rows.map(({ view, items, grade }) => {
          const passed = view.status === "completed";
          return (
            <AccordionPrimitive.Item key={view.info.id} value={String(view.info.id)} className="overflow-hidden rounded-xl border bg-card">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full items-center gap-4 p-4 text-left hover:bg-muted/40">
                  <CourseImage src={view.info.courseimage} alt="" className="hidden aspect-video w-24 shrink-0 rounded-md sm:block" sizes="96px" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{view.info.fullname}</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {view.quizzesPassed}/{view.counts.quizzes} bài kiểm tra đạt • Tiến độ {view.progress}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xl font-bold", grade === null ? "text-muted-foreground" : passed ? "text-success" : "text-foreground")}>
                      {grade !== null ? formatGrade(grade) : "-"}
                      {grade !== null && <span className="text-sm font-medium text-muted-foreground">/10</span>}
                    </p>
                    <Badge variant={passed ? "success" : view.status === "inprogress" ? "secondary" : "muted"}>
                      {passed ? "Đạt" : view.status === "inprogress" ? "Đang học" : "Chưa bắt đầu"}
                    </Badge>
                  </div>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <QuizTable items={items} />
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          );
        })}
      </AccordionPrimitive.Root>
      <p className="text-xs text-muted-foreground">
        Điểm khóa là trung bình điểm cao nhất của các bài kiểm tra đã làm. Khóa đạt khi hoàn thành tất cả bài học và đạt toàn bộ bài kiểm tra cuối phần.
      </p>
    </div>
  );
}

function QuizTable({ items }: { items: QuizListItem[] }) {
  return (
    <div className="overflow-x-auto border-t">
      <table className="w-full min-w-[620px] text-sm">
        <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Bài kiểm tra</th>
            <th className="px-4 py-2.5 font-medium">Điểm</th>
            <th className="px-4 py-2.5 font-medium">Điểm đạt</th>
            <th className="px-4 py-2.5 font-medium">Số lần</th>
            <th className="px-4 py-2.5 font-medium">Phản hồi</th>
            <th className="px-4 py-2.5 font-medium">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map(({ module, section, summary }) => (
            <tr key={module.id}>
              <td className="px-4 py-3">
                <Link href={`/quiz/${module.id}`} className="font-medium hover:text-primary hover:underline">
                  {summary.quiz.name}
                </Link>
                <p className="text-xs text-muted-foreground">{section.name.split(":")[1]?.trim()}</p>
              </td>
              <td className={cn("px-4 py-3 font-semibold", summary.passed ? "text-success" : summary.best !== null ? "text-warning" : "text-muted-foreground")}>
                {summary.best !== null ? `${formatGrade(summary.best)}/10` : "-"}
              </td>
              <td className="px-4 py-3">{summary.quiz.gradepass}/10</td>
              <td className="px-4 py-3">
                {summary.attempts.length}/{summary.quiz.attempts}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{feedback(summary.best)}</td>
              <td className="px-4 py-3">
                <QuizStateBadge state={summary.state} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
