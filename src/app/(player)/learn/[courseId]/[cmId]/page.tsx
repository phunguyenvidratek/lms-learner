import { ScreenPlaceholder } from "@/components/screen-placeholder";

export default async function LearnPage({ params }: { params: Promise<{ courseId: string; cmId: string }> }) {
  const { courseId, cmId } = await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-4 text-sm text-muted-foreground">
        Khóa {courseId}, module {cmId}
      </p>
      <ScreenPlaceholder
        screen="LEARN"
        title="Màn học bài (Course player)"
        references={["02-player", "03-player-overview-tab", "04-player-notes-tab", "05-player-announcements-tab", "06-progress-popover"]}
      />
    </div>
  );
}
