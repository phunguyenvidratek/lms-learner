import { ClipboardCheck, ExternalLink, FileText, FileUp, Info, MonitorPlay, Paperclip } from "lucide-react";
import type { ModName } from "@/types/moodle";

const ICONS: Partial<Record<ModName, React.ComponentType<{ className?: string }>>> = {
  drivevideo: MonitorPlay,
  page: FileText,
  resource: Paperclip,
  url: ExternalLink,
  quiz: ClipboardCheck,
  assign: FileUp,
  label: Info,
};

export const MOD_LABEL: Partial<Record<ModName, string>> = {
  drivevideo: "Video",
  page: "Bài đọc",
  resource: "Tài liệu",
  url: "Liên kết",
  quiz: "Bài kiểm tra",
  assign: "Bài tập",
};

/** CDET-03, LEARN-12: icon theo loại bài */
export function ModuleIcon({ modname, className }: { modname: ModName; className?: string }) {
  const Icon = ICONS[modname] ?? FileText;
  return <Icon className={className} />;
}
