"use client";

import { Check, CheckCircle2, X, XCircle } from "lucide-react";
import { questionScore } from "@/lib/learning";
import { formatGrade } from "@/lib/store/learning-store";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/moodle";

const HINT: Record<QuizQuestion["type"], string> = {
  multichoice: "Chọn một đáp án",
  multichoiceset: "Chọn tất cả đáp án đúng. Điểm tính theo từng đáp án.",
  truefalse: "Đúng hay sai?",
};

/**
 * QUIZ-02: đáp án dạng thẻ lớn dễ bấm (ảnh Udemy 08, 09).
 * QUIZ-05: chế độ review hiện đáp án đúng, đáp án đã chọn và giải thích.
 */
export function QuestionCard({
  question,
  total,
  selected,
  onChange,
  review,
}: {
  question: QuizQuestion;
  total: number;
  selected: string[];
  onChange?: (value: string[]) => void;
  review?: boolean;
}) {
  const multi = question.type === "multichoiceset";
  const correct = question.correct ?? [];
  const score = review ? questionScore(question, selected) : 0;

  const toggle = (value: string) => {
    if (!onChange) return;
    if (!multi) return onChange([value]);
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Câu {question.slot}</legend>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Câu {question.slot}/{total} • {HINT[question.type]}
        </p>
        {review && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              score === 1 ? "bg-success-soft text-success" : score > 0 ? "bg-warning-soft text-warning" : "bg-danger-soft text-destructive",
            )}
          >
            {score === 1 ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
            {formatGrade(score)}/1 điểm
          </span>
        )}
      </div>
      <p className="mt-2 text-lg leading-snug font-semibold sm:text-xl">{question.text}</p>
      <div className="mt-5 space-y-3" role={multi ? "group" : "radiogroup"}>
        {question.options.map((o) => {
          const isSel = selected.includes(o.value);
          const isCorrect = correct.includes(o.value);
          const state = !review ? (isSel ? "selected" : "idle") : isCorrect ? "correct" : isSel ? "wrong" : "muted";
          return (
            <button
              key={o.value}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={isSel}
              disabled={review}
              onClick={() => toggle(o.value)}
              className={cn(
                "flex w-full items-start gap-4 rounded-lg border px-4 py-3.5 text-left text-[15px] font-medium transition-colors",
                state === "idle" && "bg-card hover:border-brand-300 hover:bg-brand-50/50",
                state === "selected" && "border-primary bg-brand-50 ring-1 ring-primary",
                state === "correct" && "border-success bg-success-soft",
                state === "wrong" && "border-destructive bg-danger-soft",
                state === "muted" && "bg-card text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center border-2",
                  multi ? "rounded-[5px]" : "rounded-full",
                  isSel ? "border-primary" : "border-foreground/40",
                  review && isCorrect && "border-success",
                  review && isSel && !isCorrect && "border-destructive",
                )}
              >
                {isSel && (multi ? <Check className="size-3.5 text-primary" strokeWidth={3} /> : <span className="size-2.5 rounded-full bg-primary" />)}
              </span>
              <span className="flex-1">{o.label}</span>
              {review && isCorrect && (
                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-success">
                  Đáp án đúng <CheckCircle2 className="size-4" />
                </span>
              )}
              {review && isSel && !isCorrect && (
                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-destructive">
                  Bạn chọn <X className="size-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {review && question.feedback && (
        <div className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <span className="font-semibold">Giải thích: </span>
          {question.feedback}
        </div>
      )}
      {review && selected.length === 0 && <p className="mt-3 text-sm text-destructive">Bạn chưa trả lời câu này.</p>}
    </fieldset>
  );
}
