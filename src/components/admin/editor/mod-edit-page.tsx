"use client";

/** Admin ACT, QUIZ-01: chọn form theo loại bài (Bài kiểm tra dùng form cài đặt quiz). Moodle: /course/modedit.php */
import { findAdminModule } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { ModForm, type ModEditMode } from "./mod-form";

export function ModEditPage({ courseId, mode }: { courseId: number; mode: ModEditMode }) {
  const { ds } = useAdmin();
  const modname = mode.kind === "add" ? mode.modname : findAdminModule(ds, mode.cmid)?.module.modname;
  // Mỗi lần đổi bài (cmid / loại) dựng lại form từ đầu
  const key = mode.kind === "add" ? `add-${mode.modname}-${mode.section}` : `upd-${mode.cmid}-${modname}`;
  return <ModForm key={key} courseId={courseId} mode={mode} />;
}
