"use client";

/**
 * Admin QUIZ-05: kết quả bài kiểm tra có thẻ tóm tắt (đã làm, đạt, điểm trung bình, câu sai nhiều nhất),
 * khung lọc thu gọn mặc định, bảng lượt làm. Moodle: /mod/quiz/report.php?id={cmid}&mode=overview
 */
import { useState } from "react";
import { BarChart3, CheckCircle2, ClipboardList, Download, Users, XCircle } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { findAdminModule, quizReport, userCohorts, type QuizReportRow } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { formatDateTime, stripHtml } from "@/lib/utils";
import { downloadCsv, StatCard, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { Field, FormSection, NativeSelect } from "../common/form";
import { SectionHeader } from "../layout/page-header";

const STATE: Record<string, { label: string; variant: "success" | "danger" | "warning" | "muted" | "secondary" }> = {
  passed: { label: "Đạt", variant: "success" },
  failed: { label: "Chưa đạt, còn lượt", variant: "warning" },
  exhausted: { label: "Hết lượt, chưa đạt", variant: "danger" },
  notstarted: { label: "Chưa làm", variant: "muted" },
  inprogress: { label: "Đang làm", variant: "secondary" },
  locked: { label: "Chưa mở", variant: "muted" },
};

const g = (n: number | null | undefined) => (n == null ? "-" : n.toFixed(2).replace(".", ","));

export function QuizResultsView({ cmid }: { cmid: number }) {
  const { ds } = useAdmin();
  const found = findAdminModule(ds, cmid)!;
  const report = quizReport(ds, found.course.id, cmid);
  const [who, setWho] = useState<"attempted" | "all" | "notattempted">("attempted");
  const [state, setState] = useState("all");
  const [cohort, setCohort] = useState("all");
  if (!report) return null;
  const { quiz } = report;
  const enrolled = report.rows.length;
  const hardest = report.mostMissed[0];

  const rows = report.rows.filter((r: QuizReportRow) => {
    const tried = r.summary.attempts.length > 0;
    if (who === "attempted" && !tried) return false;
    if (who === "notattempted" && tried) return false;
    if (state !== "all" && r.summary.state !== state) return false;
    if (cohort !== "all" && !userCohorts(ds, r.user.id).some((c) => String(c.id) === cohort)) return false;
    return true;
  });

  const exportCsv = () =>
    downloadCsv(`ket-qua-${quiz.name}.csv`, [
      ["Họ tên", "Email", "Phòng ban", "Số lượt", "Điểm cao nhất", "Trạng thái"],
      ...rows.map((r) => [
        r.user.fullname,
        r.user.email,
        userCohorts(ds, r.user.id).map((c) => c.name).join(", "),
        r.summary.attempts.length,
        g(r.summary.best),
        STATE[r.summary.state].label,
      ]),
    ]);

  return (
    <div>
      <SectionHeader
        title="Kết quả"
        description={`Đạt từ ${g(quiz.gradepass)}/${g(quiz.grade)} · Tính điểm theo lần cao nhất · ${quiz.attempts || "Không giới hạn"} lượt`}
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
            <Download /> Xuất Excel
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Đã làm" value={`${report.attempted}/${enrolled}`} hint="Học viên đã nộp ít nhất 1 lượt" icon={Users} />
        <StatCard label="Đạt" value={report.passed} hint={report.attempted ? `${Math.round((report.passed / report.attempted) * 100)}% người đã làm` : "Chưa có lượt làm"} icon={CheckCircle2} tone="success" />
        <StatCard label="Điểm trung bình" value={g(report.average)} hint={`Trên thang ${g(quiz.grade)}, lấy điểm cao nhất mỗi người`} icon={BarChart3} />
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">Câu sai nhiều nhất</p>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-soft text-destructive">
              <XCircle className="size-[18px]" />
            </span>
          </div>
          {hardest ? (
            <>
              <p className="mt-1 text-2xl font-bold">
                Câu {hardest.slot} <span className="text-base font-medium text-muted-foreground">sai {Math.round((hardest.wrong / hardest.total) * 100)}%</span>
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{stripHtml(hardest.text)}</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      {report.mostMissed.length > 1 && (
        <div className="mb-5 rounded-xl border bg-card p-4 shadow-xs">
          <p className="mb-2 text-sm font-semibold">Câu hay sai (tính trên mọi lượt nộp)</p>
          <ol className="space-y-1.5">
            {report.mostMissed.slice(0, 5).map((m) => (
              <li key={m.slot} className="flex items-center gap-3 text-sm">
                <span className="w-14 shrink-0 font-medium">Câu {m.slot}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{stripHtml(m.text)}</span>
                <span className="shrink-0 tabular-nums">
                  {m.wrong}/{m.total} lượt sai
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <FormSection title="Lọc kết quả" description="Mặc định: học viên đã làm bài." className="mb-5">
        <Field label="Hiện lượt làm của" htmlFor="r-who">
          <NativeSelect id="r-who" className="w-auto" value={who} onChange={(e) => setWho(e.target.value as typeof who)}>
            <option value="attempted">Học viên đã làm</option>
            <option value="notattempted">Học viên chưa làm</option>
            <option value="all">Mọi học viên ghi danh</option>
          </NativeSelect>
        </Field>
        <Field label="Trạng thái" htmlFor="r-state">
          <NativeSelect id="r-state" className="w-auto" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">Tất cả</option>
            {Object.entries(STATE).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Phòng ban" htmlFor="r-cohort">
          <NativeSelect id="r-cohort" className="w-auto" value={cohort} onChange={(e) => setCohort(e.target.value)}>
            <option value="all">Mọi phòng ban</option>
            {ds.cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </FormSection>

      {rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Không có lượt làm phù hợp" description="Đổi bộ lọc để xem học viên khác." />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Học viên</Th>
                <Th>Phòng ban</Th>
                <Th className="text-right">Số lượt</Th>
                <Th className="text-right">Điểm cao nhất</Th>
                <Th>Trạng thái</Th>
                <Th>Nộp gần nhất</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const last = r.summary.attempts.at(-1);
                return (
                  <Tr key={r.user.id}>
                    <Td>
                      <p className="font-medium">{r.user.fullname}</p>
                      <p className="text-xs text-muted-foreground">{r.user.email}</p>
                    </Td>
                    <Td className="whitespace-nowrap">{userCohorts(ds, r.user.id).map((c) => c.name).join(", ")}</Td>
                    <Td className="text-right tabular-nums">
                      {r.summary.attempts.length}/{quiz.attempts || "∞"}
                    </Td>
                    <Td className={`text-right font-semibold tabular-nums ${r.summary.best == null ? "" : r.summary.passed ? "text-success" : "text-destructive"}`}>
                      {g(r.summary.best)}
                    </Td>
                    <Td>
                      <Badge variant={STATE[r.summary.state].variant}>{STATE[r.summary.state].label}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{last ? formatDateTime(last.timefinish) : "-"}</Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </div>
  );
}
