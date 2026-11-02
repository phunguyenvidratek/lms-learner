"use client";

import { useState } from "react";
import type { SiteInfo } from "@/types/moodle";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

/** SHELL-01..04. Trạng thái thu gọn sidebar giữ trong bộ nhớ (mockup chưa cần lưu lại). */
export function AppShell({ user, unread, children }: { user: SiteInfo; unread: number; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-dvh">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader user={user} unread={unread} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
