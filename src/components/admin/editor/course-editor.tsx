"use client";

/**
 * Admin CED-01 (dòng bài: icon + nhãn loại bằng chữ, chip hoàn thành), CED-02 (điều kiện mở dạng chip gọn),
 * CED-03 (không có nút Mark as done của người xem), CED-04 (nút Thêm bài học full width), CED-05 (kéo thả file),
 * CED-06 (tóm tắt đầu phần), CED-07 (Xem như học viên, Sửa hàng loạt, Cài đặt hoàn thành).
 * Moodle: /course/view.php?id={id} (Edit mode). Giữ cấu trúc Course index + danh sách phần, không phải wizard.
 */
import Link from "next/link";
import { useRef, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  FileUp,
  ListChecks,
  ListTree,
  Lock,
  MoreVertical,
  Pencil,
  Plus,
  SquareCheckBig,
  Trash2,
  UserRoundSearch,
  X,
} from "lucide-react";
import { MoodleHtml } from "@/components/common/moodle-html";
import { ModuleIcon } from "@/components/common/module-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  completionRule,
  courseSections,
  createModule,
  describeCondition,
  getAdminCourse,
  MOD_TYPE_LABEL,
  parseAvailability,
  sectionSummary,
} from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { cn, stripHtml } from "@/lib/utils";
import type { AdminModule, AdminSection } from "@/types/moodle-admin";
import { ConfirmDialog } from "../common/confirm-dialog";
import { Textarea } from "../common/form";
import { ActivityChooser } from "./activity-chooser";

const NOT_LESSON = new Set(["label", "qbank", "forum", "subsection"]);
const ACCEPT = ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx";

function AvailabilityChip({ json, editHref }: { json: string | null | undefined; editHref?: string }) {
  const { ds } = useAdmin();
  const conds = parseAvailability(json);
  if (!conds.length) return null;
  const texts = conds.map((c) => describeCondition(ds, c));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex max-w-full items-center gap-1 rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning hover:ring-1 hover:ring-warning/40"
        >
          <Lock className="size-3 shrink-0" />
          <span className="truncate">{texts[0].short}</span>
          {texts.length > 1 && <span>+{texts.length - 1}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Học viên chỉ mở được khi</DropdownMenuLabel>
        {texts.map((t, i) => (
          <p key={i} className="px-2 py-1 text-sm">
            {t.full}
          </p>
        ))}
        {editHref && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={editHref}>
                <Pencil /> Sửa điều kiện
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ModuleRow({
  courseId,
  m,
  editing,
  bulk,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  courseId: number;
  m: AdminModule;
  editing: boolean;
  bulk: boolean;
  selected: boolean;
  onSelect: (v: boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { ds, actions } = useAdmin();
  const editHref = `/admin/courses/${courseId}/modedit?update=${m.id}`;
  const rule = completionRule(ds, m);
  const hidden = m.visible === 0;

  if (m.modname === "label") {
    return (
      <li id={`cm-${m.id}`} className="flex scroll-mt-24 items-start gap-3 px-4 py-3">
        {bulk && <Checkbox checked={selected} onCheckedChange={(v) => onSelect(v === true)} aria-label={`Chọn ${m.name}`} className="mt-1" />}
        <div className="min-w-0 flex-1 rounded-lg bg-muted/50 px-3 py-2 text-sm">
          <p className="mb-1 text-xs font-medium text-muted-foreground">{MOD_TYPE_LABEL.label}</p>
          <MoodleHtml html={m.description ?? ""} />
        </div>
        {editing && !bulk && <RowMenu editHref={editHref} m={m} onDelete={onDelete} onDuplicate={onDuplicate} onToggle={() => actions.updateModule(m.id, { visible: hidden ? 1 : 0 })} />}
      </li>
    );
  }

  return (
    <li id={`cm-${m.id}`} className={cn("flex scroll-mt-24 items-start gap-3 px-4 py-3", hidden && "bg-muted/30")}>
      {bulk && <Checkbox checked={selected} onCheckedChange={(v) => onSelect(v === true)} aria-label={`Chọn ${m.name}`} className="mt-2.5" />}
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", m.modname === "quiz" ? "bg-warning-soft text-warning" : "bg-brand-50 text-brand-600", hidden && "opacity-60")}>
        <ModuleIcon modname={m.modname} className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          {editing ? (
            <Link href={editHref} className={cn("font-medium hover:text-primary", hidden && "text-muted-foreground")}>
              {m.name}
            </Link>
          ) : (
            <span className={cn("font-medium", hidden && "text-muted-foreground")}>{m.name}</span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">{MOD_TYPE_LABEL[m.modname]}</span>
          {rule && (
            <Badge variant="secondary" title="Điều kiện hoàn thành">
              <CheckCircle2 /> {rule}
            </Badge>
          )}
          {m.completion === 0 && !NOT_LESSON.has(m.modname) && <Badge variant="muted">Không tính hoàn thành</Badge>}
          <AvailabilityChip json={m.availability} editHref={editing ? `${editHref}#dieu-kien` : undefined} />
          {hidden && (
            <Badge variant="muted">
              <EyeOff /> Ẩn với học viên
            </Badge>
          )}
        </div>
      </div>
      {editing && !bulk && (
        <RowMenu editHref={editHref} m={m} onDelete={onDelete} onDuplicate={onDuplicate} onToggle={() => actions.updateModule(m.id, { visible: hidden ? 1 : 0 })} />
      )}
    </li>
  );
}

function RowMenu({
  editHref,
  m,
  onDelete,
  onDuplicate,
  onToggle,
}: {
  editHref: string;
  m: AdminModule;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggle: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label={`Hành động với ${m.name}`}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={editHref}>
            <Pencil /> Sửa cài đặt
          </Link>
        </DropdownMenuItem>
        {m.modname === "quiz" && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/admin/quiz/${m.id}/edit`}>
                <ListChecks /> Câu hỏi
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/quiz/${m.id}/results`}>
                <SquareCheckBig /> Kết quả
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onSelect={onToggle}>
          {m.visible === 0 ? <Eye /> : <EyeOff />} {m.visible === 0 ? "Hiện với học viên" : "Ẩn với học viên"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDuplicate}>
          <Copy /> Nhân bản
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2 /> Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg border border-dashed px-4 py-3 text-center text-xs text-muted-foreground transition-colors",
        over && "border-primary bg-brand-50 text-brand-700",
      )}
    >
      <FileUp className="size-4" />
      <span>Kéo thả file PDF, PowerPoint, Word vào đây, mỗi file thành một bài Tài liệu.</span>
      <button type="button" className="font-medium text-primary hover:underline" onClick={() => input.current?.click()}>
        Chọn file
      </button>
      <input
        ref={input}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
    </div>
  );
}

function SectionEditDialog({ courseId, section, onClose }: { courseId: number; section: AdminSection; onClose: () => void }) {
  const { actions } = useAdmin();
  const [name, setName] = useState(section.name);
  const [summary, setSummary] = useState(stripHtml(section.summary));
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sửa phần</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="sec-name" className="text-sm font-medium">
              Tên phần
            </label>
            <Input id="sec-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sec-sum" className="text-sm font-medium">
              Tóm tắt
            </label>
            <Textarea id="sec-sum" value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              actions.updateSection(courseId, section.section, { name: name.trim(), summary: summary.trim() ? `<p>${summary.trim()}</p>` : "" });
              onClose();
            }}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CourseIndex({ sections }: { sections: AdminSection[] }) {
  return (
    <nav aria-label="Mục lục khóa" className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl border bg-card p-3 shadow-xs lg:block">
      <p className="mb-2 flex items-center gap-2 px-2 text-sm font-semibold">
        <ListTree className="size-4" /> Mục lục khóa
      </p>
      <ol className="space-y-2">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#phan-${s.section}`} className={cn("block rounded-md px-2 py-1 text-sm font-medium hover:bg-muted", s.visible === 0 && "text-muted-foreground")}>
              {s.name}
            </a>
            <ol className="mt-0.5 space-y-0.5 border-l pl-2 ml-3">
              {s.modules
                .filter((m) => m.modname !== "label")
                .map((m) => (
                  <li key={m.id}>
                    <a
                      href={`#cm-${m.id}`}
                      className={cn("block truncate rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground", m.visible === 0 && "italic")}
                    >
                      {m.name}
                    </a>
                  </li>
                ))}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CourseEditor({ courseId }: { courseId: number }) {
  const { ds, state, actions } = useAdmin();
  const course = getAdminCourse(ds, courseId)!;
  const sections = courseSections(ds, courseId);
  const editing = state?.editing ?? true;
  const [chooser, setChooser] = useState<number | null>(null);
  const [bulk, setBulk] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirm, setConfirm] = useState<{ ids: number[]; label: string } | null>(null);
  const [editSection, setEditSection] = useState<AdminSection | null>(null);
  const [notice, setNotice] = useState("");
  const isBulk = bulk && editing;

  const addFiles = (section: number, files: File[]) => {
    const ok = files.filter((f) => /\.(pdf|pptx?|docx?|xlsx?)$/i.test(f.name));
    for (const f of ok) {
      const id = newId();
      actions.addModule(
        courseId,
        section,
        createModule(id, "resource", f.name.replace(/\.[^.]+$/, ""), {
          contents: [{ type: "file", filename: f.name, fileurl: "", filesize: f.size, mimetype: f.type }],
        }),
      );
    }
    setNotice(
      ok.length
        ? `Đã tạo ${ok.length} bài Tài liệu từ file.${files.length > ok.length ? ` Bỏ qua ${files.length - ok.length} file không đúng định dạng.` : ""}`
        : "Chưa tạo bài: chỉ nhận PDF, PowerPoint, Word, Excel.",
    );
  };

  const duplicate = (section: number, m: AdminModule) => {
    const id = newId();
    actions.addModule(courseId, section, { ...m, id, instance: id, name: `${m.name} (bản sao)`, url: `/mod/${m.modname}/view.php?id=${id}` });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button variant="outline" asChild={course.visible === 1} disabled={course.visible !== 1} title={course.visible !== 1 ? "Khóa đang ẩn, chưa có trên cổng học viên" : undefined}>
          {course.visible === 1 ? (
            <Link href={`/courses/${courseId}`} target="_blank">
              <UserRoundSearch /> Xem như học viên
            </Link>
          ) : (
            <>
              <UserRoundSearch /> Xem như học viên
            </>
          )}
        </Button>
        {editing && (
          <Button
            variant={isBulk ? "secondary" : "outline"}
            onClick={() => {
              setBulk(!bulk);
              setSelected([]);
            }}
            aria-pressed={isBulk}
          >
            <SquareCheckBig /> Sửa hàng loạt
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href={`/admin/courses/${courseId}/completion`}>
            <ListChecks /> Cài đặt hoàn thành
          </Link>
        </Button>
        {!editing && <p className="text-sm text-muted-foreground">Bật Chế độ chỉnh sửa ở góc phải để thêm, sửa bài.</p>}
      </div>

      {isBulk && (
        <div className="sticky top-16 z-20 mb-4 flex flex-wrap items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-md">
          <span className="mr-auto text-sm font-medium">Đã chọn {selected.length} bài</span>
          <Button size="sm" variant="outline" disabled={!selected.length} onClick={() => selected.forEach((id) => actions.updateModule(id, { visible: 1 }))}>
            <Eye /> Hiện
          </Button>
          <Button size="sm" variant="outline" disabled={!selected.length} onClick={() => selected.forEach((id) => actions.updateModule(id, { visible: 0 }))}>
            <EyeOff /> Ẩn
          </Button>
          <Button size="sm" variant="outline" disabled={!selected.length} onClick={() => setConfirm({ ids: selected, label: `${selected.length} bài đã chọn` })}>
            <Trash2 /> Xóa
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setBulk(false)}>
            <X /> Xong
          </Button>
        </div>
      )}

      {notice && (
        <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-success-soft px-4 py-2.5 text-sm text-success">
          {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Đóng">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <CourseIndex sections={sections} />
        <div className="min-w-0 space-y-5">
          {sections.map((s) => {
            const sum = sectionSummary(s);
            return (
              <section key={s.id} id={`phan-${s.section}`} className={cn("scroll-mt-24 rounded-xl border bg-card shadow-xs", s.visible === 0 && "border-dashed")}>
                <div className="flex items-start gap-2 border-b px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <h2 className={cn("font-semibold", s.visible === 0 && "text-muted-foreground")}>{s.name}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span>
                        {sum.lessons} bài{sum.quizzes ? ` · ${sum.quizzes} bài kiểm tra` : ""}
                      </span>
                      <AvailabilityChip json={s.availability} />
                      {s.visible === 0 ? (
                        <Badge variant="muted">
                          <EyeOff /> Đang ẩn
                        </Badge>
                      ) : (
                        s.section > 0 && <Badge variant="success">Đang hiển thị</Badge>
                      )}
                    </div>
                    {s.summary && <p className="mt-1.5 text-sm text-muted-foreground">{stripHtml(s.summary)}</p>}
                  </div>
                  {editing && s.section > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8" aria-label={`Hành động với ${s.name}`}>
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditSection(s)}>
                          <Pencil /> Sửa tên và tóm tắt
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => actions.updateSection(courseId, s.section, { visible: s.visible === 0 ? 1 : 0 })}>
                          {s.visible === 0 ? <Eye /> : <EyeOff />} {s.visible === 0 ? "Hiện phần" : "Ẩn phần"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {s.modules.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">Phần này chưa có bài.</p>
                ) : (
                  <ul className="divide-y">
                    {s.modules
                      .filter((m) => m.modname !== "qbank")
                      .map((m) => (
                        <ModuleRow
                          key={m.id}
                          courseId={courseId}
                          m={m}
                          editing={editing}
                          bulk={isBulk}
                          selected={selected.includes(m.id)}
                          onSelect={(v) => setSelected((cur) => (v ? [...cur, m.id] : cur.filter((x) => x !== m.id)))}
                          onDelete={() => setConfirm({ ids: [m.id], label: `"${m.name}"` })}
                          onDuplicate={() => duplicate(s.section, m)}
                        />
                      ))}
                  </ul>
                )}
                {editing && !isBulk && (
                  <div className="space-y-2 border-t px-4 py-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Button variant="outline-primary" className="flex-1 basis-60" onClick={() => setChooser(s.section)}>
                        <Plus /> Thêm bài học
                      </Button>
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={() => actions.addModule(courseId, s.section, createModule(newId(), "subsection", "Phần con mới"))}
                      >
                        Thêm phần con
                      </button>
                    </div>
                    <DropZone onFiles={(f) => addFiles(s.section, f)} />
                  </div>
                )}
              </section>
            );
          })}
          {editing && !isBulk && (
            <Button variant="outline" className="w-full" onClick={() => actions.addSection(courseId)}>
              <Plus /> Thêm phần
            </Button>
          )}
        </div>
      </div>

      <ActivityChooser courseId={courseId} section={chooser} open={chooser !== null} onOpenChange={(v) => !v && setChooser(null)} />
      {confirm && (
        <ConfirmDialog
          open
          onOpenChange={(v) => !v && setConfirm(null)}
          title="Xóa bài học?"
          description={`${confirm.label} sẽ chuyển vào Thùng rác của khóa, khôi phục được trong 7 ngày.`}
          confirmLabel="Xóa"
          destructive
          onConfirm={() => {
            confirm.ids.forEach((id) => actions.deleteModule(id));
            setSelected([]);
          }}
        />
      )}
      {editSection && <SectionEditDialog courseId={courseId} section={editSection} onClose={() => setEditSection(null)} />}
    </div>
  );
}
