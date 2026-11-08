/**
 * Admin SHELL-01 (độ rộng: 1200px cho trang thường, full width cho báo cáo),
 * SHELL-07 (đầu trang thống nhất: breadcrumb, tiêu đề, mô tả ngắn, nút chính bên phải).
 */
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function AdminPage({ full, className, children }: { full?: boolean; className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full", full ? "max-w-none" : "max-w-[1200px]", className)}>{children}</div>;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Đường dẫn" className={cn("mb-2", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
            {c.href ? (
              <Link href={c.href} className="hover:text-primary hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  badge,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {badge}
          </div>
          {description && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/** Tiêu đề khu vực trong trang (dưới tab khóa): tiêu đề, mô tả, nút chính bên phải */
export function SectionHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="mt-0.5 max-w-3xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
