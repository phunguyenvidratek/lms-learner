"use client";

/**
 * Admin SHELL-02 (cùng brand learner), SHELL-03 (menu chính + smart menu "Quản trị đào tạo").
 * Giữ cấu trúc thanh trên cùng của Moodle: logo, menu chính, chuông, avatar, công tắc Chế độ chỉnh sửa.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronDown, GraduationCap, Menu, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { adminAlerts } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/moodle-admin";
import { Switch } from "../common/switch";
import { AdminBrand, AdminSidebarFooter, AdminSidebarNav } from "./admin-sidebar";
import { adminNav } from "./nav";

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts.length > 1 ? parts[parts.length - 2][0] : "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

/** Smart menu Quản trị đào tạo: các mục của sidebar trừ Tổng quan, Khóa học của tôi */
const trainingMenu = adminNav.flatMap((g) => g.items).filter((i) => i.href !== "/admin" && i.href !== "/admin/my-courses");

function TopLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-16 items-center px-3 text-sm font-medium text-muted-foreground hover:text-foreground",
        active && "text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
      )}
    >
      {label}
    </Link>
  );
}

export function AdminHeader({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { ds, state, actions } = useAdmin();
  const now = useNow();
  const alerts = adminAlerts(ds, now);
  const editing = state?.editing ?? true;
  const inTraining = trainingMenu.some((i) => pathname.startsWith(i.href)) || pathname.startsWith("/admin/quiz");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-card/95 px-4 backdrop-blur lg:px-6 print:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Mở menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="gap-5 p-3">
          <SheetTitle className="sr-only">Menu quản trị</SheetTitle>
          <AdminBrand />
          <AdminSidebarNav onNavigate={() => setOpen(false)} />
          <AdminSidebarFooter />
        </SheetContent>
      </Sheet>

      <div className="lg:hidden">
        <AdminBrand />
      </div>
      <nav className="hidden items-center md:flex" aria-label="Menu chính">
        <TopLink href="/admin" label="Tổng quan" active={pathname === "/admin"} />
        <TopLink href="/admin/my-courses" label="Khóa học của tôi" active={pathname.startsWith("/admin/my-courses")} />
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "relative flex h-16 items-center gap-1 px-3 text-sm font-medium text-muted-foreground outline-none hover:text-foreground",
              inTraining && "text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
            )}
          >
            Quản trị đào tạo <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            {trainingMenu.map((i) => (
              <DropdownMenuItem key={i.href} asChild>
                <Link href={i.href}>
                  <i.icon /> {i.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label={`Thông báo, ${alerts.length} việc cần xử lý`}>
              <Bell className="size-5" />
              {alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-card">
                  {alerts.length > 99 ? "99+" : alerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.length === 0 && <p className="px-2 py-4 text-center text-sm text-muted-foreground">Không có thông báo mới</p>}
            {alerts.slice(0, 5).map((a) => (
              <DropdownMenuItem key={a.id} asChild>
                <Link href={a.href} className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{a.title}</span>
                  <span className="text-xs text-muted-foreground">{a.detail}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            {alerts.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin#viec-can-xu-ly" className="justify-center text-primary">
                    Xem tất cả việc cần xử lý
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 outline-none hover:bg-muted sm:pr-3" aria-label="Tài khoản">
            <Avatar>
              <AvatarFallback>{initials(user.fullname)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left xl:block">
              <span className="block text-sm leading-tight font-semibold">{user.fullname}</span>
              <span className="block text-xs leading-tight text-muted-foreground">Quản lý, Phòng Đào tạo</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="font-semibold">{user.fullname}</div>
              <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" target="_blank">
                <GraduationCap /> Mở cổng học viên
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => actions.reset()}>
              <RotateCcw /> Bỏ mọi thay đổi trên trang quản trị
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <label className="ml-1 flex items-center gap-2 border-l pl-3 text-sm font-medium whitespace-nowrap">
          <span className="hidden sm:inline">Chế độ chỉnh sửa</span>
          <Switch checked={editing} onCheckedChange={actions.setEditing} label="Chế độ chỉnh sửa" />
        </label>
      </div>
    </header>
  );
}
