"use client";

/** Admin DASH-04: lịch tháng thu nhỏ ở cột phải, chấm màu theo loại sự kiện, kèm sự kiện sắp tới */
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDay, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/moodle";
import { EVENT_TYPE } from "../calendar/event-types";

const WD = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function MiniCalendar({ events, now }: { events: CalendarEvent[]; now: number }) {
  const today = new Date(now * 1000);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => i - offset + 1);
  const eventsOn = (d: number) =>
    events.filter((e) => {
      const t = new Date(e.timestart * 1000);
      return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
    });
  const upcoming = events.filter((e) => e.timestart >= now).sort((a, b) => a.timestart - b.timestart).slice(0, 3);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">
          Tháng {m + 1}/{y}
        </p>
        <div className="flex">
          <Button variant="ghost" size="icon" className="size-8" aria-label="Tháng trước" onClick={() => setCursor(new Date(y, m - 1, 1))}>
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Tháng sau" onClick={() => setCursor(new Date(y, m + 1, 1))}>
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
        {WD.map((d) => (
          <span key={d} className="pb-1 font-medium text-muted-foreground">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d < 1 || d > days) return <span key={i} />;
          const evs = eventsOn(d);
          const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
          return (
            <span key={i} className="flex flex-col items-center gap-0.5 py-0.5" title={evs.map((e) => e.name).join(", ") || undefined}>
              <span className={cn("flex size-7 items-center justify-center rounded-full", isToday && "bg-primary font-semibold text-primary-foreground")}>
                {d}
              </span>
              <span className="flex h-1.5 gap-0.5">
                {evs.slice(0, 3).map((e) => (
                  <span key={e.id} className={cn("size-1.5 rounded-full", EVENT_TYPE[e.eventtype].dot)} />
                ))}
              </span>
            </span>
          );
        })}
      </div>
      <div className="mt-4 space-y-3 border-t pt-3">
        {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Không có sự kiện sắp tới.</p>}
        {upcoming.map((e) => (
          <div key={e.id} className="flex gap-2.5">
            <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", EVENT_TYPE[e.eventtype].dot)} />
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium">{e.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDay(e.timestart)}, {formatTime(e.timestart)}
              </p>
            </div>
          </div>
        ))}
        <Link href="/admin/calendar" className="block text-sm font-medium text-primary hover:underline">
          Mở lịch đầy đủ
        </Link>
      </div>
    </div>
  );
}
