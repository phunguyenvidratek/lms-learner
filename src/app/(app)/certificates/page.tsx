import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Chứng nhận" };

export default function CertificatesPage() {
  return (
    <>
      <PageHeader title="Chứng nhận" />
      <ScreenPlaceholder screen="CERT" title="Chứng nhận" references={[]} />
    </>
  );
}
