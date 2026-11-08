"use client";

/**
 * Admin ACT-04 (nhóm Điều kiện truy cập mở sẵn), ACT-07 (nút nhanh "Mở sau bài trước").
 * Moodle: core_availability (Restrict access). Lưu JSON availability chuẩn: {"op":"&","c":[...],"showc":[...]}.
 * Loại điều kiện giữ như Moodle: Hoàn thành bài học, Ngày, Điểm, Hồ sơ người dùng.
 */
import { CalendarClock, CheckCircle2, ListPlus, Plus, Star, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { AvailabilityCondition } from "@/lib/admin";
import type { AdminModule } from "@/types/moodle-admin";
import { DateTimeField, NativeSelect } from "../common/form";

export type EditableCondition = AvailabilityCondition;
type ProfileCondition = Required<Pick<AvailabilityCondition, "sf" | "op" | "v">>;

export function AvailabilityEditor({
  conds,
  onChange,
  op,
  onOpChange,
  candidates,
  previous,
}: {
  conds: EditableCondition[];
  onChange: (c: EditableCondition[]) => void;
  op: "&" | "|";
  onOpChange: (op: "&" | "|") => void;
  /** Bài trong khóa có thể chọn làm điều kiện */
  candidates: AdminModule[];
  /** Bài liền trước (cho nút Mở sau bài trước) */
  previous?: AdminModule;
}) {
  const quizzes = candidates.filter((m) => m.modname === "quiz");
  const tracked = candidates.filter((m) => m.completion > 0);
  const set = (i: number, patch: Partial<EditableCondition>) => onChange(conds.map((c, j) => (j === i ? ({ ...c, ...patch } as EditableCondition) : c)));
  const hasPrev = !!previous && conds.some((c) => c.type === "completion" && c.cm === previous.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {previous && (
          <Button
            type="button"
            variant={hasPrev ? "secondary" : "outline-primary"}
            disabled={hasPrev}
            onClick={() => onChange([...conds, { type: "completion", cm: previous.id, e: 1 }])}
          >
            <Star /> {hasPrev ? "Đã khóa tới khi xong bài trước" : "Mở sau bài trước"}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline">
              <Plus /> Thêm điều kiện
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem disabled={!tracked.length} onSelect={() => onChange([...conds, { type: "completion", cm: tracked[0]?.id, e: 1 }])}>
              <CheckCircle2 /> Hoàn thành bài học
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChange([...conds, { type: "date", d: ">=", t: Math.floor(Date.now() / 1000) + 7 * 86400 }])}>
              <CalendarClock /> Ngày
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!quizzes.length} onSelect={() => onChange([...conds, { type: "grade", cm: quizzes[0]?.id, min: 80 }])}>
              <ListPlus /> Điểm
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChange([...conds, { type: "profile", sf: "department", op: "isequalto", v: "" }])}>
              <UserRound /> Hồ sơ người dùng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {previous && !hasPrev && (
        <p className="text-xs text-muted-foreground">
          Bài trước: <span className="font-medium text-foreground">{previous.name}</span>. Học viên phải hoàn thành bài đó mới mở được bài này.
        </p>
      )}

      {conds.length === 0 ? (
        <p className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">Chưa có điều kiện. Mọi học viên trong khóa mở được bài này.</p>
      ) : (
        <div className="space-y-3">
          {conds.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              Học viên phải thỏa
              <NativeSelect className="w-auto" value={op} onChange={(e) => onOpChange(e.target.value as "&" | "|")} aria-label="Cách kết hợp điều kiện">
                <option value="&">tất cả</option>
                <option value="|">một trong</option>
              </NativeSelect>
              các điều kiện sau
            </div>
          )}
          {conds.map((c, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-3">
              {c.type === "completion" && (
                <>
                  <span className="text-sm font-medium">Hoàn thành bài</span>
                  <NativeSelect className="w-auto min-w-48 flex-1" value={c.cm} onChange={(e) => set(i, { cm: Number(e.target.value) })} aria-label="Bài cần hoàn thành">
                    {tracked.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </NativeSelect>
                  <NativeSelect className="w-auto" value={c.e ?? 1} onChange={(e) => set(i, { e: Number(e.target.value) as 0 | 1 })} aria-label="Trạng thái">
                    <option value={1}>phải hoàn thành</option>
                    <option value={0}>chưa hoàn thành</option>
                  </NativeSelect>
                </>
              )}
              {c.type === "grade" && (
                <>
                  <span className="text-sm font-medium">Điểm</span>
                  <NativeSelect className="w-auto min-w-48 flex-1" value={c.cm} onChange={(e) => set(i, { cm: Number(e.target.value) })} aria-label="Bài kiểm tra">
                    {quizzes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </NativeSelect>
                  <span className="text-sm">từ</span>
                  <Input type="number" min={0} max={100} className="w-20" value={c.min ?? 0} onChange={(e) => set(i, { min: Number(e.target.value) })} aria-label="Điểm tối thiểu (%)" />
                  <span className="text-sm">%</span>
                </>
              )}
              {c.type === "date" && (
                <>
                  <NativeSelect className="w-auto" value={c.d ?? ">="} onChange={(e) => set(i, { d: e.target.value as ">=" | "<" })} aria-label="Từ hoặc trước">
                    <option value=">=">Từ ngày</option>
                    <option value="<">Trước ngày</option>
                  </NativeSelect>
                  <DateTimeField value={c.t ?? 0} onChange={(t) => set(i, { t })} />
                </>
              )}
              {c.type === "profile" && (
                <>
                  <NativeSelect className="w-auto" value={c.sf ?? "department"} onChange={(e) => set(i, { sf: e.target.value as ProfileCondition["sf"] })} aria-label="Trường hồ sơ">
                    <option value="department">Chức danh</option>
                    <option value="institution">Đơn vị</option>
                    <option value="city">Thành phố</option>
                    <option value="email">Email</option>
                  </NativeSelect>
                  <NativeSelect className="w-auto" value={c.op ?? "isequalto"} onChange={(e) => set(i, { op: e.target.value as ProfileCondition["op"] })} aria-label="Phép so sánh">
                    <option value="isequalto">là</option>
                    <option value="contains">có chứa</option>
                    <option value="startswith">bắt đầu bằng</option>
                  </NativeSelect>
                  <Input className="w-auto flex-1" value={c.v ?? ""} onChange={(e) => set(i, { v: e.target.value })} aria-label="Giá trị" />
                </>
              )}
              <Button type="button" variant="ghost" size="icon" className="ml-auto size-8" aria-label="Xóa điều kiện" onClick={() => onChange(conds.filter((_, j) => j !== i))}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
