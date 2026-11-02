import { ScreenPlaceholder } from "@/components/screen-placeholder";

export default async function QuizPage({ params }: { params: Promise<{ cmId: string }> }) {
  const { cmId } = await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-4 text-sm text-muted-foreground">Quiz module {cmId}</p>
      <ScreenPlaceholder
        screen="QUIZ"
        title="Làm bài kiểm tra"
        references={["07-quiz-intro", "08-quiz-question-wrong", "09-quiz-question-correct-ai", "10-quiz-result"]}
      />
    </div>
  );
}
