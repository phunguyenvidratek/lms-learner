"use client";

/**
 * Admin ACT-01 (bảng chọn theo nghiệp vụ VIGO), CED-04 (một lần bấm mở thẳng bảng chọn).
 * Moodle: Activity chooser (course/modedit.php?add=<modname>&course=&section=).
 */
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activityTypes, type ActivityType } from "./activity-types";

function TypeCard({ t, onPick }: { t: ActivityType; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="flex items-start gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-brand-50/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <t.icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{t.name}</span>
        <span className="block text-xs text-muted-foreground">{t.description}</span>
      </span>
    </button>
  );
}

export function ActivityChooser({
  courseId,
  section,
  open,
  onOpenChange,
}: {
  courseId: number;
  section: number | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const pick = (t: ActivityType) => {
    onOpenChange(false);
    router.push(`/admin/courses/${courseId}/modedit?add=${t.modname}&section=${section ?? 1}`);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm bài học</DialogTitle>
          <DialogDescription>Chọn loại bài. Điều kiện hoàn thành được đặt sẵn theo loại, sửa được ở bước sau.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="starred">
          <TabsList>
            <TabsTrigger value="starred">
              <Star className="size-4" /> Thường dùng
            </TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>
          <TabsContent value="starred" className="mt-4 grid gap-2 sm:grid-cols-2">
            {activityTypes
              .filter((t) => t.starred)
              .map((t) => (
                <TypeCard key={t.modname} t={t} onPick={() => pick(t)} />
              ))}
          </TabsContent>
          <TabsContent value="all" className="mt-4 grid gap-2 sm:grid-cols-2">
            {activityTypes.map((t) => (
              <TypeCard key={t.modname} t={t} onPick={() => pick(t)} />
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
