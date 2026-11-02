"use client";

import Link from "next/link";
import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, FolderOpen, Lock, X } from "lucide-react";
import { MoodleHtml } from "@/components/common/moodle-html";
import { ModuleIcon } from "@/components/common/module-icon";
import { moduleDurationLabel } from "@/components/course/module-status";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { learnerModules, moduleHref, sectionProgress, type CourseView } from "@/lib/learning";
import { useLearning } from "@/lib/store/learning-store";
import { cn, formatDuration } from "@/lib/utils";
import type { CourseModule } from "@/types/moodle";

/** LEARN-14: dropdown tài liệu đính kèm của bài (như nút Resources của Udemy) */
export function ResourcesMenu({ module, className }: { module: CourseModule; className?: string }) {
  const files = module.contents?.filter((f) => f.type === "file") ?? [];
  if (!files.length || module.modname === "resource") return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-primary px-2 py-1 text-xs font-medium text-primary hover:bg-brand-50",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <FolderOpen className="size-3.5" /> Tài liệu <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {files.map((f) => (
          <DropdownMenuItem key={f.filename} asChild>
            <a href={f.fileurl} target="_blank" rel="noopener noreferrer">
              {f.filename}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * LEARN-12: sidebar Nội dung khóa học. Checkbox hoàn thành (bấm được với bài hoàn thành thủ công),
 * số thứ tự, thời lượng, bài đang học được highlight, x/y và tổng thời lượng mỗi phần.
 */
export function CourseContentList({ view, currentCmid, onClose }: { view: CourseView; currentCmid: number; onClose?: () => void }) {
  const { actions } = useLearning();
  const sections = view.sections.filter((s) => s.section > 0);
  const current = sections.find((s) => s.modules.some((m) => m.id === currentCmid));
  const [open, setOpen] = useState<string[]>(current ? [String(current.id)] : []);
  const labels = view.sections.flatMap((s) => s.modules.filter((m) => m.modname === "label"));

  const numbers = new Map<number, number>();
  sections.flatMap((s) => learnerModules(s).filter((m) => m.modname !== "label")).forEach((m, i) => numbers.set(m.id, i + 1));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <p className="font-bold">Nội dung khóa học</p>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Đóng nội dung khóa học">
            <X className="size-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {labels.map((l) => (
          <MoodleHtml key={l.id} html={l.description ?? ""} className="border-b bg-brand-50 px-4 py-3 text-xs leading-5 text-brand-900 [&_p]:my-0" />
        ))}
        <AccordionPrimitive.Root type="multiple" value={open} onValueChange={setOpen}>
          {sections.map((s) => {
            const p = sectionProgress(s);
            const modules = learnerModules(s).filter((m) => m.modname !== "label");
            return (
              <AccordionPrimitive.Item key={s.id} value={String(s.id)} className="border-b">
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="group flex w-full items-start gap-2 bg-muted/60 px-4 py-3 text-left hover:bg-muted">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-snug font-bold">{s.name}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {!s.uservisible && <Lock className="size-3" />}
                        {p.done} / {p.total} | {formatDuration(p.duration)}
                      </span>
                    </span>
                    <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  {!s.uservisible && s.availabilityinfo && (
                    <p className="flex items-start gap-2 bg-warning-soft px-4 py-2 text-xs text-warning">
                      <Lock className="mt-0.5 size-3 shrink-0" />
                      <MoodleHtml inline html={s.availabilityinfo} />
                    </p>
                  )}
                  <ul>
                    {modules.map((m) => {
                      const active = m.id === currentCmid;
                      const done = m.completiondata?.state === 1 || m.completiondata?.state === 2;
                      const manual = m.completiondata?.tracking === 1;
                      const duration = moduleDurationLabel(m);
                      const row = (
                        <>
                          <span className="min-w-0 flex-1">
                            <span className={cn("block text-sm leading-snug", active && "font-semibold")}>
                              {numbers.get(m.id)}. {m.name}
                            </span>
                            <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              {m.uservisible ? <ModuleIcon modname={m.modname} className="size-3.5" /> : <Lock className="size-3.5" />}
                              {duration ?? (m.modname === "quiz" ? "10 câu hỏi" : m.modname === "url" ? "Liên kết ngoài" : m.modname === "resource" ? "PDF" : "")}
                            </span>
                          </span>
                        </>
                      );
                      return (
                        <li key={m.id} className={cn("relative flex items-start gap-3 px-4 py-2.5", active ? "bg-brand-100/70" : m.uservisible && "hover:bg-muted/70")}>
                          {m.completiondata ? (
                            <Checkbox
                              checked={done}
                              disabled={!m.uservisible || !manual}
                              onCheckedChange={(v) => actions.setManualCompletion(m.id, v === true)}
                              aria-label={manual ? `Đánh dấu hoàn thành ${m.name}` : done ? "Đã hoàn thành" : "Chưa hoàn thành"}
                              className="relative z-10 mt-0.5 disabled:cursor-default disabled:opacity-100 data-[state=unchecked]:disabled:opacity-60"
                            />
                          ) : (
                            <span className="size-4 shrink-0" />
                          )}
                          {m.uservisible ? (
                            <Link href={moduleHref(view.info.id, m)} className="flex min-w-0 flex-1 after:absolute after:inset-0" aria-current={active ? "page" : undefined}>
                              {row}
                            </Link>
                          ) : (
                            <div className="flex min-w-0 flex-1 text-muted-foreground">{row}</div>
                          )}
                          <ResourcesMenu module={m} className="relative z-10 mt-5 shrink-0" />
                        </li>
                      );
                    })}
                  </ul>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            );
          })}
        </AccordionPrimitive.Root>
      </div>
    </div>
  );
}
