import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/player/lesson-view";
import { PlayerShell } from "@/components/player/player-shell";
import { core_course_get_course_module, mod_forum_get_forum_discussions, mod_page_get_pages_by_courses } from "@/lib/data";

type Props = { params: Promise<{ courseId: string; cmId: string }> };

const LESSON_TYPES = new Set(["drivevideo", "page", "resource", "url", "assign"]);

async function load(params: Props["params"]) {
  const { courseId, cmId } = await params;
  const found = await core_course_get_course_module(Number(cmId));
  if (!found || found.courseId !== Number(courseId) || !LESSON_TYPES.has(found.module.modname)) return null;
  return found;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  return { title: found?.module.name ?? "Không tìm thấy bài học" };
}

/** LEARN: màn học bài */
export default async function LearnPage({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  const [pageHtml, discussions] = await Promise.all([
    found.module.modname === "page" ? mod_page_get_pages_by_courses(found.module.id) : Promise.resolve(null),
    mod_forum_get_forum_discussions(found.courseId),
  ]);
  return (
    <PlayerShell courseId={found.courseId} cmid={found.module.id}>
      <LessonView courseId={found.courseId} cmid={found.module.id} pageHtml={pageHtml} discussions={discussions} />
    </PlayerShell>
  );
}
