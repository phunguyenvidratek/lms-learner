import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerShell } from "@/components/player/player-shell";
import { QuizView } from "@/components/quiz/quiz-view";
import { core_course_get_course_module } from "@/lib/data";

type Props = { params: Promise<{ cmId: string }> };

async function load(params: Props["params"]) {
  const found = await core_course_get_course_module(Number((await params).cmId));
  return found?.module.modname === "quiz" ? found : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  return { title: found ? `${found.module.name} - ${found.section.name.split(":")[0]}` : "Không tìm thấy bài kiểm tra" };
}

/** QUIZ: làm bài kiểm tra trong khung màn học */
export default async function QuizPage({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  return (
    <PlayerShell courseId={found.courseId} cmid={found.module.id}>
      <QuizView key={found.module.id} courseId={found.courseId} cmid={found.module.id} />
    </PlayerShell>
  );
}
