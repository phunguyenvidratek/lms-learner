"use client";

/**
 * Admin USER-01: form thêm người dùng rút gọn. Nhóm đầu chỉ có trường cần: tên đăng nhập, họ, tên, email,
 * phòng ban (đưa lên), cách tạo mật khẩu. Các nhóm khác của Moodle thu gọn ở dưới, không bỏ trường bắt buộc.
 * MoodleNet đã tắt ở site. Moodle: /user/editadvanced.php?id=-1 (thêm), ?id={userid} (sửa).
 * Mật khẩu không lưu vào mock, ô mật khẩu chỉ là placeholder.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { userCohorts } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import type { AdminUser } from "@/types/moodle-admin";
import { CheckRow, DisabledGroupsNote, ExpandAll, FileButton, Field, FormSection, NativeSelect, StickySaveBar, Textarea } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";

export function UserForm({ userId }: { userId?: number }) {
  const router = useRouter();
  const { ds, actions } = useAdmin();
  const existing = userId ? ds.users.find((u) => u.id === userId) : undefined;
  const currentCohort = existing ? userCohorts(ds, existing.id)[0]?.id : undefined;
  const [v, setV] = useState({
    username: existing?.username ?? "",
    auth: existing?.auth ?? ("manual" as AdminUser["auth"]),
    suspended: existing?.suspended ?? false,
    passwordMode: "generate" as "generate" | "manual",
    forcechange: true,
    firstname: existing?.firstname ?? "",
    lastname: existing?.lastname ?? "",
    email: existing?.email ?? "",
    cohort: currentCohort ?? 0,
    maildisplay: 2,
    city: existing?.city ?? "",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
    description: "",
    idnumber: existing?.idnumber ?? "",
    institution: existing?.institution ?? "",
    department: existing?.department ?? "",
    phone1: "",
    phone2: "",
    address: "",
    middlename: "",
    alternatename: "",
    interests: "",
  });
  const [expanded, setExpanded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (patch: Partial<typeof v>) => setV((c) => ({ ...c, ...patch }));

  if (userId && !existing) return <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Không tìm thấy người dùng.</p>;

  const save = () => {
    const e: Record<string, string> = {};
    const username = v.username.trim().toLowerCase();
    if (!/^[a-z0-9._-]+$/.test(username)) e.username = "Chỉ dùng chữ thường không dấu, số, dấu chấm, gạch dưới, gạch ngang.";
    else if (ds.users.some((u) => u.username === username && u.id !== existing?.id)) e.username = "Tên đăng nhập đã có người dùng.";
    if (!v.firstname.trim()) e.firstname = "Nhập tên.";
    if (!v.lastname.trim()) e.lastname = "Nhập họ.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim())) e.email = "Email không hợp lệ.";
    else if (ds.users.some((u) => u.email === v.email.trim() && u.id !== existing?.id)) e.email = "Email đã được dùng.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`u-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const cohortName = ds.cohorts.find((c) => c.id === v.cohort)?.name ?? "";
    const patch: Partial<AdminUser> = {
      username,
      auth: v.auth,
      suspended: v.suspended,
      firstname: v.firstname.trim(),
      lastname: v.lastname.trim(),
      fullname: `${v.lastname.trim()} ${v.firstname.trim()}`,
      email: v.email.trim(),
      city: v.city,
      idnumber: v.idnumber,
      institution: v.institution,
      department: v.department,
      customfields: [{ shortname: "phongban", name: "Phòng ban", value: cohortName }],
    };
    const now = Math.floor(Date.now() / 1000);
    if (existing) {
      actions.updateUser(existing.id, patch);
      if (v.cohort && v.cohort !== currentCohort) actions.addCohortMembers([{ cohortid: v.cohort, userid: existing.id, timeadded: now }]);
    } else {
      const id = newId();
      actions.addUser(
        { id, systemroles: [], firstaccess: 0, lastaccess: 0, timecreated: now, ...patch } as AdminUser,
        v.cohort || undefined,
      );
    }
    router.push("/admin/users");
  };

  return (
    <AdminPage>
      <AdminPageHeader
        breadcrumbs={[{ label: "Người dùng", href: "/admin/users" }, { label: existing ? existing.fullname : "Thêm người dùng" }]}
        title={existing ? `Sửa: ${existing.fullname}` : "Thêm người dùng"}
        description={existing ? undefined : "Chỉ cần điền nhóm đầu. Các nhóm khác không bắt buộc."}
        actions={<ExpandAll expanded={expanded} onChange={setExpanded} />}
        className="mb-4"
      />
      <form
        className="space-y-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <FormSection title="Thông tin chính" defaultOpen key={`m${expanded}`}>
          <Field label="Họ" required htmlFor="u-lastname" error={errors.lastname}>
            <Input id="u-lastname" value={v.lastname} onChange={(e) => set({ lastname: e.target.value })} placeholder="Ví dụ: Nguyễn" />
          </Field>
          <Field label="Tên" required htmlFor="u-firstname" error={errors.firstname}>
            <Input id="u-firstname" value={v.firstname} onChange={(e) => set({ firstname: e.target.value })} placeholder="Ví dụ: Văn An" />
          </Field>
          <Field label="Email" required htmlFor="u-email" error={errors.email}>
            <Input id="u-email" type="email" value={v.email} onChange={(e) => set({ email: e.target.value })} placeholder="ten.ho@vigo.vn" />
          </Field>
          <Field label="Tên đăng nhập" required htmlFor="u-username" error={errors.username} hint="Chữ thường không dấu, ví dụ vanan.nguyen">
            <Input id="u-username" value={v.username} onChange={(e) => set({ username: e.target.value })} autoComplete="off" />
          </Field>
          <Field label="Phòng ban" htmlFor="u-cohort" help="Thêm người vào phòng ban (cohort). Khóa đồng bộ theo phòng ban sẽ tự ghi danh.">
            <NativeSelect id="u-cohort" className="w-auto" value={v.cohort} onChange={(e) => set({ cohort: Number(e.target.value) })}>
              <option value={0}>Chưa chọn</option>
              {ds.cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Cách đăng nhập" htmlFor="u-auth">
            <NativeSelect id="u-auth" className="w-auto" value={v.auth} onChange={(e) => set({ auth: e.target.value as AdminUser["auth"] })}>
              <option value="manual">Tài khoản và mật khẩu</option>
              <option value="oauth2">Google (email VIGO)</option>
            </NativeSelect>
          </Field>
          {v.auth === "manual" && (
            <Field label="Mật khẩu">
              <RadioGroup value={v.passwordMode} onValueChange={(x) => set({ passwordMode: x as "generate" | "manual" })} className="gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="generate" /> Tạo mật khẩu và gửi email cho người dùng
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="manual" /> Đặt mật khẩu mới
                </label>
              </RadioGroup>
              {v.passwordMode === "manual" && (
                <Input type="password" autoComplete="new-password" className="mt-2 max-w-xs" placeholder="Mật khẩu mới" aria-label="Mật khẩu mới" />
              )}
              <div className="mt-2">
                <CheckRow checked={v.forcechange} onChange={(c) => set({ forcechange: c })} label="Bắt đổi mật khẩu ở lần đăng nhập đầu" />
              </div>
            </Field>
          )}
          <Field label="Tạm khóa tài khoản">
            <CheckRow checked={v.suspended} onChange={(c) => set({ suspended: c })} label="Tạm khóa (không đăng nhập được)" />
          </Field>
        </FormSection>

        <FormSection title="Thông tin thêm" defaultOpen={expanded} key={`a${expanded}`}>
          <Field label="Hiển thị email" htmlFor="u-maildisplay">
            <NativeSelect id="u-maildisplay" className="w-auto" value={v.maildisplay} onChange={(e) => set({ maildisplay: Number(e.target.value) })}>
              <option value={0}>Ẩn với mọi người</option>
              <option value={1}>Cho mọi người xem</option>
              <option value={2}>Chỉ người cùng khóa</option>
            </NativeSelect>
          </Field>
          <Field label="Thành phố" htmlFor="u-city">
            <Input id="u-city" className="max-w-xs" value={v.city} onChange={(e) => set({ city: e.target.value })} />
          </Field>
          <Field label="Quốc gia" htmlFor="u-country">
            <NativeSelect id="u-country" className="w-auto" value={v.country} onChange={(e) => set({ country: e.target.value })}>
              <option value="VN">Việt Nam</option>
              <option value="KR">Hàn Quốc</option>
            </NativeSelect>
          </Field>
          <Field label="Múi giờ" htmlFor="u-tz">
            <NativeSelect id="u-tz" className="w-auto" value={v.timezone} onChange={(e) => set({ timezone: e.target.value })}>
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="99">Theo hệ thống</option>
            </NativeSelect>
          </Field>
          <Field label="Giới thiệu" htmlFor="u-desc">
            <Textarea id="u-desc" value={v.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>
        </FormSection>

        <FormSection title="Ảnh đại diện" defaultOpen={expanded} key={`p${expanded}`}>
          <Field label="Ảnh mới" htmlFor="u-pic">
            <FileButton id="u-pic" accept="image/*" label="Chọn ảnh" onFile={() => {}} />
          </Field>
        </FormSection>

        <FormSection title="Tên bổ sung" defaultOpen={expanded} key={`n${expanded}`}>
          <Field label="Tên đệm" htmlFor="u-middle">
            <Input id="u-middle" className="max-w-xs" value={v.middlename} onChange={(e) => set({ middlename: e.target.value })} />
          </Field>
          <Field label="Tên thường gọi" htmlFor="u-alt">
            <Input id="u-alt" className="max-w-xs" value={v.alternatename} onChange={(e) => set({ alternatename: e.target.value })} />
          </Field>
        </FormSection>

        <FormSection title="Sở thích" defaultOpen={expanded} key={`i${expanded}`}>
          <Field label="Sở thích" htmlFor="u-interests" hint="Ngăn cách bằng dấu phẩy.">
            <Input id="u-interests" value={v.interests} onChange={(e) => set({ interests: e.target.value })} />
          </Field>
        </FormSection>

        <FormSection title="Không bắt buộc" defaultOpen={expanded} key={`o${expanded}`}>
          <Field label="Mã nhân viên (ID number)" htmlFor="u-idnumber">
            <Input id="u-idnumber" className="max-w-xs" value={v.idnumber} onChange={(e) => set({ idnumber: e.target.value })} />
          </Field>
          <Field label="Đơn vị" htmlFor="u-institution">
            <Input id="u-institution" value={v.institution} onChange={(e) => set({ institution: e.target.value })} />
          </Field>
          <Field label="Chức danh" htmlFor="u-department" help="Field Department của Moodle, VIGO dùng làm chức danh.">
            <Input id="u-department" value={v.department} onChange={(e) => set({ department: e.target.value })} />
          </Field>
          <Field label="Điện thoại" htmlFor="u-phone1">
            <Input id="u-phone1" className="max-w-xs" value={v.phone1} onChange={(e) => set({ phone1: e.target.value })} />
          </Field>
          <Field label="Di động" htmlFor="u-phone2">
            <Input id="u-phone2" className="max-w-xs" value={v.phone2} onChange={(e) => set({ phone2: e.target.value })} />
          </Field>
          <Field label="Địa chỉ" htmlFor="u-address">
            <Input id="u-address" value={v.address} onChange={(e) => set({ address: e.target.value })} />
          </Field>
        </FormSection>

        <DisabledGroupsNote groups={["Hồ sơ MoodleNet"]} />

        <StickySaveBar>
          <Button variant="ghost" asChild>
            <Link href="/admin/users">Hủy</Link>
          </Button>
          <Button type="submit">{existing ? "Lưu thay đổi" : "Tạo người dùng"}</Button>
        </StickySaveBar>
      </form>
    </AdminPage>
  );
}
