"use client";

/**
 * Admin MYC-01 (thẻ khóa cho người soạn: Đang hiển thị/Đang ẩn, danh mục, không có % học cá nhân),
 * MYC-02 (menu 3 chấm: Soạn nội dung, Cài đặt, Học viên, Báo cáo tiến độ),
 * MYC-03 (lọc theo Nhóm chương trình), MYC-04 (số học viên, % trung bình).
 * Moodle: /my/courses.php (block_myoverview, chế độ Thẻ/Danh sách).
 */
import Link from "next/link";
import { useState } from "react";
import { BookOpen, LayoutGrid, List, MoreVertical, Plus, Users } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_USER_ID, courseStats, myCourses } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { cn, formatDate } from "@/lib/utils";
import type { AdminCourse, ProgramGroup } from "@/types/moodle-admin";
import { PercentBar, SearchBox } from "../common/data";
import { NativeSelect } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";
import { CourseThumb } from "./course-thumb";

const GROUPS: ProgramGroup[] = ["Foundational", "Brands", "Integrated"];

export function CourseActions({ id, className }: { id: number; className?: string }) {
  const base = `/admin/courses/${id}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("size-8", className)} aria-label="Hành động với khóa">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`${base}/edit`}>Soạn nội dung</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${base}/settings`}>Cài đặt</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${base}/participants`}>Học viên</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${base}/reports/progress`}>Báo cáo tiến độ</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VisibilityBadge({ visible }: { visible: number }) {
  return visible ? <Badge variant="success">Đang hiển thị</Badge> : <Badge variant="muted">Đang ẩn</Badge>;
}

function CourseCard({ c }: { c: AdminCourse }) {
  const { ds } = useAdmin();
  const st = courseStats(ds, c.id);
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md">
      <Link href={`/admin/courses/${c.id}/edit`} tabIndex={-1} aria-hidden>
        <CourseThumb src={c.courseimage} alt={c.fullname} className={cn("aspect-video", !c.visible && "opacity-70")} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-muted-foreground">{c.coursecategory}</span>
          <VisibilityBadge visible={c.visible} />
        </div>
        <div className="flex items-start gap-1">
          <Link href={`/admin/courses/${c.id}/edit`} className="line-clamp-2 flex-1 leading-snug font-bold hover:text-primary">
            {c.fullname}
          </Link>
          <CourseActions id={c.id} className="-mt-1 -mr-2" />
        </div>
        <p className="text-xs text-muted-foreground">
          {c.shortname} · Cập nhật {formatDate(c.timemodified)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <span className="flex items-center gap-1.5 text-sm">
            <Users className="size-4 text-muted-foreground" /> {st.students} học viên
          </span>
          {st.students > 0 ? <PercentBar value={st.avgProgress} /> : <span className="text-xs text-muted-foreground">Chưa ghi danh</span>}
        </div>
      </div>
    </article>
  );
}

function CourseRow({ c }: { c: AdminCourse }) {
  const { ds } = useAdmin();
  const st = courseStats(ds, c.id);
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 sm:flex-nowrap">
      <CourseThumb src={c.courseimage} alt="" className="aspect-video w-28 shrink-0 rounded-md" sizes="112px" />
      <div className="min-w-0 flex-1 basis-48">
        <Link href={`/admin/courses/${c.id}/edit`} className="font-semibold hover:text-primary">
          {c.fullname}
        </Link>
        <p className="text-xs text-muted-foreground">
          {c.coursecategory} · Cập nhật {formatDate(c.timemodified)}
        </p>
      </div>
      <VisibilityBadge visible={c.visible} />
      <span className="w-28 text-sm">{st.students} học viên</span>
      <PercentBar value={st.avgProgress} />
      <CourseActions id={c.id} />
    </li>
  );
}

export function MyCoursesView() {
  const { ds } = useAdmin();
  const [group, setGroup] = useState<"all" | ProgramGroup>("all");
  const [vis, setVis] = useState<"all" | "1" | "0">("all");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"card" | "list">("card");
  const all = myCourses(ds, ADMIN_USER_ID);
  const term = q.trim().toLowerCase();
  const list = all.filter(
    (c) =>
      (group === "all" || c.programgroup === group) &&
      (vis === "all" || String(c.visible) === vis) &&
      (!term || c.fullname.toLowerCase().includes(term) || c.shortname.toLowerCase().includes(term)),
  );

  return (
    <AdminPage>
      <AdminPageHeader
        title="Khóa học của tôi"
        description="Các khóa bạn soạn hoặc phụ trách."
        actions={
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus /> Tạo khóa mới
            </Link>
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Tìm theo tên hoặc mã khóa" />
        <NativeSelect aria-label="Nhóm chương trình" className="w-auto" value={group} onChange={(e) => setGroup(e.target.value as typeof group)}>
          <option value="all">Mọi nhóm chương trình</option>
          {GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect aria-label="Trạng thái" className="w-auto" value={vis} onChange={(e) => setVis(e.target.value as typeof vis)}>
          <option value="all">Mọi trạng thái</option>
          <option value="1">Đang hiển thị</option>
          <option value="0">Đang ẩn</option>
        </NativeSelect>
        <div className="ml-auto flex rounded-md border bg-card p-0.5" role="group" aria-label="Kiểu hiển thị">
          {(
            [
              ["card", "Thẻ", LayoutGrid],
              ["list", "Danh sách", List],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              aria-pressed={mode === k}
              className={cn("flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm", mode === k ? "bg-brand-50 font-medium text-brand-700" : "text-muted-foreground")}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={all.length ? "Không có khóa phù hợp" : "Bạn chưa phụ trách khóa nào"}
          description={all.length ? "Thử bỏ bớt bộ lọc hoặc đổi từ khóa tìm kiếm." : "Tạo khóa mới hoặc nhờ Phòng Đào tạo ghi danh bạn làm giảng viên."}
          action={
            all.length ? (
              <Button
                variant="outline"
                onClick={() => {
                  setGroup("all");
                  setVis("all");
                  setQ("");
                }}
              >
                Bỏ lọc
              </Button>
            ) : undefined
          }
        />
      ) : mode === "card" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <ul className="divide-y rounded-xl border bg-card shadow-xs">
          {list.map((c) => (
            <CourseRow key={c.id} c={c} />
          ))}
        </ul>
      )}
    </AdminPage>
  );
}
