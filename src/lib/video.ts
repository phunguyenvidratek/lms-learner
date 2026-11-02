/**
 * LEARN-02: nguồn video của module drivevideo. Đổi nguồn chỉ cần sửa hàm này.
 * - Hiện tại: file mp4 (public/videos) phát bằng thẻ <video>, theo dõi được % đã xem.
 * - Khi dùng Google Drive: lưu link dạng https://drive.google.com/file/d/<id>/view vào videourl,
 *   hàm trả về link /preview để nhúng iframe. Drive không cho đọc vị trí xem, nên bài video
 *   chuyển sang hoàn thành thủ công (Đánh dấu hoàn thành).
 */
import type { CourseModule } from "@/types/moodle";

export type VideoSource =
  | { kind: "file"; src: string; poster?: string }
  | { kind: "drive"; embedUrl: string };

export function resolveVideoSource(m: Pick<CourseModule, "videourl" | "videoposter">): VideoSource {
  const url = m.videourl ?? "";
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (drive) return { kind: "drive", embedUrl: `https://drive.google.com/file/d/${drive[1]}/preview` };
  return { kind: "file", src: url, poster: m.videoposter };
}

/** Tỉ lệ xem để tự đánh dấu hoàn thành */
export const VIDEO_COMPLETE_RATIO = 0.9;
