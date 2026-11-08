"use client";

/**
 * Admin NOTI-01 (lịch tháng: tên sự kiện xuống 2 dòng, màu theo loại), NOTI-02 (đăng thông báo nhanh),
 * HOME-03 (thông báo dạng thẻ: tiêu đề, ngày, 2 dòng trích đoạn, bấm đọc tiếp).
 * Moodle: /calendar/view.php?view=month, /mod/forum/view.php?f= (Site announcements), /mod/forum/post.php?forum=
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Megaphone, Pin, Plus } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { MoodleHtml } from "@/components/common/moodle-html";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ADMIN_USER_ID } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { useNow } from "@/lib/use-now";
import { cn, formatDate, formatDateTime, formatTime, stripHtml } from "@/lib/utils";
import type { Announcement, CalendarEvent } from "@/types/moodle";
import type { AdminAnnouncement } from "@/types/moodle-admin";
import { CheckRow, DateTimeField, Field, FileButton, FormSection, StickySaveBar, Textarea } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";
import { EVENT_TYPE } from "./event-types";

const WD = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const now = useNow();
  const today = new Date(now * 1000);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [type, setType] = useState<"all" | CalendarEvent["eventtype"]>("all");
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => i - offset + 1);
  const shown = events.filter((e) => type === "all" || e.eventtype === type);
  const on = (d: number) =>
    shown
      .filter((e) => {
        const t = new Date(e.timestart * 1000);
        return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
      })
      .sort((a, b) => a.timestart - b.timestart);
  const monthEvents = shown.filter((e) => {
    const t = new Date(e.timestart * 1000);
    return t.getFullYear() === y && t.getMonth() === m;
  });
  const types = [...new Set(events.map((e) => e.eventtype))];

  return (
    <AdminPage>
      <AdminPageHeader title="Lịch" description="Buổi đào tạo, hạn hoàn thành khóa và hạn bài kiểm tra." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Tháng trước" onClick={() => setCursor(new Date(y, m - 1, 1))}>
          <ChevronLeft />
        </Button>
        <p className="min-w-36 text-center text-lg font-semibold">
          Tháng {m + 1}/{y}
        </p>
        <Button variant="outline" size="icon" aria-label="Tháng sau" onClick={() => setCursor(new Date(y, m + 1, 1))}>
          <ChevronRight />
        </Button>
        <Button variant="ghost" onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}>
          Hôm nay
        </Button>
        <div className="ml-auto flex flex-wrap gap-1.5" role="group" aria-label="Lọc theo loại sự kiện">
          <button type="button" onClick={() => setType("all")} aria-pressed={type === "all"} className={cn("rounded-full border px-3 py-1 text-xs font-medium", type === "all" && "border-primary bg-brand-50 text-brand-700")}>
            Tất cả
          </button>
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", type === t && "border-primary bg-brand-50 text-brand-700")}
            >
              <span className={cn("size-2 rounded-full", EVENT_TYPE[t].dot)} /> {EVENT_TYPE[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-xs md:block">
        <div className="grid grid-cols-7 border-b bg-muted/60">
          {WD.map((d) => (
            <p key={d} className="px-2 py-2 text-xs font-semibold text-muted-foreground">
              {d}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const valid = d >= 1 && d <= days;
            const isToday = valid && d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
            return (
              <div key={i} className={cn("min-h-28 border-r border-b p-1.5 [&:nth-child(7n)]:border-r-0", !valid && "bg-muted/30")}>
                {valid && (
                  <>
                    <span className={cn("mb-1 flex size-6 items-center justify-center rounded-full text-xs", isToday && "bg-primary font-semibold text-primary-foreground")}>{d}</span>
                    <div className="space-y-1">
                      {on(d).map((e) => (
                        <p key={e.id} title={`${formatTime(e.timestart)} ${e.name}`} className={cn("line-clamp-2 rounded border-l-2 px-1.5 py-0.5 text-[11px] leading-snug font-medium", EVENT_TYPE[e.eventtype].chip)}>
                          {e.name}
                        </p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-semibold md:sr-only">Sự kiện trong tháng</h2>
        {monthEvents.length === 0 ? (
          <EmptyState icon={CalendarDays} title="Tháng này chưa có sự kiện" />
        ) : (
          <ul className="space-y-2 md:hidden">
            {monthEvents
              .sort((a, b) => a.timestart - b.timestart)
              .map((e) => (
                <li key={e.id} className={cn("rounded-lg border-l-4 bg-card p-3 shadow-xs", EVENT_TYPE[e.eventtype].chip)}>
                  <p className="text-sm font-semibold">{e.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs">
                    <Clock className="size-3" /> {formatDateTime(e.timestart)}
                  </p>
                  {e.location && (
                    <p className="flex items-center gap-1 text-xs">
                      <MapPin className="size-3" /> {e.location}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </AdminPage>
  );
}

export function AnnouncementsView({ announcements }: { announcements: Announcement[] }) {
  const { state } = useAdmin();
  const now = useNow();
  const [openId, setOpenId] = useState<number | null>(null);
  const all = ([...(state?.announcements ?? []), ...announcements] as AdminAnnouncement[]).sort(
    (a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.created - a.created,
  );
  return (
    <AdminPage>
      <AdminPageHeader
        title="Thông báo chung"
        description="Tin gửi tới mọi nhân viên, hiện trên Tổng quan của học viên."
        actions={
          <Button asChild>
            <Link href="/admin/announcements/new">
              <Plus /> Đăng thông báo
            </Link>
          </Button>
        }
      />
      {all.length === 0 ? (
        <EmptyState icon={Megaphone} title="Chưa có thông báo" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {all.map((a) => {
            const scheduled = (a.timestart ?? 0) > now;
            const open = openId === a.id;
            return (
              <article key={a.id} id={`tb-${a.id}`} className="scroll-mt-24 rounded-xl border bg-card p-5 shadow-xs">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(a.created)}</span>
                  <span>·</span>
                  <span>{a.userfullname}</span>
                  {a.pinned && (
                    <Badge variant="secondary">
                      <Pin /> Ghim
                    </Badge>
                  )}
                  {scheduled && <Badge variant="warning">Hẹn hiển thị {formatDateTime(a.timestart!)}</Badge>}
                </div>
                <h2 className="font-semibold">{a.name}</h2>
                {open ? <MoodleHtml html={a.message} className="mt-2 text-sm" /> : <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{stripHtml(a.message)}</p>}
                <button type="button" className="mt-2 text-sm font-medium text-primary hover:underline" onClick={() => setOpenId(open ? null : a.id)} aria-expanded={open}>
                  {open ? "Thu gọn" : "Đọc tiếp"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}

export function AnnouncementForm() {
  const router = useRouter();
  const { ds, actions } = useAdmin();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [timestart, setTimestart] = useState(0);
  const [timeend, setTimeend] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [subscribe, setSubscribe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const me = ds.users.find((u) => u.id === ADMIN_USER_ID);

  const save = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nhập tiêu đề.";
    if (!message.trim()) e.message = "Nhập nội dung.";
    if (when === "later" && !timestart) e.timestart = "Chọn thời điểm hiển thị.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const now = Math.floor(Date.now() / 1000);
    actions.postAnnouncement({
      id: newId(),
      name: name.trim(),
      message: message
        .trim()
        .split(/\n+/)
        .map((p) => `<p>${p}</p>`)
        .join(""),
      created: now,
      userfullname: me?.fullname ?? "Phòng Đào tạo VIGO",
      timestart: when === "later" ? timestart : 0,
      timeend,
      pinned,
      mailnow: when === "now",
    });
    router.push("/admin/announcements");
  };

  return (
    <AdminPage>
      <AdminPageHeader breadcrumbs={[{ label: "Thông báo chung", href: "/admin/announcements" }, { label: "Đăng thông báo" }]} title="Đăng thông báo" className="mb-4" />
      <form
        className="space-y-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <FormSection title="Nội dung" defaultOpen>
          <Field label="Tiêu đề" required htmlFor="a-name" error={errors.name}>
            <Input id="a-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Nội dung" required htmlFor="a-msg" error={errors.message}>
            <Textarea id="a-msg" rows={8} value={message} onChange={(e) => setMessage(e.target.value)} />
          </Field>
          <Field label="Gửi" error={errors.timestart}>
            <RadioGroup value={when} onValueChange={(v) => setWhen(v as "now" | "later")} className="gap-2">
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="now" /> Gửi ngay (email không chờ 30 phút)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="later" /> Hẹn giờ hiển thị
              </label>
            </RadioGroup>
            {when === "later" && (
              <div className="mt-2">
                <DateTimeField value={timestart} onChange={setTimestart} />
              </div>
            )}
          </Field>
        </FormSection>
        <FormSection title="Nâng cao">
          <Field label="Hiển thị đến">
            <DateTimeField value={timeend} onChange={setTimeend} />
          </Field>
          <Field label="Ghim">
            <CheckRow checked={pinned} onChange={setPinned} label="Ghim lên đầu danh sách" />
          </Field>
          <Field label="Theo dõi thảo luận">
            <CheckRow checked={subscribe} onChange={setSubscribe} label="Nhận email khi có trả lời" />
          </Field>
          <Field label="Tệp đính kèm" htmlFor="a-file">
            <FileButton id="a-file" onFile={() => {}} />
          </Field>
        </FormSection>
        <StickySaveBar>
          <Button variant="ghost" asChild>
            <Link href="/admin/announcements">Hủy</Link>
          </Button>
          <Button type="submit">Đăng thông báo</Button>
        </StickySaveBar>
      </form>
    </AdminPage>
  );
}
