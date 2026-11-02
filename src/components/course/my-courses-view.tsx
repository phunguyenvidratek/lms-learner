"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourseStatus, type CourseStatus } from "@/lib/data";
import type { EnrolledCourse } from "@/types/moodle";
import { CourseCard } from "./course-card";

type TabKey = "all" | CourseStatus | "favourites";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "inprogress", label: "Đang học" },
  { key: "completed", label: "Hoàn thành" },
  { key: "notstarted", label: "Chưa bắt đầu" },
  { key: "favourites", label: "Yêu thích" },
];

/** COURSE-03 (tab lọc + số đếm), COURSE-05 (tìm kiếm) */
export function MyCoursesView({ courses, covers }: { courses: EnrolledCourse[]; covers: Record<number, string> }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? courses.filter((c) => c.fullname.toLowerCase().includes(term)) : courses;
  }, [courses, q]);

  const byTab = (key: TabKey) =>
    filtered.filter((c) => {
      if (key === "all") return true;
      if (key === "favourites") return c.isfavourite;
      return getCourseStatus(c) === key;
    });

  return (
    <Tabs defaultValue="all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
              <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{byTab(t.key).length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm trong khóa của tôi" className="pl-9" />
        </div>
      </div>

      {TABS.map((t) => {
        const list = byTab(t.key);
        return (
          <TabsContent key={t.key} value={t.key}>
            {list.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
                Không có khóa học nào ở mục này.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((c) => (
                  <CourseCard key={c.id} course={c} status={getCourseStatus(c)} cover={covers[c.id] ?? "from-brand-700 to-brand-400"} />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
