"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { MoodleHtml } from "@/components/common/moodle-html";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLearning } from "@/lib/store/learning-store";
import { cn, formatLongDate, formatTime } from "@/lib/utils";
import type { CalendarEvent } from "@/types/moodle";

const TYPE: Record<string, { label: string; chip: string; dot: string }> = {
  site: { label: "Lịch đào tạo", chip: "bg-brand-50 text-brand-700 border-brand-200", dot: "bg-primary" },
  close: { label: "Hạn bài kiểm tra", chip: "bg-danger-soft text-destructive border-destructive/20", dot: "bg-destructive" },
  course: { label: "Sự kiện khóa học", chip: "bg-success-soft text-success border-success/20", dot: "bg-success" },
};
const typeOf = (e: CalendarEvent) => TYPE[e.eventtype] ?? TYPE.course;
const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function eventTime(e: CalendarEvent) {
  return e.timeduration ? `${formatTime(e.timestart)} - ${formatTime(e.timestart + e.timeduration)}` : formatTime(e.timestart);
}

/** CAL-01 (lịch tháng), CAL-02 (sự kiện theo ngày và chi tiết) */
export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const { quizzes } = useLearning();
  const today = new Date();
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(() => dayKey(today));
  const [detail, setDetail] = useState<CalendarEvent | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of [...events].sort((a, b) => a.timestart - b.timestart)) {
      const k = dayKey(new Date(e.timestart * 1000));
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return map;
  }, [events]);

  const cells = useMemo(() => {
    const first = new Date(month);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);
    const weeks = Math.ceil((offset + new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()) / 7);
    return Array.from({ length: weeks * 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }, [month]);

  const selectedDate = cells.find((d) => dayKey(d) === selected) ?? new Date(selected.split("-").map(Number)[0], selected.split("-").map(Number)[1], selected.split("-").map(Number)[2]);
  const dayEvents = byDay.get(selected) ?? [];
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const quizInfo = detail?.instance ? quizzes.find((q) => q.module.id === detail.instance) : undefined;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <h2 className="text-lg font-bold">
            Tháng {month.getMonth() + 1}, {month.getFullYear()}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                setSelected(dayKey(today));
              }}
            >
              Hôm nay
            </Button>
            <Button variant="ghost" size="icon" onClick={() => shift(-1)} aria-label="Tháng trước">
              <ChevronLeft />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => shift(1)} aria-label="Tháng sau">
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b bg-muted/50 text-center text-xs font-semibold text-muted-foreground">
          {WEEK.map((w) => (
            <div key={w} className="py-2">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d) => {
            const k = dayKey(d);
            const list = byDay.get(k) ?? [];
            const inMonth = d.getMonth() === month.getMonth();
            const isToday = k === dayKey(today);
            const isSel = k === selected;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(k)}
                aria-label={`${formatLongDate(d.getTime() / 1000)}, ${list.length} sự kiện`}
                aria-pressed={isSel}
                className={cn(
                  "flex min-h-14 flex-col items-stretch gap-1 border-r border-b p-1.5 text-left transition-colors last:border-r-0 sm:min-h-24 [&:nth-child(7n)]:border-r-0",
                  !inMonth && "bg-muted/30 text-muted-foreground/60",
                  isSel ? "bg-brand-50" : "hover:bg-muted/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center self-center rounded-full text-sm sm:self-start",
                    isToday && "bg-primary font-bold text-primary-foreground",
                    isSel && !isToday && "font-bold text-primary ring-1 ring-primary",
                  )}
                >
                  {d.getDate()}
                </span>
                <span className="hidden flex-col gap-1 sm:flex">
                  {list.slice(0, 2).map((e) => (
                    <span key={e.id} className={cn("truncate rounded border px-1.5 py-0.5 text-[11px] font-medium", typeOf(e).chip)}>
                      {e.eventtype === "close" ? e.name.replace("Hạn nộp: Kiểm tra ", "Hạn ") : `${e.timeduration ? formatTime(e.timestart) + " " : ""}${e.name}`}
                    </span>
                  ))}
                  {list.length > 2 && <span className="px-1 text-[11px] text-muted-foreground">+{list.length - 2} sự kiện</span>}
                </span>
                {list.length > 0 && (
                  <span className="flex justify-center gap-0.5 sm:hidden">
                    {list.slice(0, 3).map((e) => (
                      <span key={e.id} className={cn("size-1.5 rounded-full", typeOf(e).dot)} />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 border-t px-4 py-3 text-xs text-muted-foreground">
          {Object.values(TYPE).map((t) => (
            <span key={t.label} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", t.dot)} /> {t.label}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold">{formatLongDate(selectedDate.getTime() / 1000)}</h2>
        {dayEvents.length ? (
          <ul className="space-y-3">
            {dayEvents.map((e) => (
              <li key={e.id}>
                <button type="button" onClick={() => setDetail(e)} className="w-full rounded-xl border bg-card p-4 text-left transition-shadow hover:shadow-md">
                  <span className={cn("inline-block rounded border px-1.5 py-0.5 text-[11px] font-medium", typeOf(e).chip)}>{typeOf(e).label}</span>
                  <p className="mt-2 font-semibold">{e.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5" /> {eventTime(e)}
                  </p>
                  {e.location && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" /> {e.location}
                    </p>
                  )}
                  {e.coursename && <p className="mt-0.5 truncate text-sm text-muted-foreground">{e.coursename}</p>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={CalendarDays} title="Không có sự kiện" description="Chọn ngày có chấm màu trên lịch để xem lịch đào tạo và hạn bài kiểm tra." className="py-8" />
        )}
      </section>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent>
          {detail && (
            <>
              <DialogHeader>
                <span className={cn("w-fit rounded border px-1.5 py-0.5 text-[11px] font-medium", typeOf(detail).chip)}>{typeOf(detail).label}</span>
                <DialogTitle className="pr-6 leading-snug">{detail.name}</DialogTitle>
                <DialogDescription>
                  {formatLongDate(detail.timestart)} • {eventTime(detail)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                {detail.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" /> {detail.location}
                  </p>
                )}
                {detail.coursename && <p>Khóa học: {detail.coursename}</p>}
                <MoodleHtml html={detail.description} className="text-sm leading-6" />
                {quizInfo?.summary.passed && <p className="font-semibold text-success">Bạn đã đạt bài kiểm tra này.</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.instance && quizInfo && (
                  <Button asChild disabled={quizInfo.summary.state === "locked"}>
                    <Link href={`/quiz/${detail.instance}`}>Đến bài kiểm tra</Link>
                  </Button>
                )}
                {detail.courseid && (
                  <Button asChild variant="outline">
                    <Link href={`/courses/${detail.courseid}`}>Xem khóa học</Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
