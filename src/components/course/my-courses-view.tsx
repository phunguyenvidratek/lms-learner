"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsLineList, TabsLineTrigger } from "@/components/ui/tabs";
import type { CourseStatus } from "@/lib/learning";
import { useLearning } from "@/lib/store/learning-store";
import { CourseCard } from "./course-card";

export type CourseTabKey = "all" | CourseStatus | "favourites";
type SortKey = "recent" | "name";

const TABS: { key: CourseTabKey; label: string; empty: string }[] = [
  { key: "all", label: "Tất cả", empty: "Bạn chưa được ghi danh khóa học nào." },
  { key: "inprogress", label: "Đang học", empty: "Bạn chưa có khóa nào đang học. Bắt đầu một khóa ở tab Tất cả." },
  { key: "completed", label: "Hoàn thành", empty: "Khóa học hoàn thành sẽ hiển thị ở đây, kèm chứng nhận." },
  { key: "notstarted", label: "Chưa bắt đầu", empty: "Bạn đã bắt đầu tất cả khóa học được giao." },
  { key: "favourites", label: "Yêu thích", empty: "Bấm biểu tượng trái tim trên khóa học để thêm vào danh sách yêu thích." },
];

/** COURSE-03 (tab lọc + số đếm), COURSE-05 (tìm kiếm, sắp xếp) */
export function MyCoursesView({ initialTab = "all" }: { initialTab?: CourseTabKey }) {
  const { courses } = useLearning();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = term ? courses.filter((c) => c.info.fullname.toLowerCase().includes(term)) : [...courses];
    return list.sort((a, b) =>
      sort === "name" ? a.info.fullname.localeCompare(b.info.fullname, "vi") : (b.lastaccess ?? 0) - (a.lastaccess ?? 0) || Number(a.locked) - Number(b.locked),
    );
  }, [courses, q, sort]);

  const byTab = (key: CourseTabKey) =>
    filtered.filter((c) => (key === "all" ? true : key === "favourites" ? c.isfavourite : c.status === key));

  return (
    <Tabs defaultValue={initialTab}>
      <div className="flex flex-col gap-4">
        <TabsLineList>
          {TABS.map((t) => (
            <TabsLineTrigger key={t.key} value={t.key}>
              {t.label} <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{byTab(t.key).length}</span>
            </TabsLineTrigger>
          ))}
        </TabsLineList>
        <div className="flex gap-2 sm:justify-end">
          <div className="relative flex-1 sm:w-72 sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm trong khóa của tôi" className="pl-9" aria-label="Tìm khóa học" />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sắp xếp"
            className="h-10 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="recent">Truy cập gần nhất</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>

      {TABS.map((t) => {
        const list = byTab(t.key);
        return (
          <TabsContent key={t.key} value={t.key} className="pt-2">
            {list.length === 0 ? (
              q ? (
                <EmptyState
                  icon={Search}
                  title={`Không tìm thấy khóa học cho "${q}"`}
                  description="Thử từ khóa khác hoặc xóa ô tìm kiếm."
                  action={<Button variant="outline" onClick={() => setQ("")}>Xóa tìm kiếm</Button>}
                />
              ) : (
                <EmptyState icon={BookOpen} title="Chưa có khóa học" description={t.empty} />
              )
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((c) => (
                  <CourseCard key={c.info.id} view={c} />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
