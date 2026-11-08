/**
 * Admin SHELL-03 (menu theo việc của Phòng Đào tạo), SHELL-04 (nhóm sidebar), SHELL-05 (tab khóa).
 * Mỗi mục ghi URL Moodle core tương ứng (Boost Union smart menu trỏ thẳng URL này).
 */
import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  FolderTree,
  LayoutDashboard,
  Library,
  Megaphone,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** URL Moodle thật */
  moodle: string;
  /** Các route con cũng tô sáng mục này */
  match?: RegExp;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNav: AdminNavGroup[] = [
  {
    label: "",
    items: [{ href: "/admin", label: "Tổng quan", icon: LayoutDashboard, moodle: "/my/", match: /^\/admin$/ }],
  },
  {
    label: "Khóa học",
    items: [
      { href: "/admin/my-courses", label: "Khóa học của tôi", icon: BookOpen, moodle: "/my/courses.php" },
      {
        href: "/admin/courses",
        label: "Quản lý khóa",
        icon: FolderTree,
        moodle: "/course/management.php",
        match: /^\/admin\/(courses|quiz)(\/|$)/,
      },
      { href: "/admin/question-banks", label: "Ngân hàng câu hỏi", icon: Library, moodle: "/question/banks.php?courseid=" },
    ],
  },
  {
    label: "Người dùng",
    items: [
      { href: "/admin/users", label: "Người dùng", icon: Users, moodle: "/admin/user.php" },
      { href: "/admin/cohorts", label: "Phòng ban", icon: Building2, moodle: "/cohort/index.php" },
    ],
  },
  {
    label: "Báo cáo",
    items: [{ href: "/admin/reports", label: "Báo cáo", icon: BarChart3, moodle: "/reportbuilder/index.php" }],
  },
  {
    label: "Lịch và thông báo",
    items: [
      { href: "/admin/calendar", label: "Lịch", icon: CalendarDays, moodle: "/calendar/view.php?view=month" },
      { href: "/admin/announcements", label: "Thông báo chung", icon: Megaphone, moodle: "/mod/forum/view.php?f=" },
    ],
  },
];

export function isActive(item: AdminNavItem, pathname: string) {
  if (item.match) return item.match.test(pathname);
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

/** SHELL-05: tab khóa. "Thêm" chỉ còn Dùng lại khóa và Thùng rác. */
export interface CourseTab {
  key: string;
  label: string;
  path: string;
  moodle: string;
  /** Route con thuộc tab */
  also?: string[];
}

export const courseTabs: CourseTab[] = [
  { key: "content", label: "Nội dung", path: "edit", moodle: "/course/view.php?id={id}&edit=on", also: ["modedit"] },
  { key: "settings", label: "Cài đặt", path: "settings", moodle: "/course/edit.php?id={id}" },
  { key: "participants", label: "Học viên", path: "participants", moodle: "/user/index.php?id={id}", also: ["enrolments"] },
  { key: "grades", label: "Điểm", path: "grades", moodle: "/grade/report/grader/index.php?id={id}" },
  { key: "completion", label: "Hoàn thành", path: "completion", moodle: "/course/completion.php?id={id}" },
  { key: "reports", label: "Báo cáo", path: "reports", moodle: "/report/view.php?courseid={id}" },
  { key: "questions", label: "Câu hỏi", path: "question-banks", moodle: "/question/banks.php?courseid={id}" },
];

export const courseMoreTabs: CourseTab[] = [
  { key: "reuse", label: "Dùng lại khóa", path: "reuse", moodle: "/backup/import.php?id={id}" },
  { key: "recyclebin", label: "Thùng rác", path: "recyclebin", moodle: "/admin/tool/recyclebin/index.php?contextid=" },
];
