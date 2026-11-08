"use client";

/** Admin SHELL-01..04: sidebar, thanh trên cùng, vùng nội dung. Không qua đăng nhập (mockup). */
import { useState } from "react";
import { PageSkeleton } from "@/components/common/skeletons";
import { AdminProvider, useAdmin } from "@/lib/store/admin-store";
import type { AdminUser } from "@/types/moodle-admin";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

function Ready({ children }: { children: React.ReactNode }) {
  const { ready } = useAdmin();
  return ready ? children : <PageSkeleton />;
}

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <AdminProvider>
      <div className="flex min-h-dvh">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader user={user} />
          <main className="w-full min-w-0 flex-1 px-4 py-6 lg:px-8">
            <Ready>{children}</Ready>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
