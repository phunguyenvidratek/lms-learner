"use client";

/** Admin SHELL-03 (nhóm việc của Phòng Đào tạo), SHELL-04 (sidebar trái thu gọn được, mục đang mở tô sáng) */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNav, isActive } from "./nav";

export function AdminSidebarNav({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-4 overflow-y-auto" aria-label="Menu quản trị">
      {adminNav.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-1">
          {group.label &&
            (collapsed ? (
              <span className="mx-auto my-1 h-px w-6 bg-border" aria-hidden />
            ) : (
              <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{group.label}</p>
            ))}
          {group.items.map((item) => {
            const active = isActive(item, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebarFooter({ collapsed, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
  return (
    <div className="flex flex-col gap-1 border-t pt-3">
      <Link
        href="/dashboard"
        target="_blank"
        title={collapsed ? "Mở cổng học viên" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent",
          collapsed && "justify-center px-0",
        )}
      >
        <GraduationCap className="size-[18px]" />
        {!collapsed && "Mở cổng học viên"}
      </Link>
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          title={collapsed ? "Mở rộng menu" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronsLeft className={cn("size-[18px] transition-transform", collapsed && "rotate-180")} />
          {!collapsed && "Thu gọn"}
        </button>
      )}
    </div>
  );
}

/** Logo chữ tạm (cùng kiểu learner). Bản thật: logo đặt ở Boost Union > Look > Logo. */
function Logo() {
  return (
    <div className="flex flex-col leading-none select-none">
      <span className="text-2xl font-extrabold tracking-tight text-brand-600">VIGO</span>
      <span className="mt-0.5 text-[9px] font-semibold tracking-[0.25em] text-brand-600">SCIENCE FOR CARE</span>
    </div>
  );
}

export function AdminBrand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/admin" className={cn("flex h-12 items-center gap-2 px-3", collapsed && "justify-center px-0")}>
      {collapsed ? (
        <span className="text-xl font-extrabold text-brand-600">V</span>
      ) : (
        <>
          <Logo />
          <span className="hidden rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700 sm:inline">Quản trị</span>
        </>
      )}
    </Link>
  );
}

export function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col gap-5 border-r bg-sidebar p-3 transition-[width] duration-200 lg:flex print:hidden",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <AdminBrand collapsed={collapsed} />
      <AdminSidebarNav collapsed={collapsed} />
      <AdminSidebarFooter collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}
