"use client";

import Link from "next/link";
import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Info, Lock } from "lucide-react";
import { MoodleHtml } from "@/components/common/moodle-html";
import { ModuleIcon, MOD_LABEL } from "@/components/common/module-icon";
import { formatGrade, useLearning } from "@/lib/store/learning-store";
import { learnerModules, moduleHref, sectionProgress, type CourseView } from "@/lib/learning";
import { cn, formatDuration } from "@/lib/utils";
import { ModuleStatusIcon, moduleDurationLabel } from "./module-status";

/**
 * CDET-03 (outline section, x/y, thời lượng), CDET-04 (ổ khóa và lý do),
 * CDET-05 (ẩn qbank, forum chuyển sang tab, label hiển thị inline), LEARN-06.
 */
export function CourseCurriculum({ view }: { view: CourseView }) {
  const { quizzes } = useLearning();
  const contentSections = view.sections.filter((s) => s.section > 0);
  const firstOpen = contentSections.find((s) => s.uservisible && sectionProgress(s).done < sectionProgress(s).total) ?? contentSections[0];
  const [open, setOpen] = useState<string[]>(firstOpen ? [String(firstOpen.id)] : []);
  const allOpen = open.length === contentSections.length;
  const labels = view.sections.flatMap((s) => s.modules.filter((m) => m.modname === "label"));

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">Nội dung khóa học</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {contentSections.length} phần • {view.counts.lessons} bài học • {formatDuration(view.counts.duration)} tổng thời lượng
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? [] : contentSections.map((s) => String(s.id)))}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {allOpen ? "Thu gọn tất cả các phần" : "Mở rộng tất cả các phần"}
        </button>
      </div>

      {labels.map((l) => (
        <div key={l.id} className="mb-3 flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-900">
          <Info className="mt-0.5 size-4 shrink-0 text-brand-600" />
          <MoodleHtml html={l.description ?? ""} className="text-sm leading-6 text-brand-900 [&_p]:my-0" />
        </div>
      ))}

      <AccordionPrimitive.Root type="multiple" value={open} onValueChange={setOpen} className="overflow-hidden rounded-xl border bg-card">
        {contentSections.map((s) => {
          const p = sectionProgress(s);
          return (
            <AccordionPrimitive.Item key={s.id} value={String(s.id)} className="border-b last:border-b-0">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full items-center gap-3 bg-muted/60 px-4 py-3.5 text-left hover:bg-muted">
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  <span className="min-w-0 flex-1 font-semibold">{s.name}</span>
                  {!s.uservisible && <Lock className="size-4 shrink-0 text-muted-foreground" aria-label="Chưa mở" />}
                  <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                    {p.done}/{p.total} • {formatDuration(p.duration)}
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="px-4 pt-2 text-xs text-muted-foreground sm:hidden">
                  {p.done}/{p.total} đã hoàn thành • {formatDuration(p.duration)}
                </p>
                {!s.uservisible && s.availabilityinfo && (
                  <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning">
                    <Lock className="mt-0.5 size-4 shrink-0" />
                    <span>
                      Chưa mở: <MoodleHtml inline html={s.availabilityinfo} />
                    </span>
                  </div>
                )}
                <ul className="py-1">
                  {learnerModules(s)
                    .filter((m) => m.modname !== "label")
                    .map((m) => {
                      const quiz = m.modname === "quiz" ? quizzes.find((q) => q.module.id === m.id)?.summary : undefined;
                      const duration = moduleDurationLabel(m);
                      const inner = (
                        <>
                          <ModuleIcon modname={m.modname} className="size-4 shrink-0 text-muted-foreground" />
                          <span className={cn("min-w-0 flex-1", m.uservisible && "group-hover/item:text-primary group-hover/item:underline")}>
                            {m.name}
                          </span>
                          {quiz && quiz.best !== null && (
                            <span className={cn("shrink-0 text-xs font-semibold", quiz.passed ? "text-success" : "text-warning")}>
                              {quiz.passed ? "Đạt" : "Chưa đạt"} {formatGrade(quiz.best)}/10
                            </span>
                          )}
                          <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
                            {duration ?? MOD_LABEL[m.modname]}
                          </span>
                          <span className="flex w-5 shrink-0 justify-end">
                            <ModuleStatusIcon module={m} />
                          </span>
                        </>
                      );
                      return (
                        <li key={m.id}>
                          {m.uservisible ? (
                            <Link href={moduleHref(view.info.id, m)} className="group/item flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-50/60">
                              {inner}
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground">{inner}</div>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          );
        })}
      </AccordionPrimitive.Root>
    </section>
  );
}
