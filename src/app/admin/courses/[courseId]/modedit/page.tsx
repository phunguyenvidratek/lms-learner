/**
 * Admin ACT-01..07, QUIZ-01.
 * Moodle: /course/modedit.php?add={modname}&course={courseId}&section={n} hoặc /course/modedit.php?update={cmid}
 */
import { ModEditPage } from "@/components/admin/editor/mod-edit-page";
import type { ModName } from "@/types/moodle";

export const metadata = { title: "Bài học" };

export default async function ModEdit({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ add?: string; section?: string; update?: string }>;
}) {
  const { courseId } = await params;
  const sp = await searchParams;
  const mode = sp.update
    ? ({ kind: "update", cmid: Number(sp.update) } as const)
    : ({ kind: "add", modname: (sp.add ?? "page") as ModName, section: Number(sp.section ?? 1) } as const);
  return <ModEditPage courseId={Number(courseId)} mode={mode} />;
}
