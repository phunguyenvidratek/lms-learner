"use client";

import { useEffect, useRef } from "react";
import { VIDEO_KEY_PREFIX } from "@/lib/store/learning-store";
import { cn } from "@/lib/utils";
import { VIDEO_COMPLETE_RATIO, type VideoSource } from "@/lib/video";

/**
 * LEARN-02, LEARN-10. Khung 16:9, nhớ vị trí đang xem (localStorage),
 * gọi onReachEnd một lần khi xem tới 90% thời lượng.
 */
export function VideoPlayer({
  cmid,
  source,
  title,
  onReachEnd,
  className,
}: {
  cmid: number;
  source: VideoSource;
  title: string;
  onReachEnd?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const firedRef = useRef(false);
  const lastSaveRef = useRef(0);
  const onReachEndRef = useRef(onReachEnd);
  const key = VIDEO_KEY_PREFIX + cmid;

  useEffect(() => {
    onReachEndRef.current = onReachEnd;
  }, [onReachEnd]);

  useEffect(() => {
    firedRef.current = false;
  }, [cmid]);

  if (source.kind === "drive") {
    return (
      <div className={cn("relative aspect-video w-full bg-black", className)}>
        <iframe src={source.embedUrl} title={title} allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 size-full" />
      </div>
    );
  }

  const save = (t: number) => {
    try {
      localStorage.setItem(key, String(Math.floor(t)));
    } catch {
      /* bỏ qua */
    }
  };

  return (
    <div className={cn("relative aspect-video w-full bg-black", className)}>
      <video
        key={cmid}
        ref={ref}
        src={source.src}
        poster={source.poster}
        controls
        playsInline
        preload="metadata"
        controlsList="nodownload"
        className="absolute inset-0 size-full"
        aria-label={title}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          let saved = 0;
          try {
            saved = Number(localStorage.getItem(key) ?? 0);
          } catch {
            saved = 0;
          }
          if (saved > 0 && saved < v.duration - 2) v.currentTime = saved;
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (!v.duration) return;
          if (Math.abs(v.currentTime - lastSaveRef.current) >= 2) {
            lastSaveRef.current = v.currentTime;
            save(v.currentTime);
          }
          if (!firedRef.current && v.currentTime / v.duration >= VIDEO_COMPLETE_RATIO) {
            firedRef.current = true;
            onReachEndRef.current?.();
          }
        }}
        onPause={(e) => save(e.currentTarget.currentTime)}
        onEnded={() => save(0)}
      />
    </div>
  );
}
