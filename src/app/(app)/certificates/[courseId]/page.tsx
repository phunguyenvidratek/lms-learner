import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/certificates/certificate-view";
import { core_course_get_courses_by_field, core_webservice_get_site_info } from "@/lib/data";

type Props = { params: Promise<{ courseId: string }>; searchParams: Promise<{ download?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await core_course_get_courses_by_field(Number((await params).courseId));
  return { title: course ? `Chứng nhận ${course.fullname}` : "Không tìm thấy chứng nhận" };
}

/** CERT-01: bản chứng nhận */
export default async function CertificatePage({ params, searchParams }: Props) {
  const course = await core_course_get_courses_by_field(Number((await params).courseId));
  if (!course) notFound();
  const [{ download }, user] = await Promise.all([searchParams, core_webservice_get_site_info()]);
  return <CertificateView courseId={course.id} user={user} autoPrint={download === "1"} />;
}
