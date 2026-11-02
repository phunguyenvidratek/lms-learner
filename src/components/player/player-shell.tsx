"use client";

import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { Award, ChevronDown, PanelRightOpen, Trophy, X } from "lucide-react";
import { ProgressRing } from "@/components/common/progress-ring";
import { Logo } from "@/components/layout/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { CourseView } from "@/lib/learning";
import { useLearning } from "@/lib/store/learning-store";
import { cn } from "@/lib/utils";
import { CourseContentList } from "./course-content-list";

/** Popover "Tiến độ của bạn" (ảnh Udemy 06) */
function ProgressPopover({ view }: { view: CourseView }) {
  const completed = view.status === "completed";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white/90 outline-none hover:bg-white/10">
        <ProgressRing value={view.progress} size={34} barClassName={completed ? "stroke-success" : "stroke-brand-300"}>
          <Trophy className="size-3.5 text-white/80" />
        </ProgressRing>
        <span className="hidden sm:inline">Tiến độ của bạn</span>
        <ChevronDown className="hidden size-4 sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-4">
        <p className="font-semibold">
          {view.done}/{view.total} hoạt động đã hoàn thành.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {completed ? "Bạn đã hoàn thành khóa học." : "Hoàn thành tất cả bài học và đạt các bài kiểm tra để nhận chứng nhận."}
        </p>
        {completed && (
          <Button asChild size="sm" className="mt-3 w-full">
            <Link href={`/certificates/${view.info.id}`}>
              <Award /> Xem chứng nhận
            </Link>
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const SidebarContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: true, setOpen: () => {} });
export const usePlayerSidebar = () => useContext(SidebarContext);

/**
 * LEARN-01: layout màn học và màn làm bài kiểm tra. Thanh trên nền tối có tên khóa và tiến độ,
 * nội dung bên trái, sidebar Nội dung khóa học bên phải (mở/thu gọn). Mobile: sidebar chuyển
 * thành tab trong màn bài học.
 */
export function PlayerShell({ courseId, cmid, children }: { courseId: number; cmid: number; children: React.ReactNode }) {
  const { course } = useLearning();
  const view = course(courseId)!;
  const [open, setOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-dvh flex-col bg-card">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-player px-3 text-player-foreground sm:px-4">
          <Link href="/dashboard" aria-label="Về trang Tổng quan" className="shrink-0">
            <Logo inverted className="origin-left scale-[0.8]" />
          </Link>
          <span className="hidden h-6 w-px shrink-0 bg-white/20 sm:block" />
          <Link href={`/courses/${courseId}`} className="hidden min-w-0 truncate text-sm font-medium text-white/90 hover:text-white sm:block">
            {view.info.fullname}
          </Link>
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <ProgressPopover view={view} />
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="hidden items-center gap-2 rounded-md border border-white/30 px-3 py-1.5 text-sm font-semibold hover:bg-white/10 lg:flex"
              >
                <PanelRightOpen className="size-4" /> Nội dung khóa học
              </button>
            )}
            <Link
              href={`/courses/${courseId}`}
              className="flex items-center gap-1.5 rounded-md border border-white/30 px-2.5 py-1.5 text-sm font-semibold hover:bg-white/10"
              aria-label="Thoát màn học"
            >
              <X className="size-4" /> <span className="hidden sm:inline">Thoát</span>
            </Link>
          </div>
        </header>
        <div className="flex flex-1">
          <div className="min-w-0 flex-1">{children}</div>
          <aside
            className={cn(
              "sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[360px] shrink-0 border-l bg-card xl:w-[400px]",
              open && "lg:block",
            )}
          >
            <CourseContentList view={view} currentCmid={cmid} onClose={() => setOpen(false)} />
          </aside>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
