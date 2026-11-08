"use client";

/**
 * Khối dựng form admin theo cơ chế moodleform: fieldset thu gọn được (Mở rộng tất cả),
 * dòng field (nhãn trái, ô nhập phải), "Hiện thêm" cho field Advanced, thanh nút Lưu cố định (Admin ACT-05).
 * Chỉ đổi trình bày, tên field giữ như Moodle (ghi trong prop name).
 */
import { useId, useState } from "react";
import { ChevronDown, CircleAlert, CircleHelp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  badge,
  id,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  badge?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const contentId = useId();
  const toggle = () => {
    setInner(!open);
    onOpenChange?.(!open);
  };
  return (
    <section id={id} className={cn("scroll-mt-24 rounded-xl border bg-card shadow-xs", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <ChevronDown className={cn("size-5 shrink-0 text-muted-foreground transition-transform", !open && "-rotate-90")} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 font-semibold">
            {title}
            {badge}
          </span>
          {description && <span className="mt-0.5 block text-sm font-normal text-muted-foreground">{description}</span>}
        </span>
      </button>
      {open && (
        <div id={contentId} className="space-y-5 border-t px-5 py-5">
          {children}
        </div>
      )}
    </section>
  );
}

export function Field({
  label,
  required,
  help,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  help?: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5 md:grid-cols-[220px_1fr] md:gap-6", className)}>
      <div className="flex items-start gap-1.5 md:pt-2">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {required && (
          <span className="mt-0.5 text-destructive" title="Bắt buộc">
            <CircleAlert className="size-3.5" aria-label="Bắt buộc" />
          </span>
        )}
        {help && (
          <Tooltip>
            <TooltipTrigger type="button" className="mt-0.5 text-muted-foreground" aria-label={`Giải thích: ${label}`}>
              <CircleHelp className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">{help}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="min-w-0 space-y-1">
        {children}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    </div>
  );
}

const control =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60";

export function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(control, "h-10 pr-8", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-24", className)} {...props} />;
}

export function CheckRow({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-2.5">
      <Checkbox id={id} checked={checked} disabled={disabled} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <label htmlFor={id} className="text-sm">
        <span className={cn(disabled && "text-muted-foreground")}>{label}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </label>
    </div>
  );
}

/** "Hiện thêm" của moodleform: field đánh dấu Advanced ẩn tới khi bấm */
export function ShowMore({ children, count }: { children: React.ReactNode; count?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-5">
      {open && children}
      <button type="button" onClick={() => setOpen(!open)} className="text-sm font-medium text-primary hover:underline" aria-expanded={open}>
        {open ? "Ẩn bớt" : `Hiện thêm${count ? ` (${count} mục)` : ""}`}
      </button>
    </div>
  );
}

/** Ô ngày giờ có ô Bật như date_time_selector của Moodle */
export function DateTimeField({
  value,
  onChange,
  id,
}: {
  /** giây, 0 = tắt */
  value: number;
  onChange: (v: number) => void;
  id?: string;
}) {
  const enabled = value > 0;
  const local = enabled ? toLocalInput(value) : "";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        id={id}
        type="datetime-local"
        className={cn(control, "h-10 w-auto")}
        value={local}
        disabled={!enabled}
        onChange={(e) => onChange(Math.floor(new Date(e.target.value).getTime() / 1000) || value)}
      />
      <CheckRow
        checked={enabled}
        onChange={(v) => onChange(v ? defaultTime() : 0)}
        label="Bật"
      />
    </div>
  );
}

function defaultTime() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(17, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

function toLocalInput(ts: number) {
  const d = new Date(ts * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Ô thời lượng (duration) của Moodle: số + đơn vị, có ô Bật */
export function DurationField({ value, onChange, id }: { value: number; onChange: (v: number) => void; id?: string }) {
  const enabled = value > 0;
  const unit = value && value % 3600 === 0 ? 3600 : 60;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        id={id}
        type="number"
        min={1}
        className={cn(control, "h-10 w-24")}
        value={enabled ? value / unit : ""}
        disabled={!enabled}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value)) * unit)}
      />
      <NativeSelect className="w-28" value={unit} disabled={!enabled} onChange={(e) => onChange((value / unit) * Number(e.target.value))}>
        <option value={60}>phút</option>
        <option value={3600}>giờ</option>
      </NativeSelect>
      <CheckRow checked={enabled} onChange={(v) => onChange(v ? 900 : 0)} label="Bật" />
    </div>
  );
}

/** Admin ACT-05: thanh nút Lưu, Hủy cố định đáy màn hình */
export function StickySaveBar({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t bg-card/95 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-end gap-2">
        {note && <p className="mr-auto text-sm text-muted-foreground">{note}</p>}
        {children}
      </div>
    </div>
  );
}

/** Nút "Mở rộng tất cả" / "Thu gọn tất cả" của moodleform */
export function ExpandAll({ expanded, onChange }: { expanded: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!expanded)} className="text-sm font-medium text-primary hover:underline">
      {expanded ? "Thu gọn tất cả" : "Mở rộng tất cả"}
    </button>
  );
}

/** Ghi chú nhóm field đã tắt ở cấp site (Admin ACT-03), để dev biết vì sao form không có nhóm đó */
export function DisabledGroupsNote({ groups }: { groups: string[] }) {
  return (
    <p className="rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
      Không hiện vì đã tắt ở cấp hệ thống: {groups.join(", ")}.
    </p>
  );
}
