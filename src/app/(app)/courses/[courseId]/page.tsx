import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { Button } from "@/components/ui/button";
import { core_course_get_contents, core_course_get_enrolled_courses_by_timeline_classification, nextModuleToLearn } from "@/lib/data";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const id = Number(courseId);
  const courses = await core_course_get_enrolled_courses_by_timeline_classification("all");
  const course = courses.find((c) => c.id === id);
  if (!course) notFound();
  const next = nextModuleToLearn(await core_course_get_contents(id));

  return (
    <>
      <PageHeader
        eyebrow="Khóa học"
        title={course.fullname}
        actions={
          next && (
            <Button asChild>
              <Link href={next.modname === "quiz" ? `/quiz/${next.id}` : `/learn/${id}/${next.id}`}>Học tiếp</Link>
            </Button>
          )
        }
      />
      <ScreenPlaceholder
        screen="CDET"
        title="Chi tiết khóa học"
        references={["11-course-landing", "12-course-landing-curriculum", "13-course-landing-description"]}
      />
    </>
  );
}
