import { AppShell } from "@/components/layout/app-shell";
import { core_webservice_get_site_info } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await core_webservice_get_site_info();
  return <AppShell user={user}>{children}</AppShell>;
}
