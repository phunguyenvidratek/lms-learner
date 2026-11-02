import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { QuizState } from "@/lib/learning";

export const QUIZ_STATE: Record<QuizState, { text: string; variant: "success" | "secondary" | "muted" | "danger" | "warning" }> = {
  notstarted: { text: "Chưa làm", variant: "muted" },
  inprogress: { text: "Đang làm", variant: "secondary" },
  passed: { text: "Đạt", variant: "success" },
  failed: { text: "Chưa đạt", variant: "warning" },
  exhausted: { text: "Hết lượt", variant: "danger" },
  locked: { text: "Chưa mở", variant: "muted" },
};

/** TEST-01: trạng thái bài kiểm tra */
export function QuizStateBadge({ state }: { state: QuizState }) {
  const s = QUIZ_STATE[state];
  return (
    <Badge variant={s.variant}>
      {state === "locked" && <Lock />}
      {s.text}
    </Badge>
  );
}
