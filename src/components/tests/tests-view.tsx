"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import type { QuizState } from "@/lib/learning";
import { formatGrade, useLearning } from "@/lib/store/learning-store";
import { useNow } from "@/lib/use-now";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { QUIZ_STATE, QuizStateBadge } from "./quiz-state-badge";

type Filter = "all" | "notstarted" | "inprogress" | "passed" | "failed" | "locked";
const FILTERS: { key: Filter; label: string; match: QuizState[] }[] = [
  { key: "all", label: "Tất cả", match: [] },
  { key: "notstarted", label: "Chưa làm", match: ["notstarted"] },
  { key: "inprogress", label: "Đang làm", match: ["inprogress"] },
  { key: "passed", label: "Đạt", match: ["passed"] },
  { key: "failed", label: "Chưa đạt", match: ["failed", "exhausted"] },
  { key: "locked", label: "Chưa mở", match: ["locked"] },
];

/** TEST-01 (danh sách), TEST-02 (lọc trạng thái, khóa), TEST-03 (bấm mở trang giới thiệu quiz) */
export function TestsView() {
  const { quizzes, courses } = useLearning();
  const [filter, setFilter] = useState<Filter>("all");
  const [courseId, setCourseId] = useState<number | "all">("all");
  const now = useNow();

  const byCourse = quizzes.filter((q) => courseId === "all" || q.course.info.id === courseId);
  const count = (f: Filter) => byCourse.filter((q) => f === "all" || FILTERS.find((x) => x.key === f)!.match.includes(q.summary.state)).length;
  const list = byCourse.filter((q) => filter === "all" || FILTERS.find((x) => x.key === filter)!.match.includes(q.summary.state));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lọc theo trạng thái">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === f.key ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
              )}
            >
              {f.label} <span className={cn("ml-1 text-xs", filter === f.key ? "text-white/80" : "text-muted-foreground")}>{count(f.key)}</span>
            </button>
          ))}
        </div>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value === "all" ? "all" : Number(e.target.value))}
          aria-label="Lọc theo khóa học"
          className="h-10 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-72"
        >
          <option value="all">Tất cả khóa học</option>
          {courses.map((c) => (
            <option key={c.info.id} value={c.info.id}>
              {c.info.fullname}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Không có bài kiểm tra phù hợp"
          description="Thử chọn trạng thái hoặc khóa học khác."
          action={
            <Button variant="outline" onClick={() => { setFilter("all"); setCourseId("all"); }}>
              Xem tất cả
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_110px_110px_100px_24px] gap-4 border-b bg-muted/60 px-5 py-2.5 text-xs font-medium text-muted-foreground lg:grid">
            <span>Bài kiểm tra</span>
            <span>Hạn nộp</span>
            <span>Số lần làm</span>
            <span>Điểm cao nhất</span>
            <span>Trạng thái</span>
            <span />
          </div>
          <ul className="divide-y">
            {list.map(({ module, course, section, summary }) => {
              const overdue = summary.quiz.timeclose && summary.quiz.timeclose < now && !summary.passed;
              return (
                <li key={module.id}>
                  <Link
                    href={`/quiz/${module.id}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-brand-50/40 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_110px_110px_100px_24px]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {summary.quiz.name} <span className="font-normal text-muted-foreground">• {section.name.split(":")[1]?.trim()}</span>
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{course.info.fullname}</p>
                    </div>
                    <div className="lg:hidden">
                      <QuizStateBadge state={summary.state} />
                    </div>
                    <p className={cn("col-span-2 text-sm lg:col-span-1", overdue ? "text-destructive" : "text-muted-foreground lg:text-foreground")}>
                      <span className="lg:hidden">Hạn: </span>
                      {summary.quiz.timeclose ? `${formatTime(summary.quiz.timeclose)}, ${formatDate(summary.quiz.timeclose)}` : "Không đặt hạn"}
                    </p>
                    <p className="col-span-2 text-sm text-muted-foreground lg:col-span-1 lg:text-foreground">
                      <span className="lg:hidden">Đã làm: </span>
                      {summary.attempts.length}/{summary.quiz.attempts}
                      <span className="lg:hidden"> • Điểm cao nhất: {summary.best !== null ? `${formatGrade(summary.best)}/10` : "-"}</span>
                    </p>
                    <p className={cn("hidden text-sm font-semibold lg:block", summary.passed ? "text-success" : summary.best !== null ? "text-warning" : "text-muted-foreground")}>
                      {summary.best !== null ? `${formatGrade(summary.best)}/10` : "-"}
                    </p>
                    <div className="hidden lg:block" title={QUIZ_STATE[summary.state].text}>
                      <QuizStateBadge state={summary.state} />
                    </div>
                    <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
