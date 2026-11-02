"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { SiteInfo } from "@/types/moodle";
import { SidebarFooter, SidebarNav } from "./app-sidebar";
import { Logo } from "./logo";
import { useState } from "react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** SHELL-02 + SHELL-03 (menu mobile) + SHELL-06 (ô tìm kiếm, Could) */
export function AppHeader({ user, unread }: { user: SiteInfo; unread: number }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur lg:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Mở menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="gap-6 p-3">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex h-14 items-center px-3">
            <Logo />
          </div>
          <SidebarNav onNavigate={() => setOpen(false)} />
          <SidebarFooter />
        </SheetContent>
      </Sheet>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Tìm khóa học" className="rounded-full bg-muted pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="relative" aria-label="Thông báo">
          <Link href="/notifications">
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-full py-1 pr-2 pl-1 outline-none hover:bg-muted">
            <Avatar>
              <AvatarFallback>{initials(user.fullname)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-semibold sm:block">{user.fullname}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold">{user.fullname}</div>
              <div className="text-xs font-normal text-muted-foreground">{user.username}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Hồ sơ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/certificates">Chứng nhận</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild variant="destructive">
              <Link href="/login">Đăng xuất</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
