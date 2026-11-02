"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Award, Bell, KeyRound, LogOut, Menu, UserRound } from "lucide-react";
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
import { pageTitle } from "@/lib/nav";
import { useLearning } from "@/lib/store/learning-store";
import type { SiteInfo } from "@/types/moodle";
import { SidebarFooter, SidebarNav } from "./app-sidebar";
import { Logo } from "./logo";

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts.length > 1 ? parts[parts.length - 2][0] : "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

/** SHELL-02 (tiêu đề trang, chuông, tài khoản), SHELL-03 (menu mobile), NOTI-04 (badge chưa đọc) */
export function AppHeader({ user }: { user: SiteInfo }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { unread, actions } = useLearning();

  const signOut = () => {
    actions.logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur lg:px-8 print:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Mở menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="gap-6 p-3">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex h-14 items-center px-3">
            <Logo />
          </div>
          <SidebarNav onNavigate={() => setOpen(false)} />
          <SidebarFooter onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <p className="truncate text-base font-semibold text-foreground lg:text-lg">{pageTitle(pathname)}</p>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" asChild className="relative" aria-label={`Thông báo, ${unread} chưa đọc`}>
          <Link href="/notifications">
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-card">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-full py-1 pr-1 pl-1 outline-none hover:bg-muted sm:pr-3">
            <Avatar>
              <AvatarFallback>{initials(user.fullname)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left sm:block">
              <span className="block text-sm leading-tight font-semibold">{user.fullname}</span>
              <span className="block text-xs leading-tight text-muted-foreground">{user.department}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="font-semibold">{user.fullname}</div>
              <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound /> Hồ sơ cá nhân
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/certificates">
                <Award /> Chứng nhận
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile#doi-mat-khau">
                <KeyRound /> Đổi mật khẩu
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={signOut}>
              <LogOut /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
