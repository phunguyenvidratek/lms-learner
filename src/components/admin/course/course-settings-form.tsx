"use client";

/**
 * Admin CSET-01 (mặc định khóa mới theo chuẩn VIGO: dạng chủ đề, 4 phần, bật theo dõi hoàn thành, hiện điều kiện),
 * CSET-02 (form chia Thông tin chính và Nâng cao thu gọn, ảnh đưa lên cạnh tên; Tags, AI tools đã tắt ở site),
 * CSET-03 (ô xem trước thẻ khóa như learner /courses, cảnh báo thiếu ảnh hoặc mô tả).
 * Moodle: /course/edit.php?id={id} (sửa), /course/edit.php?category={id} (tạo). Không đổi tên field, không đổi submit.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, Clock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ADMIN_USER_ID, courseSections, getAdminCourse, ROLE_EDITINGTEACHER } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { useNow } from "@/lib/use-now";
import { stripHtml } from "@/lib/utils";
import type { AdminCourse, ProgramGroup } from "@/types/moodle-admin";
import { CheckRow, DateTimeField, DisabledGroupsNote, ExpandAll, FileButton, Field, FormSection, NativeSelect, StickySaveBar, Textarea } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";
import { CourseThumb } from "./course-thumb";

/** Ảnh bìa có sẵn trong thư viện (public/images/courses) */
const LIBRARY = ["brand-vigo", "danh-gia-da", "rejuran-internal", "an-toan", "ky-thuat-tiem", "phoi-hop", "my-pham", "vi-kim"].map((n) => `/images/courses/${n}.jpg`);

const DAY = 86400;

function Preview({ v, lessons }: { v: Values; lessons: number }) {
  const missing = [!v.courseimage && "ảnh bìa", !v.summary.trim() && "mô tả ngắn"].filter(Boolean);
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Xem trước thẻ khóa</p>
      <article className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <CourseThumb src={v.courseimage} alt={v.fullname} className="aspect-video" sizes="320px" />
        <div className="space-y-2.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-medium text-muted-foreground">{v.category}</span>
            <Badge variant="muted">Chưa bắt đầu</Badge>
          </div>
          <p className="line-clamp-2 leading-snug font-bold">{v.fullname || "Tên khóa học"}</p>
          <p className="text-xs text-muted-foreground">Phòng Đào tạo VIGO</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{v.summary || "Mô tả ngắn hiện ở đây."}</p>
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <PlayCircle className="size-3.5" /> {lessons} bài học
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> Theo nội dung
            </span>
          </p>
          <Progress value={0} />
          <Button className="w-full" size="sm" tabIndex={-1}>
            Bắt đầu học
          </Button>
        </div>
      </article>
      {missing.length > 0 && (
        <p className="flex gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" /> Thiếu {missing.join(" và ")}. Thẻ khóa trên cổng học viên sẽ trống phần này.
        </p>
      )}
    </div>
  );
}

interface Values {
  fullname: string;
  shortname: string;
  categoryid: number;
  category: string;
  visible: 0 | 1;
  startdate: number;
  enddate: number;
  idnumber: string;
  summary: string;
  courseimage: string;
  programgroup: ProgramGroup;
  format: AdminCourse["format"];
  numsections: number;
  hiddensections: number;
  coursedisplay: number;
  lang: string;
  newsitems: number;
  showgrades: boolean;
  showreports: boolean;
  showactivitydates: boolean;
  maxbytes: number;
  enablecompletion: boolean;
  showcompletionconditions: boolean;
  groupmode: number;
  groupmodeforce: boolean;
  roleStudent: string;
  roleTeacher: string;
}

export function CourseSettingsForm({ courseId, categoryId }: { courseId?: number; categoryId?: number }) {
  const router = useRouter();
  const { ds, actions } = useAdmin();
  const existing = courseId ? getAdminCourse(ds, courseId) : undefined;
  const defaultCat = ds.categories.find((c) => c.id === (existing?.categoryid ?? categoryId)) ?? ds.categories[1];
  const today = Math.floor(useNow() / DAY) * DAY;
  const [v, setV] = useState<Values>(() => ({
    fullname: existing?.fullname ?? "",
    shortname: existing?.shortname ?? "",
    categoryid: defaultCat.id,
    category: defaultCat.name,
    visible: existing?.visible ?? 0,
    startdate: existing?.startdate ?? today + DAY,
    enddate: existing?.enddate ?? 0,
    idnumber: existing?.idnumber ?? "",
    summary: stripHtml(existing?.summary),
    courseimage: existing?.courseimage ?? "",
    programgroup: existing?.programgroup ?? "Foundational",
    format: existing?.format ?? "topics",
    numsections: 4,
    hiddensections: 1,
    coursedisplay: 0,
    lang: "",
    newsitems: 3,
    showgrades: true,
    showreports: false,
    showactivitydates: true,
    maxbytes: 104857600,
    enablecompletion: existing ? existing.enablecompletion === 1 : true,
    showcompletionconditions: existing ? existing.showcompletionconditions === 1 : true,
    groupmode: 0,
    groupmodeforce: false,
    roleStudent: "",
    roleTeacher: "",
  }));
  const [expanded, setExpanded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const set = (patch: Partial<Values>) => {
    setSaved(false);
    setV((c) => ({ ...c, ...patch }));
  };

  if (courseId && !existing) return null;
  const lessons = existing ? courseSections(ds, existing.id).flatMap((s) => s.modules).filter((m) => !["label", "qbank", "forum"].includes(m.modname)).length : 0;

  const save = () => {
    const e: Record<string, string> = {};
    if (!v.fullname.trim()) e.fullname = "Nhập tên khóa học.";
    if (!v.shortname.trim()) e.shortname = "Nhập tên rút gọn.";
    else if (ds.courses.some((c) => c.shortname === v.shortname.trim() && c.id !== existing?.id)) e.shortname = "Tên rút gọn đã được khóa khác dùng.";
    if (v.enddate && v.enddate <= v.startdate) e.enddate = "Ngày kết thúc phải sau ngày bắt đầu.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`c-${Object.keys(e)[0]}`)?.focus();
      if (e.enddate) setExpanded(true);
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const patch: Partial<AdminCourse> = {
      fullname: v.fullname.trim(),
      shortname: v.shortname.trim(),
      categoryid: v.categoryid,
      coursecategory: v.category,
      visible: v.visible,
      startdate: v.startdate,
      enddate: v.enddate,
      idnumber: v.idnumber,
      summary: v.summary.trim() ? `<p>${v.summary.trim()}</p>` : "",
      courseimage: v.courseimage,
      programgroup: v.programgroup,
      format: v.format,
      enablecompletion: v.enablecompletion ? 1 : 0,
      showcompletionconditions: v.showcompletionconditions ? 1 : 0,
      timemodified: now,
    };
    if (existing) {
      actions.updateCourse(existing.id, patch);
      setSaved(true);
      return;
    }
    const id = newId();
    actions.createCourse({
      ...patch,
      id,
      description: "",
      objectives: [],
      requirements: [],
      teacher: "Phòng Đào tạo VIGO",
      timecreated: now,
    } as AdminCourse);
    const manualId = newId();
    actions.addEnrolments(
      [{ id: manualId, courseid: id, enrol: "manual", status: 0, name: "", roleid: 5, enrolperiod: 0, timecreated: now }],
      [{ id: newId(), enrolid: manualId, userid: ADMIN_USER_ID, status: 0, timestart: now, timeend: 0, timecreated: now }],
      [{ courseid: id, userid: ADMIN_USER_ID, roleid: ROLE_EDITINGTEACHER }],
    );
    for (let i = 0; i < v.numsections; i++) actions.addSection(id);
    router.push(`/admin/courses/${id}/edit`);
  };

  const body = (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <FormSection title="Thông tin chính" defaultOpen key={`m${expanded}`}>
            <Field label="Tên khóa học" required htmlFor="c-fullname" error={errors.fullname}>
              <Input id="c-fullname" value={v.fullname} onChange={(e) => set({ fullname: e.target.value })} />
            </Field>
            <Field label="Tên rút gọn" required htmlFor="c-shortname" error={errors.shortname} hint="Mã ngắn, duy nhất, ví dụ RJR-INT.">
              <Input id="c-shortname" className="max-w-xs" value={v.shortname} onChange={(e) => set({ shortname: e.target.value })} />
            </Field>
            <Field label="Danh mục" required htmlFor="c-category">
              <NativeSelect
                id="c-category"
                className="w-auto"
                value={v.categoryid}
                onChange={(e) => {
                  const c = ds.categories.find((x) => x.id === Number(e.target.value))!;
                  set({ categoryid: c.id, category: c.name });
                }}
              >
                {ds.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parent ? `${ds.categories.find((p) => p.id === c.parent)?.name} / ` : ""}
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Nhóm chương trình" htmlFor="c-group" help="Custom field khóa, dùng để lọc ở Khóa học của tôi.">
              <NativeSelect id="c-group" className="w-auto" value={v.programgroup} onChange={(e) => set({ programgroup: e.target.value as ProgramGroup })}>
                <option value="Foundational">Foundational</option>
                <option value="Brands">Brands</option>
                <option value="Integrated">Integrated</option>
              </NativeSelect>
            </Field>
            <Field label="Ảnh khóa học" htmlFor="c-image" hint="Tỉ lệ 16:9, tối thiểu 1280 x 720.">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chọn ảnh có sẵn">
                {LIBRARY.map((src) => (
                  <button
                    key={src}
                    type="button"
                    role="radio"
                    aria-checked={v.courseimage === src}
                    onClick={() => set({ courseimage: src })}
                    className={`overflow-hidden rounded-md ring-offset-2 ${v.courseimage === src ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"}`}
                  >
                    <CourseThumb src={src} alt="" className="aspect-video w-24" sizes="96px" />
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <FileButton id="c-image" accept="image/*" label="Tải ảnh lên" onFile={(f) => set({ courseimage: URL.createObjectURL(f) })} />
              </div>
            </Field>
            <Field label="Mô tả ngắn" htmlFor="c-summary" hint="Hiện trên thẻ khóa, khoảng 2 dòng.">
              <Textarea id="c-summary" rows={3} value={v.summary} onChange={(e) => set({ summary: e.target.value })} />
            </Field>
            <Field label="Ngày bắt đầu">
              <DateTimeField value={v.startdate} onChange={(t) => set({ startdate: t || today })} />
            </Field>
            <Field label="Hiển thị khóa" htmlFor="c-visible">
              <NativeSelect id="c-visible" className="w-auto" value={v.visible} onChange={(e) => set({ visible: Number(e.target.value) as 0 | 1 })}>
                <option value={1}>Hiện với học viên</option>
                <option value={0}>Ẩn (đang soạn)</option>
              </NativeSelect>
            </Field>
          </FormSection>

          <FormSection title="Nâng cao" description="Định dạng, giao diện, hoàn thành, nhóm, tệp. Đã đặt sẵn theo chuẩn VIGO." defaultOpen={expanded || !!errors.enddate} key={`a${expanded}`}>
            <Field label="Ngày kết thúc" error={errors.enddate}>
              <DateTimeField value={v.enddate} onChange={(t) => set({ enddate: t })} />
            </Field>
            <Field label="Mã khóa (ID number)" htmlFor="c-idnumber">
              <Input id="c-idnumber" className="max-w-xs" value={v.idnumber} onChange={(e) => set({ idnumber: e.target.value })} />
            </Field>
            <p className="pt-2 text-sm font-semibold">Định dạng khóa</p>
            <Field label="Định dạng" htmlFor="c-format">
              <NativeSelect id="c-format" className="w-auto" value={v.format} onChange={(e) => set({ format: e.target.value as AdminCourse["format"] })}>
                <option value="topics">Theo chủ đề</option>
                <option value="weeks">Theo tuần</option>
                <option value="singleactivity">Một bài học</option>
              </NativeSelect>
            </Field>
            {!existing && (
              <Field label="Số phần" htmlFor="c-numsections">
                <Input id="c-numsections" type="number" min={1} max={20} className="w-24" value={v.numsections} onChange={(e) => set({ numsections: Number(e.target.value) })} />
              </Field>
            )}
            <Field label="Phần ẩn" htmlFor="c-hidden">
              <NativeSelect id="c-hidden" className="w-auto" value={v.hiddensections} onChange={(e) => set({ hiddensections: Number(e.target.value) })}>
                <option value={1}>Không hiện với học viên</option>
                <option value={0}>Hiện dạng thu gọn</option>
              </NativeSelect>
            </Field>
            <Field label="Bố cục" htmlFor="c-display">
              <NativeSelect id="c-display" className="w-auto" value={v.coursedisplay} onChange={(e) => set({ coursedisplay: Number(e.target.value) })}>
                <option value={0}>Mọi phần trên một trang</option>
                <option value={1}>Mỗi phần một trang</option>
              </NativeSelect>
            </Field>
            <p className="pt-2 text-sm font-semibold">Giao diện</p>
            <Field label="Ép ngôn ngữ" htmlFor="c-lang">
              <NativeSelect id="c-lang" className="w-auto" value={v.lang} onChange={(e) => set({ lang: e.target.value })}>
                <option value="">Không ép</option>
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </NativeSelect>
            </Field>
            <Field label="Số thông báo hiện" htmlFor="c-news">
              <NativeSelect id="c-news" className="w-auto" value={v.newsitems} onChange={(e) => set({ newsitems: Number(e.target.value) })}>
                {[0, 1, 3, 5, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Hiện cho học viên">
              <div className="space-y-2">
                <CheckRow checked={v.showgrades} onChange={(c) => set({ showgrades: c })} label="Sổ điểm" />
                <CheckRow checked={v.showreports} onChange={(c) => set({ showreports: c })} label="Báo cáo hoạt động" />
                <CheckRow checked={v.showactivitydates} onChange={(c) => set({ showactivitydates: c })} label="Ngày mở, hạn của bài" />
              </div>
            </Field>
            <p className="pt-2 text-sm font-semibold">Tệp và tải lên</p>
            <Field label="Dung lượng tải lên tối đa" htmlFor="c-maxbytes">
              <NativeSelect id="c-maxbytes" className="w-auto" value={v.maxbytes} onChange={(e) => set({ maxbytes: Number(e.target.value) })}>
                <option value={104857600}>100 MB (giới hạn hệ thống)</option>
                <option value={52428800}>50 MB</option>
                <option value={10485760}>10 MB</option>
              </NativeSelect>
            </Field>
            <p className="pt-2 text-sm font-semibold">Theo dõi hoàn thành</p>
            <Field label="Theo dõi hoàn thành">
              <div className="space-y-2">
                <CheckRow checked={v.enablecompletion} onChange={(c) => set({ enablecompletion: c })} label="Bật" />
                <CheckRow checked={v.showcompletionconditions} onChange={(c) => set({ showcompletionconditions: c })} label="Hiện điều kiện hoàn thành trên trang khóa" />
              </div>
            </Field>
            <p className="pt-2 text-sm font-semibold">Nhóm</p>
            <Field label="Chế độ nhóm" htmlFor="c-groupmode">
              <NativeSelect id="c-groupmode" className="w-auto" value={v.groupmode} onChange={(e) => set({ groupmode: Number(e.target.value) })}>
                <option value={0}>Không chia nhóm</option>
                <option value={1}>Nhóm tách biệt</option>
                <option value={2}>Nhóm thấy nhau</option>
              </NativeSelect>
              <CheckRow checked={v.groupmodeforce} onChange={(c) => set({ groupmodeforce: c })} label="Áp cho mọi bài" />
            </Field>
            <p className="pt-2 text-sm font-semibold">Đổi tên vai trò</p>
            <Field label="Học viên gọi là" htmlFor="c-role-s">
              <Input id="c-role-s" className="max-w-xs" placeholder="Học viên" value={v.roleStudent} onChange={(e) => set({ roleStudent: e.target.value })} />
            </Field>
            <Field label="Giảng viên gọi là" htmlFor="c-role-t">
              <Input id="c-role-t" className="max-w-xs" placeholder="Giảng viên" value={v.roleTeacher} onChange={(e) => set({ roleTeacher: e.target.value })} />
            </Field>
          </FormSection>
          <DisabledGroupsNote groups={["Thẻ (Tags)", "Công cụ AI"]} />
        </div>
        <aside className="xl:sticky xl:top-20 xl:self-start">
          <Preview v={v} lessons={lessons} />
        </aside>
      </div>
      <StickySaveBar note={saved ? "Đã lưu thay đổi." : undefined}>
        <Button variant="ghost" asChild>
          <Link href={existing ? `/admin/courses/${existing.id}/edit` : "/admin/courses"}>Hủy</Link>
        </Button>
        <Button type="submit">{existing ? "Lưu thay đổi" : "Lưu và soạn nội dung"}</Button>
      </StickySaveBar>
    </form>
  );

  if (existing)
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <ExpandAll expanded={expanded} onChange={setExpanded} />
        </div>
        {body}
      </div>
    );
  return (
    <AdminPage>
      <AdminPageHeader
        breadcrumbs={[{ label: "Quản lý khóa", href: "/admin/courses" }, { label: "Tạo khóa mới" }]}
        title="Tạo khóa mới"
        description="Chỉ cần tên, danh mục, ảnh và mô tả. Các cài đặt khác đã đặt sẵn theo chuẩn VIGO."
        actions={<ExpandAll expanded={expanded} onChange={setExpanded} />}
        className="mb-4"
      />
      {body}
    </AdminPage>
  );
}
