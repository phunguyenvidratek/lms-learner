"use client";

/**
 * Admin ACT-04 (nhóm Hoàn thành mở sẵn ngay sau Nội dung), ACT-06 (mặc định theo loại bài).
 * Moodle 5.1: Completion conditions = Không / Học viên tự đánh dấu / Thêm điều kiện (Xem bài, Nhận điểm, Đạt điểm...).
 */
import { useId } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ModName } from "@/types/moodle";
import { CheckRow, DateTimeField, Field } from "../common/form";

export interface CompletionValue {
  completion: 0 | 1 | 2;
  completionview: boolean;
  completionpercent: number;
  completionusegrade: boolean;
  completionpassgrade: boolean;
  completionattemptsexhausted: boolean;
  completionexpected: number;
}

export function CompletionEditor({ modname, value, onChange }: { modname: ModName; value: CompletionValue; onChange: (v: CompletionValue) => void }) {
  const id = useId();
  const set = (patch: Partial<CompletionValue>) => onChange({ ...value, ...patch });
  const graded = modname === "quiz" || modname === "assign";
  return (
    <div className="space-y-5">
      <RadioGroup value={String(value.completion)} onValueChange={(v) => set({ completion: Number(v) as 0 | 1 | 2 })} className="gap-3">
        {[
          ["0", "Không theo dõi", "Bài không tính vào tiến độ khóa."],
          ["1", "Học viên tự đánh dấu hoàn thành", "Học viên bấm nút Đánh dấu hoàn thành."],
          ["2", "Hoàn thành khi đạt điều kiện", "Hệ thống tự ghi nhận theo điều kiện bên dưới."],
        ].map(([v, label, desc]) => (
          <div key={v} className="flex items-start gap-2.5">
            <RadioGroupItem value={v} id={`${id}-${v}`} className="mt-0.5" />
            <label htmlFor={`${id}-${v}`} className="text-sm">
              <span className="font-medium">{label}</span>
              <span className="block text-xs text-muted-foreground">{desc}</span>
            </label>
          </div>
        ))}
      </RadioGroup>

      {value.completion === 2 && (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          {modname === "drivevideo" ? (
            <div className="flex flex-wrap items-center gap-2">
              <CheckRow checked={value.completionpercent > 0} onChange={(v) => set({ completionpercent: v ? 90 : 0 })} label="Xem tối thiểu" />
              <Input
                type="number"
                min={10}
                max={100}
                className="h-8 w-20"
                disabled={!value.completionpercent}
                value={value.completionpercent || ""}
                onChange={(e) => set({ completionpercent: Math.min(100, Math.max(10, Number(e.target.value))) })}
                aria-label="Phần trăm video phải xem"
              />
              <span className="text-sm">% thời lượng video</span>
            </div>
          ) : (
            <CheckRow checked={value.completionview} onChange={(v) => set({ completionview: v })} label="Xem bài" description="Học viên mở bài là hoàn thành." />
          )}
          {graded && (
            <>
              <CheckRow
                checked={value.completionusegrade}
                onChange={(v) => set({ completionusegrade: v, completionpassgrade: v && value.completionpassgrade })}
                label="Nhận điểm"
                description="Học viên có điểm ở bài này."
              />
              {value.completionusegrade && (
                <div className="ml-7 space-y-2">
                  <CheckRow
                    checked={value.completionpassgrade}
                    onChange={(v) => set({ completionpassgrade: v })}
                    label="Phải đạt điểm đạt"
                    description="Điểm đạt đặt ở nhóm Điểm."
                  />
                  {modname === "quiz" && value.completionpassgrade && (
                    <CheckRow
                      checked={value.completionattemptsexhausted}
                      onChange={(v) => set({ completionattemptsexhausted: v })}
                      label="hoặc đã dùng hết lượt làm"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {value.completion > 0 && (
        <Field label="Nhắc hạn trên Dòng thời gian" help="Hiện nhắc việc trên Dòng thời gian của học viên. Không bắt buộc hoàn thành trước ngày này.">
          <DateTimeField value={value.completionexpected} onChange={(t) => set({ completionexpected: t })} />
        </Field>
      )}
    </div>
  );
}
