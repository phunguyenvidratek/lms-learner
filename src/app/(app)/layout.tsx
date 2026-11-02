import { AppShell } from "@/components/layout/app-shell";
import { core_webservice_get_site_info, message_popup_get_unread_popup_notification_count } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, unread] = await Promise.all([
    core_webservice_get_site_info(),
    message_popup_get_unread_popup_notification_count(),
  ]);
  return (
    <AppShell user={user} unread={unread}>
      {children}
    </AppShell>
  );
}
