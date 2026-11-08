/**
 * Bảng và thẻ số liệu dùng chung của admin. Bảng cuộn ngang trong khung riêng trên màn hẹp,
 * trang không bị cuộn ngang (SHELL-03 learner, Admin SHELL-01).
 */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function TableWrap({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("overflow-x-auto rounded-xl border bg-card shadow-xs", className)}>{children}</div>;
}

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table className={cn("w-full border-collapse text-sm", className)} {...props} />;
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn("border-b bg-muted/60 px-4 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-muted-foreground", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("border-b px-4 py-3 align-middle", className)} {...props} />;
}

export function Tr({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("last:[&>td]:border-b-0 hover:bg-muted/30", className)} {...props} />;
}

export function StatCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
  tone = "brand",
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "brand" | "success" | "warning" | "muted";
}) {
  const toneClass = {
    brand: "bg-brand-50 text-brand-600",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", toneClass)}>
            <Icon className="size-[18px]" />
          </span>
        )}
      </div>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {href && (
        <span className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
          Xem báo cáo <ArrowUpRight className="size-3.5" />
        </span>
      )}
    </>
  );
  const cls = "block rounded-xl border bg-card p-4 shadow-xs";
  return href ? (
    <Link href={href} className={cn(cls, "transition-shadow hover:shadow-md")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** Thanh % nhỏ có màu trạng thái (Admin RPT-03, MYC-04) */
export function PercentBar({ value, className }: { value: number; className?: string }) {
  const tone = value >= 100 ? "bg-success" : value > 0 ? "bg-primary" : "bg-muted-foreground/30";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
      <span className="w-9 text-right text-xs font-medium tabular-nums">{value}%</span>
    </div>
  );
}

/** Ô tìm kiếm có icon */
export function SearchBox({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={cn(
        "h-10 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-72",
        className,
      )}
    />
  );
}

/** Tải dữ liệu bảng thành file CSV (nút Xuất của báo cáo, mở được bằng Excel) */
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
