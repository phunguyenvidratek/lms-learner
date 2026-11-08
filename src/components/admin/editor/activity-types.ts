/**
 * Admin ACT-01: bảng chọn loại bài theo nghiệp vụ VIGO, tên tiếng Việt, mô tả 1 dòng.
 * Thường dùng = Starred mặc định (7 loại). Tất cả = các module còn bật ở site (Wiki, Workshop, Database,
 * IMS, SCORM, Choice đã tắt nên không có). Bài video theo hướng A của ACT-02 (mod_drivevideo, chưa chốt).
 */
import {
  BookText,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FileUp,
  Folder,
  Megaphone,
  MessageSquareText,
  MonitorPlay,
  Paperclip,
  Puzzle,
  Type,
  type LucideIcon,
} from "lucide-react";
import type { ModName } from "@/types/moodle";

export interface ActivityType {
  modname: ModName;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Tên module Moodle (để dev đối chiếu) */
  moodle: string;
  starred: boolean;
}

export const activityTypes: ActivityType[] = [
  { modname: "drivevideo", name: "Bài video", description: "Dán link Google Drive, học viên xem ngay trong bài.", icon: MonitorPlay, moodle: "mod_drivevideo", starred: true },
  { modname: "resource", name: "Tài liệu", description: "Tải lên PDF, PowerPoint, Word để học viên xem và tải về.", icon: Paperclip, moodle: "mod_resource", starred: true },
  { modname: "page", name: "Bài đọc", description: "Nội dung soạn trực tiếp: chữ, hình, bảng.", icon: FileText, moodle: "mod_page", starred: true },
  { modname: "quiz", name: "Bài kiểm tra", description: "Trắc nghiệm chấm tự động, nhập câu hỏi từ Excel được.", icon: ClipboardCheck, moodle: "mod_quiz", starred: true },
  { modname: "assign", name: "Bài nộp", description: "Học viên nộp file hoặc bài viết, giảng viên chấm.", icon: FileUp, moodle: "mod_assign", starred: true },
  { modname: "feedback", name: "Khảo sát", description: "Thu ý kiến học viên sau bài học hoặc cuối khóa.", icon: MessageSquareText, moodle: "mod_feedback", starred: true },
  { modname: "forum", name: "Thông báo", description: "Diễn đàn để đăng tin tới học viên trong khóa.", icon: Megaphone, moodle: "mod_forum", starred: true },
  { modname: "url", name: "Liên kết", description: "Trỏ tới một trang web bên ngoài.", icon: ExternalLink, moodle: "mod_url", starred: false },
  { modname: "label", name: "Văn bản và hình ảnh", description: "Đoạn chữ hoặc hình hiện ngay trên trang khóa.", icon: Type, moodle: "mod_label", starred: false },
  { modname: "folder", name: "Thư mục", description: "Nhóm nhiều tệp trong một bài.", icon: Folder, moodle: "mod_folder", starred: false },
  { modname: "book", name: "Sách", description: "Nội dung nhiều chương, có mục lục.", icon: BookText, moodle: "mod_book", starred: false },
  { modname: "h5pactivity", name: "H5P", description: "Nội dung tương tác H5P (kéo thả, video có câu hỏi).", icon: Puzzle, moodle: "mod_h5pactivity", starred: false },
];

export function activityType(modname: ModName) {
  return activityTypes.find((a) => a.modname === modname);
}
