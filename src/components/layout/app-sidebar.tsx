"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, LogOut, UserRound } from "lucide-react";
import { mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export function SidebarNav({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {mainNav.map((item) => (
        <NavLink key={item.href} {...item} collapsed={collapsed} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

export function SidebarFooter({ collapsed, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
  return (
    <div className="flex flex-col gap-1 border-t pt-3">
      <NavLink href="/profile" label="Hồ sơ" icon={UserRound} collapsed={collapsed} />
      <Link
        href="/login"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent",
          collapsed && "justify-center px-0",
        )}
      >
        <LogOut className="size-5" />
        {!collapsed && "Đăng xuất"}
      </Link>
      {onToggle && (
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronsLeft className={cn("size-5 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && "Thu gọn"}
        </button>
      )}
    </div>
  );
}

/** SHELL-01: sidebar desktop, thu gọn được */
export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col gap-6 border-r bg-sidebar p-3 transition-[width] duration-200 lg:flex",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <Link href="/dashboard" className={cn("flex h-14 items-center px-3", collapsed && "justify-center px-0")}>
        {collapsed ? <span className="text-xl font-extrabold text-brand-600">V</span> : <Logo />}
      </Link>
      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}
