import Image from "next/image";
import { cn } from "@/lib/utils";

/** Ảnh khóa học. Bản thật: courseimage là link pluginfile, đi qua proxy kèm token (INT-02). */
export function CourseImage({
  src,
  alt,
  sizes = "(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw",
  className,
  imgClassName,
  preload,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className={cn("object-cover", imgClassName)} />
    </div>
  );
}
