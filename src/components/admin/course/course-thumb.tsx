/** Ảnh bìa khóa phía admin, có ô trống khi khóa chưa có ảnh (Admin CSET-03 cảnh báo thiếu ảnh) */
import { ImageOff } from "lucide-react";
import { CourseImage } from "@/components/common/course-image";
import { cn } from "@/lib/utils";

export function CourseThumb({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes?: string }) {
  if (!src)
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)} role="img" aria-label="Chưa có ảnh bìa">
        <ImageOff className="size-6" />
      </div>
    );
  return <CourseImage src={src} alt={alt} className={className} sizes={sizes} />;
}
