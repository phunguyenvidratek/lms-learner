"use client";

/**
 * Admin RPT-03 (báo cáo hoàn thành dễ đọc: full width, không xoay chữ, % mỗi học viên, màu trạng thái),
 * RPT-04 (sổ điểm ở chế độ xem, màu đạt/không đạt, chỉ nhập điểm khi bật), SHELL-05 (tab Báo cáo của khóa).
 * Moodle: /report/view.php?courseid=, /report/progress/index.php?course=, /grade/report/grader/index.php?id=
 */
import Link from "next/link";
import { useState } from "react";
import { BarChart3, Check, ClipboardList, Download, FileBarChart, Lock, Users, X } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { courseRoster, courseSections, effectiveQuiz, learnerState, MOD_TYPE_LABEL, submissionsOf, userCohorts } from "@/lib/admin";
import { summarizeQuiz } from "@/lib/learning";
import { useAdmin } from "@/lib/store/admin-store";
import { cn } from "@/lib/utils";
import { downloadCsv, PercentBar, SearchBox, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { NativeSelect } from "../common/form";
import { Switch } from "../common/switch";
import { SectionHeader } from "../layout/page-header";

export function CourseReportsView({ courseId }: { courseId: number }) {
  const { ds } = useAdmin();
  const quizzes = courseSections(ds, courseId).flatMap((s) => s.modules.filter((m) => m.modname === "quiz"));
  const items = [
    { href: `/admin/courses/${courseId}/reports/progress`, icon: BarChart3, title: "Hoàn thành bài", desc: "Học viên nào đã xong bài nào, % hoàn thành mỗi người." },
    { href: `/admin/courses/${courseId}/grades`, icon: FileBarChart, title: "Sổ điểm", desc: "Điểm từng bài kiểm tra, bài nộp và điểm khóa." },
    { href: `/admin/courses/${courseId}/participants`, icon: Users, title: "Học viên và tiến độ", desc: "Phòng ban, ngày ghi danh, trạng thái hoàn thành khóa." },
  ];
  return (
    <div>
      <SectionHeader title="Báo cáo của khóa" />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="group rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <i.icon className="size-6 text-brand-600" />
            <p className="mt-3 font-semibold group-hover:text-primary">{i.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
          </Link>
        ))}
      </div>
      {quizzes.length > 0 && (
        <>
          <h3 className="mt-8 mb-3 font-semibold">Kết quả bài kiểm tra</h3>
          <ul className="divide-y rounded-xl border bg-card shadow-xs">
            {quizzes.map((q) => (
              <li key={q.id}>
                <Link href={`/admin/quiz/${q.id}/results`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
                  <ClipboardList className="size-4 text-warning" />
                  <span className="flex-1 text-sm font-medium">{q.name}</span>
                  <span className="text-sm text-primary">Xem kết quả</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function ProgressReportView({ courseId }: { courseId: number }) {
  const { ds } = useAdmin();
  const [q, setQ] = useState("");
  const [cohort, setCohort] = useState("all");
  const sections = courseSections(ds, courseId)
    .map((s) => ({ s, mods: s.modules.filter((m) => m.completion > 0 && !["label", "qbank", "forum"].includes(m.modname)) }))
    .filter((x) => x.mods.length);
  const cols = sections.flatMap(({ s, mods }) => mods.map((m, i) => ({ s, m, code: `${s.section}.${i + 1}` })));
  const term = q.trim().toLowerCase();
  const rows = courseRoster(ds, courseId).filter(
    (r) =>
      !r.suspended &&
      (!term || r.user.fullname.toLowerCase().includes(term)) &&
      (cohort === "all" || userCohorts(ds, r.user.id).some((c) => String(c.id) === cohort)),
  );
  const stateOf = (rowView: (typeof rows)[number]["view"], cmid: number) => {
    for (const s of rowView?.sections ?? []) {
      const m = s.modules.find((x) => x.id === cmid);
      if (m) return { st: m.completiondata?.state ?? 0, locked: !m.uservisible };
    }
    return { st: 0, locked: false };
  };

  const exportCsv = () =>
    downloadCsv(`hoan-thanh-khoa-${courseId}.csv`, [
      ["Học viên", "Phòng ban", ...cols.map((c) => `${c.code} ${c.m.name}`), "% hoàn thành"],
      ...rows.map((r) => [
        r.user.fullname,
        userCohorts(ds, r.user.id).map((c) => c.name).join(", "),
        ...cols.map((c) => {
          const { st } = stateOf(r.view, c.m.id);
          return st === 1 || st === 2 ? "Xong" : st === 3 ? "Chưa đạt" : "";
        }),
        `${r.progress}%`,
      ]),
    ]);

  return (
    <div>
      <SectionHeader
        title="Hoàn thành bài"
        description="Mỗi ô là một bài. Rê chuột lên mã bài để xem tên."
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
            <Download /> Xuất Excel
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Tìm học viên" />
        <NativeSelect aria-label="Phòng ban" className="w-auto" value={cohort} onChange={(e) => setCohort(e.target.value)}>
          <option value="all">Mọi phòng ban</option>
          {ds.cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
        <div className="ml-auto flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="flex size-4 items-center justify-center rounded bg-success text-white">
              <Check className="size-3" />
            </span>
            Hoàn thành
          </span>
          <span className="flex items-center gap-1">
            <span className="flex size-4 items-center justify-center rounded bg-destructive text-white">
              <X className="size-3" />
            </span>
            Chưa đạt
          </span>
          <span className="flex items-center gap-1">
            <span className="size-4 rounded border bg-muted" /> Chưa xong
          </span>
          <span className="flex items-center gap-1">
            <Lock className="size-3.5" /> Chưa mở
          </span>
        </div>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={Users} title="Không có học viên" description="Khóa chưa có học viên hoặc bộ lọc không khớp ai." />
      ) : (
        <TableWrap>
          <Table className="text-xs">
            <thead>
              <tr>
                <Th rowSpan={2} className="sticky left-0 z-10 min-w-44 bg-muted">
                  Học viên
                </Th>
                {sections.map(({ s, mods }) => (
                  <Th key={s.id} colSpan={mods.length} className="border-l text-center">
                    {s.name.split(":")[0]}
                  </Th>
                ))}
                <Th rowSpan={2} className="border-l text-right">
                  Hoàn thành
                </Th>
              </tr>
              <tr>
                {cols.map((c, i) => (
                  <Th key={c.m.id} className={cn("px-1 text-center font-medium", (i === 0 || cols[i - 1].s.id !== c.s.id) && "border-l")}>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">{c.code}</TooltipTrigger>
                      <TooltipContent>
                        {MOD_TYPE_LABEL[c.m.modname]}: {c.m.name}
                      </TooltipContent>
                    </Tooltip>
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Tr key={r.user.id}>
                  <Td className="sticky left-0 z-10 bg-card py-2 text-sm font-medium whitespace-nowrap">{r.user.fullname}</Td>
                  {cols.map((c, i) => {
                    const { st, locked } = stateOf(r.view, c.m.id);
                    return (
                      <Td key={c.m.id} className={cn("px-1 py-2 text-center", (i === 0 || cols[i - 1].s.id !== c.s.id) && "border-l")}>
                        {st === 1 || st === 2 ? (
                          <span className="mx-auto flex size-5 items-center justify-center rounded bg-success text-white" aria-label="Hoàn thành">
                            <Check className="size-3.5" />
                          </span>
                        ) : st === 3 ? (
                          <span className="mx-auto flex size-5 items-center justify-center rounded bg-destructive text-white" aria-label="Chưa đạt">
                            <X className="size-3.5" />
                          </span>
                        ) : locked ? (
                          <Lock className="mx-auto size-3.5 text-muted-foreground" aria-label="Chưa mở" />
                        ) : (
                          <span className="mx-auto block size-5 rounded border bg-muted" aria-label="Chưa xong" />
                        )}
                      </Td>
                    );
                  })}
                  <Td className="border-l py-2">
                    <PercentBar value={r.progress} className="justify-end" />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </div>
  );
}

const g = (n: number | null | undefined) => (n == null ? "-" : n.toFixed(2).replace(".", ","));

export function GraderView({ courseId }: { courseId: number }) {
  const { ds, actions } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const mods = courseSections(ds, courseId).flatMap((s) => s.modules.filter((m) => m.modname === "quiz" || m.modname === "assign"));
  const rows = courseRoster(ds, courseId).filter((r) => !r.suspended);

  return (
    <div>
      <SectionHeader
        title="Sổ điểm"
        description="Xanh là đạt, đỏ là chưa đạt. Điểm bài kiểm tra chấm tự động."
        actions={
          <label className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium">
            <Switch checked={editing} onCheckedChange={(v) => { setEditing(v); setSaved(false); }} label="Bật nhập điểm" />
            Bật nhập điểm
          </label>
        }
      />
      {saved && (
        <p role="status" className="mb-4 rounded-lg bg-success-soft px-4 py-2.5 text-sm text-success">
          Đã lưu điểm.
        </p>
      )}
      {rows.length === 0 || mods.length === 0 ? (
        <EmptyState icon={FileBarChart} title={rows.length ? "Khóa chưa có bài tính điểm" : "Khóa chưa có học viên"} />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th className="sticky left-0 z-10 min-w-44 bg-muted">Học viên</Th>
                {mods.map((m) => (
                  <Th key={m.id} className="min-w-28 text-right whitespace-normal">
                    <span className="block text-[11px] font-normal">{MOD_TYPE_LABEL[m.modname]}</span>
                    {m.name}
                  </Th>
                ))}
                <Th className="text-right">Điểm khóa</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const bests: number[] = [];
                return (
                  <Tr key={r.user.id}>
                    <Td className="sticky left-0 z-10 bg-card font-medium whitespace-nowrap">{r.user.fullname}</Td>
                    {mods.map((m) => {
                      if (m.modname === "quiz") {
                        const quiz = effectiveQuiz(ds, m.id);
                        const summaryBest = summarizeQuiz(learnerState(ds, r.user.id), m.id)?.best ?? null;
                        if (summaryBest != null) bests.push(summaryBest);
                        return (
                          <Td key={m.id} className={cn("text-right font-semibold tabular-nums", summaryBest == null ? "text-muted-foreground" : summaryBest >= (quiz?.gradepass ?? 8) ? "text-success" : "text-destructive")}>
                            {g(summaryBest)}
                          </Td>
                        );
                      }
                      const sub = submissionsOf(ds, m.id).find((x) => x.userid === r.user.id);
                      const key = `${m.id}:${r.user.id}`;
                      if (editing && sub)
                        return (
                          <Td key={m.id} className="text-right">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              className="ml-auto h-8 w-20 text-right"
                              value={draft[key] ?? (sub.grade ?? "")}
                              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                              aria-label={`Điểm ${m.name} của ${r.user.fullname}`}
                            />
                          </Td>
                        );
                      return (
                        <Td key={m.id} className="text-right">
                          {!sub ? (
                            <span className="text-muted-foreground">-</span>
                          ) : sub.grade == null ? (
                            <Badge variant="warning">Chờ chấm</Badge>
                          ) : (
                            <span className={cn("font-semibold tabular-nums", sub.grade >= 50 ? "text-success" : "text-destructive")}>{sub.grade}/100</span>
                          )}
                        </Td>
                      );
                    })}
                    <Td className="text-right font-semibold tabular-nums">{bests.length ? g(Math.round((bests.reduce((a, b) => a + b, 0) / bests.length) * 100) / 100) : "-"}</Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
      {editing && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => { setDraft({}); setEditing(false); }}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              Object.entries(draft).forEach(([k, v]) => {
                const [cmid, userid] = k.split(":").map(Number);
                if (v !== "" && !Number.isNaN(Number(v))) actions.gradeAssign(cmid, userid, Math.min(100, Math.max(0, Number(v))));
              });
              setDraft({});
              setEditing(false);
              setSaved(true);
            }}
          >
            Lưu điểm
          </Button>
        </div>
      )}
    </div>
  );
}
