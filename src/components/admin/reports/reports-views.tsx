"use client";

/**
 * Admin RPT-01 (bộ báo cáo dựng sẵn, lọc phòng ban, nút xuất, lịch gửi email), RPT-02 (trang Báo cáo theo câu hỏi nghiệp vụ).
 * Moodle: /reportbuilder/index.php (Custom reports), /reportbuilder/view.php?id={reportid}
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BarChart3, CalendarClock, Download, FileBarChart, Users } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildReport, reportDefs, type ReportCell } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";
import { downloadCsv, PercentBar, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { NativeSelect } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";

export function ReportsIndexView() {
  const { ds } = useAdmin();
  return (
    <AdminPage>
      <AdminPageHeader title="Báo cáo" description="Chọn câu hỏi bạn cần trả lời. Mỗi báo cáo lọc được theo phòng ban và xuất Excel." />
      <div className="grid gap-4 md:grid-cols-2">
        {reportDefs.map((r) => (
          <Link key={r.id} href={`/admin/reports/${r.id}`} className="group flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <p className="text-lg font-semibold group-hover:text-primary">{r.question}</p>
            <p className="mt-1 text-sm font-medium text-brand-700">{r.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarClock className="size-3.5" /> {r.schedule}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {r.audience}
              </span>
              <ArrowRight className="ml-auto size-4 text-primary" />
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-3 text-lg font-semibold">Báo cáo trong từng khóa</h2>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Khóa học</Th>
              <Th className="text-right">Báo cáo</Th>
            </tr>
          </thead>
          <tbody>
            {ds.courses.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium">{c.fullname}</Td>
                <Td>
                  <div className="flex flex-wrap justify-end gap-1">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/courses/${c.id}/reports/progress`}>Hoàn thành bài</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/courses/${c.id}/grades`}>Sổ điểm</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/courses/${c.id}/participants`}>Học viên</Link>
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </AdminPage>
  );
}

const TONE = {
  success: "success",
  warning: "warning",
  danger: "danger",
  muted: "muted",
  brand: "secondary",
} as const;

export function CellView({ cell }: { cell: ReportCell }) {
  if (typeof cell === "object") {
    if (cell.pct !== undefined) return <PercentBar value={cell.pct} />;
    return <Badge variant={TONE[cell.tone ?? "muted"]}>{cell.text}</Badge>;
  }
  return <>{cell}</>;
}

export function ReportView({ id }: { id: string }) {
  const { ds } = useAdmin();
  const now = useNow();
  const def = reportDefs.find((r) => r.id === id);
  const [cohort, setCohort] = useState("all");
  if (!def) return <EmptyState icon={FileBarChart} title="Không tìm thấy báo cáo" className="mx-auto max-w-[1200px]" />;
  const table = buildReport(ds, id, cohort === "all" ? null : Number(cohort), now);
  const numeric = table.rows[0]?.map((c) => typeof c === "number" || (typeof c === "object" && c.pct !== undefined)) ?? [];

  return (
    <AdminPage full>
      <AdminPageHeader
        breadcrumbs={[{ label: "Báo cáo", href: "/admin/reports" }, { label: def.name }]}
        title={def.name}
        description={def.description}
        actions={
          <Button
            variant="outline"
            disabled={!table.rows.length}
            onClick={() =>
              downloadCsv(`${def.id}.csv`, [table.columns, ...table.rows.map((r) => r.map((c) => (typeof c === "object" ? c.text : c)))])
            }
          >
            <Download /> Xuất Excel
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <NativeSelect aria-label="Phòng ban" className="w-auto" value={cohort} onChange={(e) => setCohort(e.target.value)}>
          <option value="all">Mọi phòng ban</option>
          {ds.cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
        <span className="text-sm text-muted-foreground">{table.rows.length} dòng</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" /> Gửi email: {def.schedule} · Người xem: {def.audience}
        </span>
      </div>
      {table.rows.length === 0 ? (
        <EmptyState icon={BarChart3} title="Không có dữ liệu" description="Thử chọn phòng ban khác." />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                {table.columns.map((c, i) => (
                  <Th key={c} className={cn(numeric[i] && typeof table.rows[0][i] === "number" && "text-right")}>
                    {c}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <Tr key={i}>
                  {r.map((c, j) => (
                    <Td key={j} className={cn(typeof c === "number" && "text-right tabular-nums", j === 0 && "font-medium")}>
                      <CellView cell={c} />
                    </Td>
                  ))}
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </AdminPage>
  );
}
