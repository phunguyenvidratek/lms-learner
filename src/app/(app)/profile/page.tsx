import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileView } from "@/components/profile/profile-view";
import { core_webservice_get_site_info } from "@/lib/data";

export const metadata: Metadata = { title: "Hồ sơ cá nhân" };

/** PROF: hồ sơ cá nhân */
export default async function ProfilePage() {
  const user = await core_webservice_get_site_info();
  return (
    <>
      <PageHeader title="Hồ sơ cá nhân" />
      <ProfileView user={user} />
    </>
  );
}
