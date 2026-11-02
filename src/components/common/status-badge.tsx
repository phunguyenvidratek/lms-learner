import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CourseStatus } from "@/lib/learning";

const MAP: Record<CourseStatus, { text: string; variant: "success" | "secondary" | "muted" }> = {
  completed: { text: "Hoàn thành", variant: "success" },
  inprogress: { text: "Đang học", variant: "secondary" },
  notstarted: { text: "Chưa bắt đầu", variant: "muted" },
};

/** INT-03: badge trạng thái khóa dùng chung */
export function CourseStatusBadge({ status, locked, className }: { status: CourseStatus; locked?: boolean; className?: string }) {
  if (locked)
    return (
      <Badge variant="muted" className={className}>
        <Lock /> Chưa mở
      </Badge>
    );
  const s = MAP[status];
  return (
    <Badge variant={s.variant} className={className}>
      {s.text}
    </Badge>
  );
}
