import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backlogFor, type MoSCoW } from "@/lib/backlog";
import { cn } from "@/lib/utils";

const moscowVariant: Record<MoSCoW, "danger" | "warning" | "secondary" | "muted"> = {
  Must: "danger",
  Should: "warning",
  Could: "secondary",
  "Won't": "muted",
};

/**
 * Trang giữ chỗ cho màn hình chưa dựng. Liệt kê tính năng trong backlog của màn đó
 * để người dựng (Claude Code / Duy) biết cần làm gì. Xóa component này khi màn hình đã dựng xong.
 */
export function ScreenPlaceholder({
  screen,
  title,
  references = [],
  className,
}: {
  screen: string;
  title: string;
  references?: string[];
  className?: string;
}) {
  const items = backlogFor(screen);
  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50 p-5">
        <p className="text-sm font-semibold text-brand-700">Màn hình chưa dựng: {title}</p>
        <p className="mt-1 text-sm text-brand-700/80">
          Dựng theo backlog bên dưới (mã màn hình {screen}), dùng mock data trong src/lib/data.ts.
          {references.length > 0 && <> Tham chiếu Udemy: {references.join(", ")} trong docs/reference/udemy.</>}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Backlog {screen}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {items.map((b) => (
            <div key={b.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex shrink-0 items-center gap-2 sm:w-40">
                <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                <Badge variant={moscowVariant[b.moscow]}>{b.moscow}</Badge>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{b.feature}</p>
                <p className="text-sm text-muted-foreground">{b.description}</p>
                {b.api && b.api !== "-" && <p className="mt-1 font-mono text-xs break-words text-brand-600">{b.api}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
