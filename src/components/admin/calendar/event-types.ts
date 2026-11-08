/** Admin NOTI-01: màu theo loại sự kiện (dùng token, không hard-code mã màu) */
import type { CalendarEvent } from "@/types/moodle";

export const EVENT_TYPE: Record<CalendarEvent["eventtype"], { label: string; dot: string; chip: string }> = {
  site: { label: "Buổi đào tạo", dot: "bg-primary", chip: "bg-brand-50 text-brand-700 border-l-primary" },
  course: { label: "Sự kiện khóa học", dot: "bg-success", chip: "bg-success-soft text-success border-l-success" },
  close: { label: "Hạn bài kiểm tra", dot: "bg-warning", chip: "bg-warning-soft text-warning border-l-warning" },
  open: { label: "Mở bài kiểm tra", dot: "bg-brand-300", chip: "bg-brand-50 text-brand-700 border-l-brand-300" },
  user: { label: "Sự kiện cá nhân", dot: "bg-muted-foreground", chip: "bg-muted text-muted-foreground border-l-muted-foreground" },
};
