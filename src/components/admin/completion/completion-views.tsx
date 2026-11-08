"use client";

/**
 * Admin COMP-01 (câu tóm tắt quy tắc, cập nhật khi tick; nhóm có điều kiện mở sẵn),
 * COMP-02 (điều kiện ít dùng gom vào "Điều kiện khác" thu gọn),
 * COMP-03 (tab ngang: Hoàn thành khóa, Mặc định hoàn thành bài, Sửa hàng loạt).
 * Moodle: /course/completion.php?id=, /course/defaultcompletion.php?id=, /course/bulkcompletion.php?id=
 * Tính hoàn thành dùng chung buildAllCourses() của src/lib/learning.ts (qua courseCriteria/learnerCourseViews).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, ListChecks, Pencil } from "lucide-react";
import { ModuleIcon } from "@/components/common/module-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  completionRule,
  completionSentence,
  courseCriteria,
  courseSections,
  courseStats,
  defaultCompletion,
  MOD_TYPE_LABEL,
  roleName,
} from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { cn } from "@/lib/utils";
import type { ModName } from "@/types/moodle";
import type { AdminModule, CompletionCriteria } from "@/types/moodle-admin";
import { Table, TableWrap, Td, Th, Tr } from "../common/data";
import { CheckRow, DateTimeField, Field, FormSection, NativeSelect, StickySaveBar } from "../common/form";
import { CompletionEditor, type CompletionValue } from "../editor/completion-editor";
import { SectionHeader } from "../layout/page-header";

export function CompletionTabs({ courseId }: { courseId: number }) {
  const pathname = usePathname();
  const base = `/admin/courses/${courseId}/completion`;
  const tabs = [
    { href: base, label: "Hoàn thành khóa" },
    { href: `${base}/default`, label: "Mặc định hoàn thành bài" },
    { href: `${base}/bulk`, label: "Sửa hàng loạt" },
  ];
  return (
    <div className="mb-5 flex flex-wrap gap-1 rounded-lg bg-muted p-1" role="tablist">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          role="tab"
          aria-selected={pathname === t.href}
          className={cn("rounded-md px-3 py-1.5 text-sm font-medium", pathname === t.href ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

function TrackedList({ courseId, picked, onChange }: { courseId: number; picked: number[]; onChange: (ids: number[]) => void }) {
  const { ds } = useAdmin();
  const sections = courseSections(ds, courseId);
  const tracked = sections.flatMap((s) => s.modules.filter((m) => m.completion > 0));
  const allOn = tracked.length > 0 && tracked.every((m) => picked.includes(m.id));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <CheckRow checked={allOn} onChange={(v) => onChange(v ? tracked.map((m) => m.id) : [])} label={<span className="font-medium">Chọn tất cả ({tracked.length} bài)</span>} />
      </div>
      {sections.map((s) => {
        const mods = s.modules.filter((m) => m.completion > 0);
        if (!mods.length) return null;
        return (
          <div key={s.id}>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{s.name}</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {mods.map((m) => (
                <CheckRow
                  key={m.id}
                  checked={picked.includes(m.id)}
                  onChange={(v) => onChange(v ? [...picked, m.id] : picked.filter((x) => x !== m.id))}
                  label={m.name}
                  description={`${MOD_TYPE_LABEL[m.modname]} · ${completionRule(ds, m)}`}
                />
              ))}
            </div>
          </div>
        );
      })}
      {tracked.length === 0 && <p className="text-sm text-muted-foreground">Khóa chưa có bài nào theo dõi hoàn thành.</p>}
    </div>
  );
}

export function CourseCompletionView({ courseId }: { courseId: number }) {
  const { ds, actions } = useAdmin();
  const [c, setC] = useState<CompletionCriteria>(() => courseCriteria(ds, courseId));
  const [saved, setSaved] = useState(false);
  const set = (patch: Partial<CompletionCriteria>) => {
    setSaved(false);
    setC((cur) => ({ ...cur, ...patch }));
  };
  const stats = courseStats(ds, courseId);
  const otherActive = !!(c.date || c.enrolperiod || c.unenrol || c.selfcompletion || c.othercourses.length || c.roles.length);
  const courses = ds.courses.filter((x) => x.id !== courseId);

  return (
    <div>
      <CompletionTabs courseId={courseId} />
      <div className="mb-5 rounded-xl border-l-4 border-primary bg-card p-4 shadow-xs" aria-live="polite">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Quy tắc hiện tại</p>
        <p className="mt-1 font-medium">{completionSentence(ds, courseId, c)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Theo quy tắc đã lưu: {stats.completed}/{stats.students} học viên đã hoàn thành khóa.
        </p>
      </div>

      <div className="space-y-4">
        <FormSection title="Điều kiện chung" defaultOpen>
          <Field label="Học viên hoàn thành khóa khi">
            <NativeSelect className="w-auto" value={c.aggregation} onChange={(e) => set({ aggregation: Number(e.target.value) as 1 | 2 })}>
              <option value={1}>Đạt mọi điều kiện đã chọn</option>
              <option value={2}>Đạt một trong các điều kiện</option>
            </NativeSelect>
          </Field>
        </FormSection>

        <FormSection title="Hoàn thành bài học" defaultOpen badge={c.activities.length ? <Badge variant="secondary">{c.activities.length} bài</Badge> : undefined}>
          <Field label="Yêu cầu">
            <NativeSelect className="w-auto" value={c.activityaggregation} onChange={(e) => set({ activityaggregation: Number(e.target.value) as 1 | 2 })}>
              <option value={1}>Hoàn thành mọi bài đã chọn</option>
              <option value={2}>Hoàn thành một trong các bài</option>
            </NativeSelect>
          </Field>
          <TrackedList courseId={courseId} picked={c.activities} onChange={(ids) => set({ activities: ids })} />
        </FormSection>

        <FormSection title="Điểm khóa" defaultOpen={c.grade != null} badge={c.grade != null ? <Badge variant="secondary">Từ {c.grade}</Badge> : undefined}>
          <Field label="Điểm khóa tối thiểu" hint="Điểm khóa là trung bình điểm cao nhất của các bài kiểm tra, thang 10.">
            <div className="flex flex-wrap items-center gap-3">
              <CheckRow checked={c.grade != null} onChange={(v) => set({ grade: v ? 8 : null })} label="Bật" />
              <Input type="number" step="0.5" min={0} max={10} className="w-24" disabled={c.grade == null} value={c.grade ?? ""} onChange={(e) => set({ grade: Number(e.target.value) })} aria-label="Điểm tối thiểu" />
            </div>
          </Field>
        </FormSection>

        <FormSection title="Điều kiện khác" description="Ngày, thời gian ghi danh, hủy ghi danh, khóa khác, tự đánh dấu, người khác đánh dấu." defaultOpen={otherActive}>
          <Field label="Ngày" help="Khóa được tính hoàn thành từ ngày này.">
            <DateTimeField value={c.date ?? 0} onChange={(t) => set({ date: t || null })} />
          </Field>
          <Field label="Thời gian ghi danh">
            <div className="flex flex-wrap items-center gap-3">
              <CheckRow checked={c.enrolperiod != null} onChange={(v) => set({ enrolperiod: v ? 30 : null })} label="Bật" />
              <Input type="number" min={1} className="w-24" disabled={c.enrolperiod == null} value={c.enrolperiod ?? ""} onChange={(e) => set({ enrolperiod: Number(e.target.value) })} aria-label="Số ngày" />
              <span className="text-sm">ngày kể từ khi ghi danh</span>
            </div>
          </Field>
          <Field label="Hủy ghi danh">
            <CheckRow checked={c.unenrol} onChange={(v) => set({ unenrol: v })} label="Tính hoàn thành khi học viên bị hủy ghi danh" />
          </Field>
          <Field label="Hoàn thành khóa khác">
            <div className="grid gap-1.5 sm:grid-cols-2">
              {courses.map((x) => (
                <CheckRow
                  key={x.id}
                  checked={c.othercourses.includes(x.id)}
                  onChange={(v) => set({ othercourses: v ? [...c.othercourses, x.id] : c.othercourses.filter((y) => y !== x.id) })}
                  label={x.fullname}
                />
              ))}
            </div>
          </Field>
          <Field label="Học viên tự đánh dấu">
            <CheckRow checked={c.selfcompletion} onChange={(v) => set({ selfcompletion: v })} label="Cho học viên tự đánh dấu hoàn thành khóa" />
          </Field>
          <Field label="Người khác đánh dấu">
            <div className="space-y-1.5">
              {[1, 3, 4].map((r) => (
                <CheckRow key={r} checked={c.roles.includes(r)} onChange={(v) => set({ roles: v ? [...c.roles, r] : c.roles.filter((y) => y !== r) })} label={roleName(ds, r)} />
              ))}
            </div>
          </Field>
        </FormSection>
      </div>

      <StickySaveBar note={saved ? "Đã lưu. Báo cáo tiến độ đã tính lại theo quy tắc mới." : undefined}>
        <Button variant="ghost" onClick={() => setC(courseCriteria(ds, courseId))}>
          Hủy thay đổi
        </Button>
        <Button
          onClick={() => {
            actions.setCompletion(courseId, c);
            setSaved(true);
          }}
        >
          Lưu thay đổi
        </Button>
      </StickySaveBar>
    </div>
  );
}

const DEFAULT_TYPES: ModName[] = ["drivevideo", "page", "resource", "url", "quiz", "assign", "feedback"];

function toValue(m: Partial<AdminModule>): CompletionValue {
  return {
    completion: m.completion ?? 0,
    completionview: !!m.completionview,
    completionpercent: m.completionpercent ?? 0,
    completionusegrade: !!m.completionusegrade,
    completionpassgrade: !!m.completionpassgrade,
    completionattemptsexhausted: false,
    completionexpected: 0,
  };
}

function fromValue(v: CompletionValue) {
  return {
    completion: v.completion,
    completionview: (v.completion === 2 && v.completionview ? 1 : 0) as 0 | 1,
    completionpercent: v.completion === 2 ? v.completionpercent : 0,
    completionusegrade: (v.completion === 2 && v.completionusegrade ? 1 : 0) as 0 | 1,
    completionpassgrade: (v.completion === 2 && v.completionpassgrade ? 1 : 0) as 0 | 1,
  };
}

function ruleText(ds: ReturnType<typeof useAdmin>["ds"], modname: ModName, m: Partial<AdminModule>) {
  return completionRule(ds, { id: -1, instance: -1, name: "", modname, uservisible: true, visible: 1, completion: 0, ...m } as AdminModule) ?? "Không theo dõi";
}

export function DefaultCompletionView({ courseId }: { courseId: number }) {
  const { ds, actions } = useAdmin();
  const [editing, setEditing] = useState<ModName | null>(null);
  const [value, setValue] = useState<CompletionValue | null>(null);
  const current = (t: ModName) => ds.admin?.defaultCompletion[`${courseId}:${t}`] ?? defaultCompletion(t);
  return (
    <div>
      <CompletionTabs courseId={courseId} />
      <SectionHeader title="Mặc định hoàn thành bài" description="Điều kiện đặt sẵn khi tạo bài mới trong khóa này. Bài đã có không đổi." />
      <ul className="divide-y rounded-xl border bg-card shadow-xs">
        {DEFAULT_TYPES.map((t) => (
          <li key={t} className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <ModuleIcon modname={t} className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{MOD_TYPE_LABEL[t]}</p>
                <p className="text-sm text-muted-foreground">{ruleText(ds, t, current(t))}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(editing === t ? null : t);
                  setValue(toValue(current(t)));
                }}
              >
                <Pencil /> Sửa
              </Button>
            </div>
            {editing === t && value && (
              <div className="mt-4 space-y-4 rounded-lg border bg-muted/20 p-4">
                <CompletionEditor modname={t} value={value} onChange={setValue} />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setEditing(null)}>
                    Hủy
                  </Button>
                  <Button
                    onClick={() => {
                      actions.setDefaultCompletion(courseId, t, fromValue(value));
                      setEditing(null);
                    }}
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BulkCompletionView({ courseId }: { courseId: number }) {
  const { ds, actions } = useAdmin();
  const sections = courseSections(ds, courseId);
  const mods = sections.flatMap((s) => s.modules.filter((m) => !["label", "qbank", "forum", "subsection"].includes(m.modname)).map((m) => ({ s, m })));
  const [picked, setPicked] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<CompletionValue>(toValue({ completion: 2, completionview: 1 }));
  const types = new Set(mods.filter((x) => picked.includes(x.m.id)).map((x) => x.m.modname));
  const commonType: ModName = types.size === 1 ? [...types][0] : "page";

  return (
    <div>
      <CompletionTabs courseId={courseId} />
      <SectionHeader
        title="Sửa hàng loạt điều kiện hoàn thành"
        description="Chọn các bài rồi đặt cùng một điều kiện."
        actions={
          <Button disabled={!picked.length} onClick={() => setOpen(true)}>
            <ListChecks /> Sửa {picked.length || ""} bài đã chọn
          </Button>
        }
      />
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">
                <Checkbox
                  checked={picked.length > 0 && picked.length === mods.length}
                  onCheckedChange={(v) => setPicked(v === true ? mods.map((x) => x.m.id) : [])}
                  aria-label="Chọn tất cả"
                />
              </Th>
              <Th>Bài học</Th>
              <Th>Phần</Th>
              <Th>Điều kiện hoàn thành</Th>
            </tr>
          </thead>
          <tbody>
            {mods.map(({ s, m }) => (
              <Tr key={m.id}>
                <Td>
                  <Checkbox
                    checked={picked.includes(m.id)}
                    onCheckedChange={(v) => setPicked((cur) => (v === true ? [...cur, m.id] : cur.filter((x) => x !== m.id)))}
                    aria-label={`Chọn ${m.name}`}
                  />
                </Td>
                <Td>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{MOD_TYPE_LABEL[m.modname]}</p>
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">{s.name.split(":")[0]}</Td>
                <Td>
                  {completionRule(ds, m) ? (
                    <Badge variant="secondary">
                      <CheckCircle2 /> {completionRule(ds, m)}
                    </Badge>
                  ) : (
                    <Badge variant="muted">Không theo dõi</Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Điều kiện cho {picked.length} bài</DialogTitle>
          </DialogHeader>
          {types.size > 1 && <p className="text-sm text-muted-foreground">Các bài khác loại nên chỉ hiện điều kiện dùng chung.</p>}
          <CompletionEditor modname={commonType} value={value} onChange={setValue} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                picked.forEach((id) => actions.updateModule(id, fromValue(value)));
                setOpen(false);
                setPicked([]);
              }}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
