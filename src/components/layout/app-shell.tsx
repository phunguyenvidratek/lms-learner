"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/common/require-auth";
import { PageSkeleton } from "@/components/common/skeletons";
import type { SiteInfo } from "@/types/moodle";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

/** SHELL-01..04: sidebar, header, nội dung. Chưa đăng nhập thì chuyển về /login. */
export function AppShell({ user, children }: { user: SiteInfo; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-dvh print:block print:min-h-0">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col print:block">
        <AppHeader user={user} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8 lg:py-8 print:max-w-none print:p-0">
          <RequireAuth fallback={<PageSkeleton />}>{children}</RequireAuth>
        </main>
      </div>
    </div>
  );
}
