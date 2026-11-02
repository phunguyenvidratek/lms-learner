import { cn } from "@/lib/utils";

/**
 * INT-04: render HTML từ Moodle (Page, mô tả khóa, label, availabilityinfo).
 * Bản thật: sanitize trước khi render (ví dụ DOMPurify phía server). Mockup dùng nội dung nội bộ đã kiểm soát.
 */
export function MoodleHtml({ html, className, inline }: { html: string; className?: string; inline?: boolean }) {
  if (inline) return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className={cn("moodle-content", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
