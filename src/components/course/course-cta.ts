import { moduleHref, type CourseView } from "@/lib/learning";

/** COURSE-02, CDET-01: nút hành động theo trạng thái, mở thẳng bài cần học */
export function courseCta(view: CourseView): { label: string; href: string | null } {
  if (view.locked) return { label: "Chưa mở", href: null };
  const target = view.status === "completed" ? view.playable[0] : view.next;
  const href = target ? moduleHref(view.info.id, target) : `/courses/${view.info.id}`;
  if (view.status === "completed") return { label: "Xem lại khóa học", href };
  if (view.status === "inprogress") return { label: "Học tiếp", href };
  return { label: "Bắt đầu học", href };
}
