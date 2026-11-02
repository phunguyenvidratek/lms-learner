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
}

/** SHELL-01. Catalog (Could) không đưa vào menu. */
export const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/courses", label: "Khóa học của tôi", icon: BookOpen },
  { href: "/learning-path", label: "Lộ trình học", icon: MapIcon },
  { href: "/tests", label: "Bài kiểm tra", icon: ClipboardList },
  { href: "/grades", label: "Điểm", icon: BarChart3 },
  { href: "/calendar", label: "Lịch", icon: CalendarDays },
  { href: "/certificates", label: "Chứng nhận", icon: Award },
  { href: "/notifications", label: "Thông báo", icon: Bell },
];

/** SHELL-02: tiêu đề trang trên header */
export function pageTitle(pathname: string): string {
  if (pathname.startsWith("/profile")) return "Hồ sơ cá nhân";
  if (/^\/courses\/\d+/.test(pathname)) return "Chi tiết khóa học";
  if (/^\/certificates\/\d+/.test(pathname)) return "Chứng nhận";
  const item = mainNav.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"));
  return item?.label ?? "";
}
