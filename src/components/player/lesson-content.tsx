"use client";

import { Download, ExternalLink, FileUp, Maximize2 } from "lucide-react";
import { MoodleHtml } from "@/components/common/moodle-html";
import { Button } from "@/components/ui/button";
import { LMS_URL } from "@/lib/config";
import { useLearning } from "@/lib/store/learning-store";
import { formatFileSize } from "@/lib/utils";
import type { CourseModule } from "@/types/moodle";

/** LEARN-03: hiển thị Page */
export function PageContent({ module, html }: { module: CourseModule; html: string | null }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">{module.name}</h1>
      {module.customdata_duration && (
        <p className="mt-2 text-sm text-muted-foreground">{Math.round(module.customdata_duration / 60)} phút đọc</p>
      )}
      <MoodleHtml html={html ?? module.description ?? ""} className="mt-4" />
    </article>
  );
}

/** LEARN-04: PDF xem trực tiếp (máy tính), nút mở và tải về (mọi thiết bị) */
export function ResourceContent({ module }: { module: CourseModule }) {
  const file = module.contents?.[0];
  if (!file) return null;
  return (
    <div className="bg-muted/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{file.filename}</p>
          <p className="text-xs text-muted-foreground">PDF • {formatFileSize(file.filesize)}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={file.fileurl} target="_blank" rel="noopener noreferrer">
              <Maximize2 /> Mở toàn màn hình
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={file.fileurl} download={file.filename}>
              <Download /> Tải xuống
            </a>
          </Button>
        </div>
      </div>
      <iframe src={`${file.fileurl}#view=FitH`} title={module.name} className="hidden h-[72vh] w-full md:block" />
      <div className="px-4 py-10 text-center text-sm text-muted-foreground md:hidden">
        Bấm Mở toàn màn hình để đọc tài liệu trên điện thoại.
      </div>
    </div>
  );
}

/** LEARN-05: link ngoài mở ở tab mới, hoàn thành khi mở */
export function UrlContent({ module }: { module: CourseModule }) {
  const { actions } = useLearning();
  const host = module.externalurl ? new URL(module.externalurl).hostname.replace(/^www\./, "") : "";
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="rounded-xl border bg-card p-6 text-center shadow-xs sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <ExternalLink className="size-6" />
        </div>
        <h1 className="mt-4 text-xl font-bold">{module.name}</h1>
        <MoodleHtml html={module.description ?? ""} className="mt-2 text-sm text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">{host}</p>
        <Button asChild size="lg" className="mt-5">
          <a href={module.externalurl} target="_blank" rel="noopener noreferrer" onClick={() => actions.completeModule(module.id)}>
            Mở liên kết <ExternalLink />
          </a>
        </Button>
      </div>
    </div>
  );
}

/** LEARN-08: hoạt động chưa hỗ trợ trên cổng học, mở trên LMS */
export function UnsupportedContent({ module }: { module: CourseModule }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="rounded-xl border bg-card p-6 shadow-xs sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <FileUp className="size-6" />
        </div>
        <h1 className="mt-4 text-xl font-bold">{module.name}</h1>
        <MoodleHtml html={module.description ?? ""} className="mt-2 text-sm" />
        <div className="mt-5 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          Bài tập này nộp trên hệ thống LMS của VIGO. Hệ thống mở tab mới và tự đăng nhập bằng tài khoản hiện tại của bạn.
        </div>
        <Button asChild size="lg" className="mt-5">
          <a href={`${LMS_URL}/mod/assign/view.php?id=${module.id}`} target="_blank" rel="noopener noreferrer">
            Mở trên LMS <ExternalLink />
          </a>
        </Button>
      </div>
    </div>
  );
}
