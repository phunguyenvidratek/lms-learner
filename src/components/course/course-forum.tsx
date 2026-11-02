"use client";

import { Megaphone, MessageCircleQuestion } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { MoodleHtml } from "@/components/common/moodle-html";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/components/layout/app-header";
import { TRAINING_TEAM } from "@/lib/mock/data";
import { cn, formatRelative } from "@/lib/utils";
import type { ForumDiscussion } from "@/types/moodle";

function Author({ name, time }: { name: string; time: number }) {
  const team = name === TRAINING_TEAM;
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarFallback className={cn("text-xs", team && "bg-primary text-primary-foreground")}>{team ? "ĐT" : initials(name)}</AvatarFallback>
      </Avatar>
      <div className="text-sm leading-tight">
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{formatRelative(time)}</p>
      </div>
    </div>
  );
}

/** CDET-08: bài trong forum Thông báo khóa học và Hỏi đáp (chỉ xem). Dùng lại ở tab Thông báo màn học. */
export function CourseForum({ discussions, type }: { discussions: ForumDiscussion[]; type: "news" | "qanda" }) {
  const list = discussions.filter((d) => d.forumtype === type).sort((a, b) => b.created - a.created);
  if (!list.length)
    return type === "news" ? (
      <EmptyState icon={Megaphone} title="Chưa có thông báo" description="Thông báo của Phòng Đào tạo về khóa học sẽ hiển thị ở đây." />
    ) : (
      <EmptyState icon={MessageCircleQuestion} title="Chưa có câu hỏi" description="Câu hỏi của học viên và trả lời của Phòng Đào tạo sẽ hiển thị ở đây." />
    );
  return (
    <div className="space-y-4">
      {list.map((d) => (
        <article key={d.id} className="rounded-xl border bg-card p-5">
          <Author name={d.userfullname} time={d.created} />
          <h3 className="mt-4 font-semibold">{d.name}</h3>
          <MoodleHtml html={d.message} className="mt-1 text-sm leading-6 text-foreground/90" />
          {d.replies.length > 0 && (
            <div className="mt-4 space-y-4 border-l-2 border-brand-100 pl-4">
              {d.replies.map((r) => (
                <div key={r.id}>
                  <Author name={r.userfullname} time={r.created} />
                  <MoodleHtml html={r.message} className="mt-2 text-sm leading-6 text-foreground/90" />
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
