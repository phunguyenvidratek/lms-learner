"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Award, Bell, BookOpen, CheckCheck, ClipboardCheck, Megaphone, MessageCircle, UserPlus } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useLearning } from "@/lib/store/learning-store";
import { useNow } from "@/lib/use-now";
import { cn, formatDateTime, formatRelative } from "@/lib/utils";
import type { Notification } from "@/types/moodle";

function iconFor(n: Notification) {
  if (n.component === "mod_quiz") return ClipboardCheck;
  if (n.component === "core_completion") return Award;
  if (n.component === "core_course") return BookOpen;
  if (n.component === "enrol_cohort") return UserPlus;
  if (n.component === "mod_forum") return n.subject.includes("Hỏi đáp") ? MessageCircle : Megaphone;
  return Bell;
}

/** NOTI-01 (danh sách, đã đọc/chưa đọc), NOTI-02 (đánh dấu đã đọc), NOTI-03 (bấm đi đúng trang) */
export function NotificationsView() {
  const { state, unread, actions } = useLearning();
  const router = useRouter();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const all = [...(state?.notifications ?? [])].sort((a, b) => b.timecreated - a.timecreated);
  const list = tab === "unread" ? all.filter((n) => !n.read) : all;
  const now = useNow();
  const groups = [
    { title: "Mới", items: list.filter((n) => now - n.timecreated < 86400 * 3) },
    { title: "Trước đó", items: list.filter((n) => now - n.timecreated >= 86400 * 3) },
  ].filter((g) => g.items.length);

  const open = (n: Notification) => {
    actions.markRead(n.id);
    if (n.contexturl) router.push(n.contexturl);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                tab === t ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
              )}
            >
              {t === "all" ? "Tất cả" : `Chưa đọc (${unread})`}
            </button>
          ))}
        </div>
        <Button variant="ghost" onClick={actions.markAllRead} disabled={!unread}>
          <CheckCheck /> Đánh dấu tất cả đã đọc
        </Button>
      </div>

      {!groups.length ? (
        <EmptyState
          icon={Bell}
          title={tab === "unread" ? "Bạn đã đọc hết thông báo" : "Chưa có thông báo"}
          description="Thông báo về khóa học, bài kiểm tra và chứng nhận sẽ hiển thị ở đây."
        />
      ) : (
        groups.map((g) => (
          <section key={g.title}>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{g.title}</h2>
            <ul className="divide-y overflow-hidden rounded-xl border bg-card">
              {g.items.map((n) => {
                const Icon = iconFor(n);
                return (
                  <li key={n.id} className={cn("relative flex gap-4 p-4 transition-colors hover:bg-muted/50", !n.read && "bg-brand-50/60")}>
                    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", n.read ? "bg-muted text-muted-foreground" : "bg-brand-100 text-brand-700")}>
                      <Icon className="size-5" />
                    </span>
                    <button type="button" onClick={() => open(n)} className="min-w-0 flex-1 text-left after:absolute after:inset-0">
                      <p className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.subject}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.smallmessage}</p>
                      <p className="mt-1 text-xs text-muted-foreground" title={formatDateTime(n.timecreated)}>
                        {formatRelative(n.timecreated)}
                      </p>
                    </button>
                    <div className="relative z-10 flex shrink-0 flex-col items-end gap-2">
                      {!n.read && (
                        <>
                          <span className="size-2.5 rounded-full bg-primary" aria-label="Chưa đọc" />
                          <button type="button" onClick={() => actions.markRead(n.id)} className="hidden text-xs font-medium text-primary hover:underline sm:block">
                            Đánh dấu đã đọc
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
