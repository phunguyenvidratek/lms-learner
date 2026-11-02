import type { Metadata } from "next";
import { LearningPathView } from "@/components/learning-path/learning-path-view";
import { local_learningpath_get_paths } from "@/lib/data";

export const metadata: Metadata = { title: "Lộ trình học" };

/** LP: lộ trình học */
export default async function LearningPathPage() {
  const [path] = await local_learningpath_get_paths();
  return <LearningPathView path={path} />;
}
