import { CheckCircle2, Circle, Lock, XCircle } from "lucide-react";
import { formatClock } from "@/lib/utils";
import type { CourseModule } from "@/types/moodle";
import { cn } from "@/lib/utils";

/** CDET-03: trạng thái hoàn thành của 1 bài. state 3 = đã làm nhưng chưa đạt. */
export function ModuleStatusIcon({ module, className }: { module: CourseModule; className?: string }) {
  if (!module.uservisible) return <Lock className={cn("size-4 text-muted-foreground", className)} aria-label="Chưa mở" />;
  const st = module.completiondata?.state;
  if (st === 1 || st === 2) return <CheckCircle2 className={cn("size-4 text-success", className)} aria-label="Đã hoàn thành" />;
  if (st === 3) return <XCircle className={cn("size-4 text-warning", className)} aria-label="Chưa đạt" />;
  if (!module.completiondata) return null;
  return <Circle className={cn("size-4 text-input", className)} aria-label="Chưa hoàn thành" />;
}

/** Thời lượng hiển thị: video dạng 14:07, bài đọc dạng "6 phút đọc" */
export function moduleDurationLabel(m: CourseModule): string | null {
  if (!m.customdata_duration) return null;
  if (m.modname === "drivevideo") return formatClock(m.customdata_duration);
  return `${Math.round(m.customdata_duration / 60)} phút đọc`;
}
