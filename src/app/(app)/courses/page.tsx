import type { Metadata } from "next";
import { MyCoursesView, type CourseTabKey } from "@/components/course/my-courses-view";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Khóa học của tôi" };

const TAB_KEYS: CourseTabKey[] = ["all", "inprogress", "completed", "notstarted", "favourites"];

/** COURSE: khóa học của tôi */
export default async function MyCoursesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const initialTab = TAB_KEYS.includes(tab as CourseTabKey) ? (tab as CourseTabKey) : "all";
  return (
    <>
      <PageHeader title="Khóa học của tôi" description="Các khóa học được giao theo phòng ban và lộ trình của bạn." />
      <MyCoursesView key={initialTab} initialTab={initialTab} />
    </>
  );
}
