import type { Metadata } from "next";
import { MyCoursesView } from "@/components/course/my-courses-view";
import { PageHeader } from "@/components/layout/page-header";
import { core_course_get_enrolled_courses_by_timeline_classification } from "@/lib/data";
import { courseCover } from "@/lib/mock/data";

export const metadata: Metadata = { title: "Khóa học của tôi" };

/**
 * Màn mẫu (reference implementation) đã dựng xong: COURSE-01..05.
 * Các màn khác dựng theo đúng pattern này: page là server component lấy data qua src/lib/data.ts,
 * phần tương tác tách thành client component trong src/components/<nhóm>/.
 */
export default async function MyCoursesPage() {
  const courses = await core_course_get_enrolled_courses_by_timeline_classification("all");
  return (
    <>
      <PageHeader title="Khóa học của tôi" eyebrow={`Đã ghi danh ${courses.length} khóa`} />
      <MyCoursesView courses={courses} covers={courseCover} />
    </>
  );
}
