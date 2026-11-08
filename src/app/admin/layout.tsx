/** Admin SHELL-01..07. Moodle: mọi trang quản trị (theme Boost Union + child theme). */
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { core_webservice_get_site_info } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s | Quản trị VIGO Learning" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await core_webservice_get_site_info();
  return <AdminShell user={user}>{children}</AdminShell>;
}
