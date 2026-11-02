import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailView, type CourseTab } from "@/components/course/course-detail-view";
import { core_course_get_courses_by_field, mod_forum_get_forum_discussions } from "@/lib/data";

type Props = { params: Promise<{ courseId: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await core_course_get_courses_by_field(Number((await params).courseId));
  return { title: course?.fullname ?? "Không tìm thấy khóa học" };
}

/** CDET: chi tiết khóa học */
export default async function CourseDetailPage({ params, searchParams }: Props) {
  const { courseId } = await params;
  const { tab } = await searchParams;
  const course = await core_course_get_courses_by_field(Number(courseId));
  if (!course) notFound();
  const discussions = await mod_forum_get_forum_discussions(course.id);
  const initialTab: CourseTab = tab === "hoi-dap" || tab === "thong-bao" ? tab : "noi-dung";
  return <CourseDetailView key={initialTab} courseId={course.id} discussions={discussions} initialTab={initialTab} />;
}
