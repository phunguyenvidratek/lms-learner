"use client";

/**
 * Admin SHELL-05: hai mục còn lại trong "Thêm" của khóa.
 * - Dùng lại khóa (Import): chọn khóa nguồn, chọn nội dung, nhập. Moodle: /backup/import.php?id={courseId}
 * - Thùng rác: khôi phục hoặc xóa hẳn bài đã xóa. Moodle: /admin/tool/recyclebin/index.php?contextid=
 */
import Link from "next/link";
import { useState } from "react";
import { Check, RotateCcw, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ModuleIcon } from "@/components/common/module-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { adminCourseContents, courseSections, MOD_TYPE_LABEL } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { formatDateTime } from "@/lib/utils";
import type { AdminModule } from "@/types/moodle-admin";
import { SearchBox, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { ConfirmDialog } from "../common/confirm-dialog";
import { StickySaveBar } from "../common/form";
import { SectionHeader } from "../layout/page-header";

export function ReuseView({ courseId }: { courseId: number }) {
  const { ds, actions } = useAdmin();
  const [source, setSource] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(0);
  const term = q.trim().toLowerCase();
  const courses = ds.courses.filter((c) => c.id !== courseId && (!term || c.fullname.toLowerCase().includes(term) || c.shortname.toLowerCase().includes(term)));
  const srcSections = source ? courseSections(ds, source).filter((s) => s.modules.some((m) => m.modname !== "qbank")) : [];
  const target = courseSections(ds, courseId);

  if (done)
    return (
      <EmptyState
        icon={Check}
        title={`Đã nhập ${done} bài vào khóa`}
        description="Bài được thêm vào cuối các phần cùng số thứ tự."
        action={
          <Button asChild>
            <Link href={`/admin/courses/${courseId}/edit`}>Xem nội dung khóa</Link>
          </Button>
        }
      />
    );

  return (
    <div>
      <SectionHeader title="Dùng lại khóa" description={step === 0 ? "Bước 1/2: chọn khóa nguồn." : "Bước 2/2: chọn phần và bài cần nhập."} />
      {step === 0 ? (
        <>
          <div className="mb-3">
            <SearchBox value={q} onChange={setQ} placeholder="Tìm khóa nguồn" />
          </div>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th className="w-10" />
                  <Th>Khóa học</Th>
                  <Th>Danh mục</Th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <input type="radio" name="source" className="size-4 accent-primary" checked={source === c.id} onChange={() => setSource(c.id)} aria-label={c.fullname} />
                    </Td>
                    <Td className="font-medium">{c.fullname}</Td>
                    <Td className="text-muted-foreground">{c.coursecategory}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          <StickySaveBar>
            <Button
              disabled={!source}
              onClick={() => {
                setPicked(adminCourseContents(source!).flatMap((s) => s.modules.filter((m) => m.modname !== "qbank").map((m) => m.id)));
                setStep(1);
              }}
            >
              Tiếp tục
            </Button>
          </StickySaveBar>
        </>
      ) : (
        <>
          <div className="space-y-3">
            {srcSections.map((s) => {
              const mods = s.modules.filter((m) => m.modname !== "qbank");
              const all = mods.every((m) => picked.includes(m.id));
              return (
                <div key={s.id} className="rounded-xl border bg-card p-4 shadow-xs">
                  <label className="flex items-center gap-2 font-medium">
                    <Checkbox
                      checked={all}
                      onCheckedChange={(v) => setPicked((cur) => (v === true ? [...new Set([...cur, ...mods.map((m) => m.id)])] : cur.filter((x) => !mods.some((m) => m.id === x))))}
                    />
                    {s.name}
                  </label>
                  <div className="mt-2 grid gap-1.5 pl-6 sm:grid-cols-2">
                    {mods.map((m) => (
                      <label key={m.id} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={picked.includes(m.id)} onCheckedChange={(v) => setPicked((cur) => (v === true ? [...cur, m.id] : cur.filter((x) => x !== m.id)))} />
                        <ModuleIcon modname={m.modname} className="size-4 text-muted-foreground" />
                        <span className="truncate">{m.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <StickySaveBar note={`${picked.length} bài được chọn`}>
            <Button variant="ghost" onClick={() => setStep(0)}>
              Quay lại
            </Button>
            <Button
              disabled={!picked.length}
              onClick={() => {
                let n = 0;
                for (const s of srcSections) {
                  const sectionNo = target.some((t) => t.section === s.section) ? s.section : 0;
                  for (const m of s.modules.filter((x) => picked.includes(x.id))) {
                    const id = newId() + n;
                    actions.addModule(courseId, sectionNo, { ...(m as AdminModule), id, instance: id, availability: null, url: `/mod/${m.modname}/view.php?id=${id}` });
                    n++;
                  }
                }
                setDone(n);
              }}
            >
              Nhập {picked.length} bài
            </Button>
          </StickySaveBar>
        </>
      )}
    </div>
  );
}

export function RecycleBinView({ courseId }: { courseId: number }) {
  const { ds, state, actions } = useAdmin();
  const [purge, setPurge] = useState<number | null>(null);
  const recycle = state?.recycle ?? {};
  // Lấy thông tin bài đã xóa từ nội dung gốc + bài admin thêm (courseSections đã lọc bài xóa)
  const all = [
    ...adminCourseContents(courseId).flatMap((s) => s.modules.map((m) => ({ m: m as AdminModule, section: s.name }))),
    ...(state?.addedModules ?? []).filter((a) => a.courseid === courseId).map((a) => ({ m: a.module, section: courseSections(ds, courseId).find((s) => s.section === a.section)?.name ?? "" })),
  ];
  const items = all.filter((x) => recycle[x.m.id] != null).sort((a, b) => recycle[b.m.id] - recycle[a.m.id]);

  return (
    <div>
      <SectionHeader title="Thùng rác" description="Bài đã xóa trong 7 ngày gần nhất. Khôi phục để đưa bài về đúng phần cũ." />
      {items.length === 0 ? (
        <EmptyState icon={Trash2} title="Thùng rác trống" description="Bài bị xóa ở trang Nội dung sẽ nằm ở đây." />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Bài học</Th>
                <Th>Phần</Th>
                <Th>Xóa lúc</Th>
                <Th className="text-right">Hành động</Th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ m, section }) => (
                <Tr key={m.id}>
                  <Td>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{MOD_TYPE_LABEL[m.modname]}</p>
                  </Td>
                  <Td className="text-muted-foreground">{section}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{formatDateTime(recycle[m.id])}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => actions.restoreModule(m.id)}>
                        <RotateCcw /> Khôi phục
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setPurge(m.id)}>
                        <Trash2 /> Xóa hẳn
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
      {purge && (
        <ConfirmDialog
          open
          onOpenChange={(v) => !v && setPurge(null)}
          title="Xóa hẳn bài học?"
          description="Không khôi phục được nữa. Điểm và tiến độ của bài cũng bị xóa."
          confirmLabel="Xóa hẳn"
          destructive
          onConfirm={() => actions.purgeModule(purge)}
        />
      )}
    </div>
  );
}
