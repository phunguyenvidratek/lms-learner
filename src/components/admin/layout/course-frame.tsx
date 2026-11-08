"use client";

/**
 * Admin SHELL-05 (tab khóa: Nội dung, Cài đặt, Học viên, Điểm, Hoàn thành, Báo cáo, Câu hỏi, Thêm),
 * SHELL-07 (đầu trang khóa), SHELL-01 (báo cáo, sổ điểm full width).
 * Moodle: secondary navigation của khóa (course/view.php, course/edit.php, user/index.php...).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, SearchX } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { courseSections, getAdminCourse, findAdminModule } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { cn } from "@/lib/utils";
import { courseMoreTabs, courseTabs } from "./nav";
import { AdminPage, Breadcrumbs, type Crumb } from "./page-header";

const FULL_WIDTH = [/\/reports\/progress$/, /\/grades$/];

function TabLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative shrink-0 px-3 py-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground",
        active && "text-primary after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary",
      )}
    >
      {label}
    </Link>
  );
}

export function CourseNotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Không tìm thấy khóa học"
      description="Khóa có thể đã bị xóa hoặc đường dẫn không đúng."
      action={
        <Button asChild>
          <Link href="/admin/courses">Về Quản lý khóa</Link>
        </Button>
      }
      className="mx-auto mt-10 max-w-[1200px]"
    />
  );
}

export function CourseFrame({ courseId, children }: { courseId: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const { ds } = useAdmin();
  const course = getAdminCourse(ds, courseId);
  if (!course) return <CourseNotFound />;
  const base = `/admin/courses/${courseId}`;
  const sub = pathname.slice(base.length + 1).split("/")[0];
  const full = FULL_WIDTH.some((r) => r.test(pathname));
  const inMore = courseMoreTabs.some((t) => t.path === sub);
  const category = ds.categories.find((c) => c.id === course.categoryid);
  const crumbs: Crumb[] = [
    { label: "Quản lý khóa", href: "/admin/courses" },
    ...(category ? [{ label: category.name, href: `/admin/courses?categoryid=${category.id}` }] : []),
    { label: course.shortname },
  ];

  return (
    <AdminPage full={full}>
      <Breadcrumbs items={crumbs} />
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{course.fullname}</h1>
        {course.visible ? <Badge variant="success">Đang hiển thị</Badge> : <Badge variant="muted">Đang ẩn</Badge>}
      </div>
      <div className="mt-4 mb-6 flex items-center overflow-x-auto border-b">
        {courseTabs.map((t) => (
          <TabLink key={t.key} href={`${base}/${t.path}`} label={t.label} active={sub === t.path || !!t.also?.includes(sub)} />
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "relative flex shrink-0 items-center gap-1 px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground",
              inMore && "text-primary after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary",
            )}
          >
            Thêm <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {courseMoreTabs.map((t) => (
              <DropdownMenuItem key={t.key} asChild>
                <Link href={`${base}/${t.path}`}>{t.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {children}
    </AdminPage>
  );
}

/** Khung trang bài kiểm tra (mod/quiz/*): breadcrumb khóa > phần > bài, tab của quiz */
export function QuizFrame({ cmid, children }: { cmid: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const { ds } = useAdmin();
  const found = findAdminModule(ds, cmid);
  if (!found || found.module.modname !== "quiz") return <CourseNotFound />;
  const { course, section, module } = found;
  const base = `/admin/quiz/${cmid}`;
  const tabs = [
    { href: `${base}/edit`, label: "Câu hỏi", active: pathname.startsWith(`${base}/edit`) || pathname.startsWith(`${base}/import`) },
    { href: `${base}/results`, label: "Kết quả", active: pathname.startsWith(`${base}/results`) },
    { href: `/admin/courses/${course.id}/modedit?update=${cmid}`, label: "Cài đặt", active: false },
    { href: `/admin/courses/${course.id}/question-banks`, label: "Ngân hàng câu hỏi", active: false },
  ];
  const sectionName = courseSections(ds, course.id).find((s) => s.section === section.section)?.name ?? section.name;
  return (
    <AdminPage>
      <Breadcrumbs
        items={[
          { label: course.shortname, href: `/admin/courses/${course.id}/edit` },
          { label: sectionName, href: `/admin/courses/${course.id}/edit#phan-${section.section}` },
          { label: module.name },
        ]}
      />
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Bài kiểm tra</p>
      <h1 className="text-2xl font-bold tracking-tight">{module.name}</h1>
      <div className="mt-4 mb-6 flex items-center overflow-x-auto border-b">
        {tabs.map((t) => (
          <TabLink key={t.label} {...t} />
        ))}
      </div>
      {children}
    </AdminPage>
  );
}
