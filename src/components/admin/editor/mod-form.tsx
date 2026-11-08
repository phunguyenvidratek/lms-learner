"use client";

/**
 * Admin ACT-02 (Bài video Google Drive, hướng A: tên, link Drive, thời lượng, xem trước; CHƯA CHỐT),
 * ACT-03 (nhóm đã tắt ở site không hiện), ACT-04 (Chung, Nội dung, Hoàn thành, Điều kiện truy cập lên trước, mở sẵn;
 * Giao diện, Cài đặt chung thu gọn cuối), ACT-05 (thanh Lưu cố định), ACT-06 (mặc định hoàn thành theo loại),
 * ACT-07 (Mở sau bài trước).
 * Moodle: /course/modedit.php?add=<modname>&course=&section= hoặc ?update=<cmid>. Giữ field của Moodle, chỉ đổi thứ tự.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildAvailability,
  courseSections,
  createModule,
  defaultCompletion,
  MOD_TYPE_LABEL,
  parseAvailabilityTree,
} from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { stripHtml } from "@/lib/utils";
import { resolveVideoSource } from "@/lib/video";
import type { ModName } from "@/types/moodle";
import type { AdminModule } from "@/types/moodle-admin";
import { CheckRow, DateTimeField, DisabledGroupsNote, ExpandAll, Field, FormSection, NativeSelect, StickySaveBar, Textarea } from "../common/form";
import { AdminPageHeader } from "../layout/page-header";
import { AvailabilityEditor, type EditableCondition } from "./availability-editor";
import { CompletionEditor, type CompletionValue } from "./completion-editor";

export type ModEditMode = { kind: "add"; modname: ModName; section: number } | { kind: "update"; cmid: number };

interface Values {
  name: string;
  description: string;
  showdescription: boolean;
  videourl: string;
  minutes: number;
  content: string;
  filename: string;
  externalurl: string;
  display: number;
  printheading: boolean;
  printintro: boolean;
  printlastmodified: boolean;
  showsize: boolean;
  showtype: boolean;
  visible: 0 | 1;
  idnumber: string;
  groupmode: 0 | 1 | 2;
  lang: string;
  sendnotification: boolean;
  // Bài nộp
  allowsubmissionsfromdate: number;
  duedate: number;
  cutoffdate: number;
  onlinetext: boolean;
  filesubmission: boolean;
  maxfiles: number;
  grademax: number;
  gradepass: number;
  // Khảo sát
  anonymous: boolean;
  multiplesubmit: boolean;
  // Diễn đàn
  forumtype: "news" | "general" | "qanda";
}

function initialValues(m: AdminModule | undefined, modname: ModName): Values {
  return {
    name: m?.name ?? "",
    description: stripHtml(m?.description),
    showdescription: !!m?.showdescription,
    videourl: m?.videourl ?? "",
    minutes: m?.customdata_duration ? Math.round(m.customdata_duration / 60) : 10,
    content: modname === "label" ? stripHtml(m?.description) : m ? `${stripHtml(m.description)}` : "",
    filename: m?.contents?.[0]?.filename ?? "",
    externalurl: m?.externalurl ?? "",
    display: 0,
    printheading: true,
    printintro: false,
    printlastmodified: true,
    showsize: true,
    showtype: true,
    visible: (m?.visible ?? 1) as 0 | 1,
    idnumber: m?.idnumber ?? "",
    groupmode: 0,
    lang: "",
    sendnotification: false,
    allowsubmissionsfromdate: 0,
    duedate: 0,
    cutoffdate: 0,
    onlinetext: false,
    filesubmission: true,
    maxfiles: 1,
    grademax: 100,
    gradepass: 50,
    anonymous: false,
    multiplesubmit: false,
    forumtype: "news",
  };
}

function initialCompletion(m: AdminModule | undefined, modname: ModName): CompletionValue {
  const d = m ?? defaultCompletion(modname);
  return {
    completion: d.completion ?? 0,
    completionview: !!d.completionview,
    completionpercent: d.completionpercent ?? 0,
    completionusegrade: !!d.completionusegrade,
    completionpassgrade: !!d.completionpassgrade,
    completionattemptsexhausted: !!m?.completionattemptsexhausted,
    completionexpected: m?.completionexpected ?? 0,
  };
}

const DRIVE_RE = /drive\.google\.com\/file\/d\/[^/?#]+/;

export function ModForm({ courseId, mode, children }: { courseId: number; mode: ModEditMode; children?: React.ReactNode }) {
  const router = useRouter();
  const { ds, actions } = useAdmin();
  const sections = courseSections(ds, courseId);
  const existing =
    mode.kind === "update" ? sections.flatMap((s) => s.modules.map((m) => ({ s, m }))).find((x) => x.m.id === mode.cmid) : undefined;
  const modname: ModName = mode.kind === "add" ? mode.modname : (existing?.m.modname ?? "page");
  const sectionNo = mode.kind === "add" ? mode.section : (existing?.s.section ?? 1);
  const section = sections.find((s) => s.section === sectionNo);

  const [v, setV] = useState<Values>(() => initialValues(existing?.m, modname));
  const [comp, setComp] = useState<CompletionValue>(() => initialCompletion(existing?.m, modname));
  const tree = parseAvailabilityTree(existing?.m.availability);
  const [conds, setConds] = useState<EditableCondition[]>(tree.c);
  const [op, setOp] = useState<"&" | "|">(tree.op);
  const [expanded, setExpanded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (patch: Partial<Values>) => setV((cur) => ({ ...cur, ...patch }));

  if (mode.kind === "update" && !existing)
    return <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Không tìm thấy bài học. Có thể bài đã bị xóa.</p>;

  const all = sections.flatMap((s) => s.modules).filter((m) => m.modname !== "label" && m.modname !== "qbank" && m.id !== existing?.m.id);
  const inSection = (section?.modules ?? []).filter((m) => m.modname !== "label" && m.modname !== "qbank");
  const idx = existing ? inSection.findIndex((m) => m.id === existing.m.id) : inSection.length;
  const previous = idx > 0 ? inSection[idx - 1] : undefined;
  const typeLabel = MOD_TYPE_LABEL[modname];
  const isLabel = modname === "label";
  const video = modname === "drivevideo" && DRIVE_RE.test(v.videourl) ? resolveVideoSource({ videourl: v.videourl }) : null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLabel && !v.name.trim()) e.name = "Nhập tên bài học.";
    if (modname === "drivevideo" && !DRIVE_RE.test(v.videourl)) e.videourl = "Dán link chia sẻ Google Drive dạng https://drive.google.com/file/d/...";
    if (modname === "page" && !v.content.trim()) e.content = "Nhập nội dung bài đọc.";
    if (modname === "url" && !/^https?:\/\//.test(v.externalurl)) e.externalurl = "Nhập địa chỉ bắt đầu bằng https://";
    if (isLabel && !v.content.trim()) e.content = "Nhập nội dung văn bản.";
    if (modname === "resource" && !v.filename) e.filename = "Chọn tệp tải lên.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return false;
    }
    return true;
  };

  const save = (andView: boolean) => {
    if (!validate()) return;
    const html = (t: string) => (t.trim() ? `<p>${t.trim().replace(/\n+/g, "</p><p>")}</p>` : "");
    const name = isLabel ? stripHtml(v.content).slice(0, 40) || "Văn bản" : v.name.trim();
    const patch: Partial<AdminModule> = {
      name,
      description: isLabel ? html(v.content) : modname === "page" ? html(v.content) : html(v.description),
      showdescription: v.showdescription ? 1 : 0,
      visible: v.visible,
      idnumber: v.idnumber,
      completion: comp.completion,
      completionview: comp.completion === 2 && comp.completionview ? 1 : 0,
      completionpercent: comp.completion === 2 ? comp.completionpercent : 0,
      completionusegrade: comp.completion === 2 && comp.completionusegrade ? 1 : 0,
      completionpassgrade: comp.completion === 2 && comp.completionpassgrade ? 1 : 0,
      completionattemptsexhausted: comp.completionattemptsexhausted ? 1 : 0,
      completionexpected: comp.completionexpected,
      availability: buildAvailability(conds, op),
      ...(modname === "drivevideo" ? { videourl: v.videourl.trim(), customdata_duration: v.minutes * 60 } : {}),
      ...(modname === "url" ? { externalurl: v.externalurl.trim() } : {}),
      ...(modname === "resource" && v.filename !== existing?.m.contents?.[0]?.filename
        ? { contents: [{ type: "file" as const, filename: v.filename, fileurl: "", filesize: 0 }] }
        : {}),
    };
    let cmid: number;
    if (existing) {
      cmid = existing.m.id;
      actions.updateModule(cmid, patch);
    } else {
      cmid = newId();
      actions.addModule(courseId, sectionNo, createModule(cmid, modname, name, patch));
    }
    router.push(andView && modname === "quiz" ? `/admin/quiz/${cmid}/edit` : `/admin/courses/${courseId}/edit#cm-${cmid}`);
  };

  return (
    <div>
      <AdminPageHeader
        title={existing ? `Sửa ${typeLabel.toLowerCase()}: ${existing.m.name}` : `Thêm ${typeLabel.toLowerCase()}`}
        description={`Vào ${section?.name ?? `Phần ${sectionNo}`}`}
        actions={<ExpandAll expanded={expanded} onChange={setExpanded} />}
        className="mb-4"
      />
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save(false);
        }}
        noValidate
      >
        {!isLabel && (
          <FormSection title="Chung" defaultOpen key={`s1${expanded}`}>
            <Field label="Tên" required htmlFor="f-name" error={errors.name}>
              <Input id="f-name" value={v.name} onChange={(e) => set({ name: e.target.value })} placeholder={modname === "drivevideo" ? "Ví dụ: Bài 1 - Cơ chế PN" : ""} />
            </Field>
            {modname !== "page" && (
              <Field label="Mô tả" htmlFor="f-desc">
                <Textarea id="f-desc" value={v.description} onChange={(e) => set({ description: e.target.value })} />
                <CheckRow checked={v.showdescription} onChange={(c) => set({ showdescription: c })} label="Hiện mô tả trên trang khóa" />
              </Field>
            )}
          </FormSection>
        )}

        <FormSection title="Nội dung" defaultOpen key={`s2${expanded}`} id="noi-dung">
          {modname === "drivevideo" && (
            <>
              <Field
                label="Link Google Drive"
                required
                htmlFor="f-videourl"
                error={errors.videourl}
                hint="Chia sẻ file ở chế độ Bất kỳ ai có đường liên kết trong tổ chức VIGO."
              >
                <Input id="f-videourl" value={v.videourl} onChange={(e) => set({ videourl: e.target.value })} placeholder="https://drive.google.com/file/d/.../view" />
              </Field>
              <Field label="Thời lượng" htmlFor="f-minutes" hint="Hiện trên đề cương khóa của học viên.">
                <div className="flex items-center gap-2">
                  <Input id="f-minutes" type="number" min={1} className="w-24" value={v.minutes} onChange={(e) => set({ minutes: Math.max(1, Number(e.target.value)) })} />
                  <span className="text-sm">phút</span>
                </div>
              </Field>
              <Field label="Xem trước">
                <div className="aspect-video w-full max-w-xl overflow-hidden rounded-lg bg-player">
                  {video?.kind === "drive" ? (
                    <iframe src={video.embedUrl} title="Xem trước video" className="size-full" allow="autoplay; fullscreen" />
                  ) : existing?.m.videourl && !DRIVE_RE.test(v.videourl) && v.videourl === existing.m.videourl ? (
                    <video src={v.videourl} poster={existing.m.videoposter} controls className="size-full" />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 text-sm text-white/70">
                      <MonitorPlay className="size-8" /> Dán link để xem trước
                    </div>
                  )}
                </div>
              </Field>
            </>
          )}
          {(modname === "page" || isLabel) && (
            <Field label={isLabel ? "Nội dung văn bản" : "Nội dung trang"} required htmlFor="f-content" error={errors.content}>
              <Textarea id="f-content" rows={10} value={v.content} onChange={(e) => set({ content: e.target.value })} />
            </Field>
          )}
          {modname === "resource" && (
            <Field label="Chọn tệp" required htmlFor="f-filename" error={errors.filename} hint="PDF, PowerPoint, Word, Excel. Tối đa 100 MB.">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  id="f-filename"
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                  className="text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-card file:px-3 file:py-1.5 file:text-sm file:font-medium"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) set({ filename: f.name, name: v.name || f.name.replace(/\.[^.]+$/, "") });
                  }}
                />
                {v.filename && <span className="text-sm text-muted-foreground">Đang dùng: {v.filename}</span>}
              </div>
            </Field>
          )}
          {modname === "url" && (
            <Field label="Địa chỉ URL" required htmlFor="f-externalurl" error={errors.externalurl}>
              <Input id="f-externalurl" value={v.externalurl} onChange={(e) => set({ externalurl: e.target.value })} placeholder="https://" />
            </Field>
          )}
          {modname === "assign" && (
            <>
              <Field label="Hướng dẫn nộp bài" htmlFor="f-instr">
                <Textarea id="f-instr" value={v.content} onChange={(e) => set({ content: e.target.value })} />
              </Field>
              <Field label="Hình thức nộp">
                <div className="space-y-2">
                  <CheckRow checked={v.filesubmission} onChange={(c) => set({ filesubmission: c })} label="Nộp tệp" />
                  <CheckRow checked={v.onlinetext} onChange={(c) => set({ onlinetext: c })} label="Viết trực tiếp" />
                </div>
              </Field>
              <Field label="Số tệp tối đa" htmlFor="f-maxfiles">
                <Input id="f-maxfiles" type="number" min={1} max={20} className="w-24" value={v.maxfiles} onChange={(e) => set({ maxfiles: Number(e.target.value) })} />
              </Field>
            </>
          )}
          {modname === "feedback" && (
            <>
              <Field label="Ghi nhận tên người trả lời">
                <CheckRow checked={!v.anonymous} onChange={(c) => set({ anonymous: !c })} label="Có ghi tên (bỏ chọn để khảo sát ẩn danh)" />
              </Field>
              <Field label="Cho trả lời nhiều lần">
                <CheckRow checked={v.multiplesubmit} onChange={(c) => set({ multiplesubmit: c })} label="Có" />
              </Field>
              <p className="text-sm text-muted-foreground">Câu hỏi khảo sát thêm ở trang của bài sau khi lưu.</p>
            </>
          )}
          {modname === "forum" && (
            <Field label="Loại diễn đàn" htmlFor="f-forumtype">
              <NativeSelect id="f-forumtype" className="w-auto" value={v.forumtype} onChange={(e) => set({ forumtype: e.target.value as Values["forumtype"] })}>
                <option value="news">Thông báo (chỉ giảng viên đăng)</option>
                <option value="general">Thảo luận chung</option>
                <option value="qanda">Hỏi đáp</option>
              </NativeSelect>
            </Field>
          )}
          {children}
        </FormSection>

        {modname === "assign" && (
          <FormSection title="Thời hạn và điểm" defaultOpen key={`s3${expanded}`}>
            <Field label="Cho nộp từ">
              <DateInput value={v.allowsubmissionsfromdate} onChange={(t) => set({ allowsubmissionsfromdate: t })} />
            </Field>
            <Field label="Hạn nộp">
              <DateInput value={v.duedate} onChange={(t) => set({ duedate: t })} />
            </Field>
            <Field label="Hạn chót (không nhận sau)">
              <DateInput value={v.cutoffdate} onChange={(t) => set({ cutoffdate: t })} />
            </Field>
            <Field label="Điểm tối đa" htmlFor="f-grademax">
              <Input id="f-grademax" type="number" className="w-24" value={v.grademax} onChange={(e) => set({ grademax: Number(e.target.value) })} />
            </Field>
            <Field label="Điểm đạt" htmlFor="f-gradepass">
              <Input id="f-gradepass" type="number" className="w-24" value={v.gradepass} onChange={(e) => set({ gradepass: Number(e.target.value) })} />
            </Field>
          </FormSection>
        )}

        {!isLabel && modname !== "forum" && modname !== "subsection" && (
          <FormSection
            title="Hoàn thành"
            description="Khi nào bài được tính là xong."
            defaultOpen
            key={`s4${expanded}`}
            id="hoan-thanh"
          >
            <CompletionEditor modname={modname} value={comp} onChange={setComp} />
          </FormSection>
        )}

        <FormSection title="Điều kiện truy cập" description="Ai được mở bài và khi nào." defaultOpen key={`s5${expanded}`} id="dieu-kien">
          <AvailabilityEditor conds={conds} onChange={setConds} op={op} onOpChange={setOp} candidates={all} previous={previous} />
        </FormSection>

        {(modname === "page" || modname === "resource" || modname === "url") && (
          <FormSection title="Giao diện" defaultOpen={expanded} key={`s6${expanded}`}>
            {modname !== "page" && (
              <Field label="Cách hiển thị" htmlFor="f-display">
                <NativeSelect id="f-display" className="w-auto" value={v.display} onChange={(e) => set({ display: Number(e.target.value) })}>
                  <option value={0}>Tự động</option>
                  <option value={1}>Nhúng trong trang</option>
                  {modname === "resource" && <option value={2}>Bắt buộc tải xuống</option>}
                  <option value={5}>Mở trực tiếp</option>
                  <option value={6}>Cửa sổ bật lên</option>
                </NativeSelect>
              </Field>
            )}
            {modname === "page" && (
              <Field label="Tùy chọn hiển thị">
                <div className="space-y-2">
                  <CheckRow checked={v.printheading} onChange={(c) => set({ printheading: c })} label="Hiện tên trang" />
                  <CheckRow checked={v.printintro} onChange={(c) => set({ printintro: c })} label="Hiện mô tả trang" />
                  <CheckRow checked={v.printlastmodified} onChange={(c) => set({ printlastmodified: c })} label="Hiện ngày cập nhật" />
                </div>
              </Field>
            )}
            {modname === "resource" && (
              <Field label="Thông tin tệp">
                <div className="space-y-2">
                  <CheckRow checked={v.showsize} onChange={(c) => set({ showsize: c })} label="Hiện dung lượng" />
                  <CheckRow checked={v.showtype} onChange={(c) => set({ showtype: c })} label="Hiện loại tệp" />
                </div>
              </Field>
            )}
          </FormSection>
        )}

        <FormSection title="Cài đặt chung của bài học" defaultOpen={expanded} key={`s7${expanded}`}>
          <Field label="Hiển thị" htmlFor="f-visible">
            <NativeSelect id="f-visible" className="w-auto" value={v.visible} onChange={(e) => set({ visible: Number(e.target.value) as 0 | 1 })}>
              <option value={1}>Hiện với học viên</option>
              <option value={0}>Ẩn với học viên</option>
            </NativeSelect>
          </Field>
          <Field label="Mã định danh (ID number)" htmlFor="f-idnumber" help="Dùng khi tính điểm hoặc đối chiếu dữ liệu. Có thể để trống.">
            <Input id="f-idnumber" className="max-w-xs" value={v.idnumber} onChange={(e) => set({ idnumber: e.target.value })} />
          </Field>
          <Field label="Chế độ nhóm" htmlFor="f-groupmode">
            <NativeSelect id="f-groupmode" className="w-auto" value={v.groupmode} onChange={(e) => set({ groupmode: Number(e.target.value) as 0 | 1 | 2 })}>
              <option value={0}>Không chia nhóm</option>
              <option value={1}>Nhóm tách biệt</option>
              <option value={2}>Nhóm thấy nhau</option>
            </NativeSelect>
          </Field>
          <Field label="Ép ngôn ngữ" htmlFor="f-lang">
            <NativeSelect id="f-lang" className="w-auto" value={v.lang} onChange={(e) => set({ lang: e.target.value })}>
              <option value="">Không ép</option>
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </NativeSelect>
          </Field>
          {existing && (
            <Field label="Gửi thông báo thay đổi nội dung">
              <CheckRow checked={v.sendnotification} onChange={(c) => set({ sendnotification: c })} label="Báo cho học viên khi lưu" />
            </Field>
          )}
        </FormSection>

        <DisabledGroupsNote groups={["Thẻ (Tags)", "Năng lực (Competencies)", "Công cụ AI"]} />

        <StickySaveBar>
          <Button variant="ghost" asChild>
            <Link href={`/admin/courses/${courseId}/edit`}>Hủy</Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => save(true)}>
            Lưu và xem
          </Button>
          <Button type="submit">Lưu và quay lại khóa</Button>
        </StickySaveBar>
      </form>
    </div>
  );
}

function DateInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="max-w-md">
      <DateTimeField value={value} onChange={onChange} />
    </div>
  );
}
