import type { Metadata } from "next";
import { CertificatesView } from "@/components/certificates/certificates-view";
import { PageHeader } from "@/components/layout/page-header";
import { core_webservice_get_site_info } from "@/lib/data";

export const metadata: Metadata = { title: "Chứng nhận" };

/** CERT: chứng nhận đã đạt */
export default async function CertificatesPage() {
  const user = await core_webservice_get_site_info();
  return (
    <>
      <PageHeader title="Chứng nhận" description="Chứng nhận hoàn thành các khóa đào tạo nội bộ của VIGO." />
      <CertificatesView user={user} />
    </>
  );
}
