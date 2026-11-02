import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Khám phá khóa học" };

export default function CatalogPage() {
  return (
    <>
      <PageHeader title="Khám phá khóa học" />
      <ScreenPlaceholder screen="CAT" title="Catalog" references={["11-course-landing"]} />
    </>
  );
}
