import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Map as MapIcon,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Mã màn hình trong backlog */
  screen: string;
}

/** SHELL-01. Thứ tự và tên menu theo FE hiện tại, nhãn tiếng Việt. */
export const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard, screen: "DASH" },
  { href: "/courses", label: "Khóa học của tôi", icon: BookOpen, screen: "COURSE" },
  { href: "/learning-path", label: "Lộ trình học", icon: MapIcon, screen: "LP" },
  { href: "/tests", label: "Bài kiểm tra", icon: ClipboardList, screen: "TEST" },
  { href: "/grades", label: "Điểm", icon: BarChart3, screen: "GRADE" },
  { href: "/calendar", label: "Lịch", icon: CalendarDays, screen: "CAL" },
  { href: "/certificates", label: "Chứng nhận", icon: Award, screen: "CERT" },
  { href: "/notifications", label: "Thông báo", icon: Bell, screen: "NOTI" },
];
