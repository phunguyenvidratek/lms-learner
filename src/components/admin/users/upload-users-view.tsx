"use client";

/**
 * Admin USER-03: nhập người dùng có file mẫu (username, firstname, lastname, email, cohort1), xem trước, xác nhận.
 * Moodle: /admin/tool/uploaduser/index.php (core, 2 bước: chọn file, xem trước + cài đặt).
 * File .csv đọc thật; nút "Dùng file mẫu" nạp 5 dòng mẫu (1 dòng trùng, 1 dòng lỗi).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Check, CircleAlert, Download, FileText, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseCsv } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import type { AdminUser } from "@/types/moodle-admin";
import { downloadCsv, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { CheckRow, Field, FormSection, NativeSelect, ShowMore, StickySaveBar } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";

const HEADER = ["username", "firstname", "lastname", "email", "cohort1", "idnumber", "department"];
const SAMPLE = [
  ["vanan.nguyen", "Văn An", "Nguyễn", "vanan.nguyen@vigo.vn", "CM-HCM", "VG-03001", "Nhân viên chuyên môn"],
  ["mylinh.tran", "Mỹ Linh", "Trần", "mylinh.tran@vigo.vn", "KD-HN", "VG-03002", "Nhân viên kinh doanh"],
  ["thuha.le", "Thu Hà", "Lê", "thuha.le@vigo.vn", "CM-HCM", "VG-02001", "Nhân viên chuyên môn"],
  ["quanghuy.pham", "Quang Huy", "Phạm", "quanghuy.pham@vigo", "MKT", "VG-03003", "Nhân viên marketing"],
  ["baochau.vo", "Bảo Châu", "Võ", "baochau.vo@vigo.vn", "CSKH", "VG-03004", "Nhân viên chăm sóc khách hàng"],
];

interface Row {
  line: number;
  cells: string[];
  status: "new" | "exists" | "error";
  message: string;
}

export function UploadUsersView() {
  const router = useRouter();
  const { ds, actions } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [uutype, setUutype] = useState("addnew");
  const [pwd, setPwd] = useState("generate");
  const [forcechange, setForcechange] = useState(true);

  const check = (data: string[][]) => {
    const body = data[0]?.[0]?.trim().toLowerCase() === "username" ? data.slice(1) : data;
    setRows(
      body.map((c, i) => {
        const [username = "", first = "", last = "", email = "", cohort = ""] = c.map((x) => x.trim());
        let status: Row["status"] = "new";
        let message = "Tạo mới";
        if (!username || !first || !last || !email) {
          status = "error";
          message = "Thiếu cột bắt buộc (username, firstname, lastname, email).";
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          status = "error";
          message = "Cột email không hợp lệ.";
        } else if (cohort && !ds.cohorts.some((x) => x.idnumber === cohort || x.name === cohort)) {
          status = "error";
          message = `Cột cohort1: không có phòng ban "${cohort}".`;
        } else if (ds.users.some((u) => u.username === username.toLowerCase())) {
          status = "exists";
          message = "Đã có tài khoản, bỏ qua";
        }
        return { line: i + 2, cells: c, status, message };
      }),
    );
  };

  const toCreate = rows?.filter((r) => r.status === "new") ?? [];

  return (
    <AdminPage>
      <AdminPageHeader
        breadcrumbs={[{ label: "Người dùng", href: "/admin/users" }, { label: "Nhập từ CSV" }]}
        title="Nhập người dùng từ CSV"
        description="Tải file mẫu, điền thông tin nhân viên, rồi tải lên để xem trước."
        actions={
          <Button variant="outline" onClick={() => downloadCsv("mau-nguoi-dung.csv", [HEADER, ...SAMPLE.slice(0, 2)])}>
            <Download /> Tải file mẫu
          </Button>
        }
      />

      <div className="mb-5 rounded-xl border bg-card p-5 shadow-xs">
        <p className="mb-2 font-semibold">Các cột trong file</p>
        <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[140px_1fr]">
          {[
            ["username", "Tên đăng nhập, chữ thường không dấu (bắt buộc)"],
            ["firstname, lastname", "Tên, họ (bắt buộc)"],
            ["email", "Email công ty (bắt buộc)"],
            ["cohort1", "Mã phòng ban, ví dụ CM-HCM. Người dùng được thêm vào phòng ban này"],
            ["idnumber, department", "Mã nhân viên, chức danh (không bắt buộc)"],
          ].map(([k, d]) => (
            <div key={k} className="contents">
              <dt className="font-mono text-xs font-medium sm:pt-0.5">{k}</dt>
              <dd className="text-muted-foreground">{d}</dd>
            </div>
          ))}
        </dl>
      </div>

      {!rows ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-card px-6 py-10 text-center hover:border-primary hover:bg-brand-50/40"
          >
            <Upload className="size-8 text-brand-600" />
            <span className="font-medium">Chọn file CSV</span>
            <span className="text-sm text-muted-foreground">Mã hóa UTF-8, phân cách bằng dấu phẩy</span>
          </button>
          <input
            ref={input}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            aria-label="Chọn file người dùng"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setFileName(f.name);
              check(parseCsv(await f.text()));
            }}
          />
          <Button
            variant="link"
            onClick={() => {
              setFileName("mau-nguoi-dung.csv");
              check(SAMPLE);
            }}
          >
            Dùng file mẫu để xem trước
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <FileText className="size-4" /> <span className="font-medium">{fileName}</span>
            <Badge variant="success">{toCreate.length} tạo mới</Badge>
            {rows.some((r) => r.status === "exists") && <Badge variant="muted">{rows.filter((r) => r.status === "exists").length} đã có</Badge>}
            {rows.some((r) => r.status === "error") && <Badge variant="danger">{rows.filter((r) => r.status === "error").length} lỗi</Badge>}
            <Button variant="link" size="sm" onClick={() => setRows(null)}>
              Chọn file khác
            </Button>
          </div>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Dòng</Th>
                  {HEADER.slice(0, 5).map((h) => (
                    <Th key={h}>{h}</Th>
                  ))}
                  <Th>Kết quả</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <Tr key={r.line} className={r.status === "error" ? "bg-danger-soft/60" : undefined}>
                    <Td className="tabular-nums">{r.line}</Td>
                    {r.cells.slice(0, 5).map((c, i) => (
                      <Td key={i} className="whitespace-nowrap">
                        {c}
                      </Td>
                    ))}
                    <Td>
                      <span
                        className={`flex items-center gap-1 text-sm ${r.status === "error" ? "text-destructive" : r.status === "new" ? "text-success" : "text-muted-foreground"}`}
                      >
                        {r.status === "error" ? <CircleAlert className="size-4 shrink-0" /> : <Check className="size-4 shrink-0" />} {r.message}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>

          <FormSection title="Cài đặt nhập" defaultOpen>
            <Field label="Kiểu nhập" htmlFor="up-type">
              <NativeSelect id="up-type" className="w-auto" value={uutype} onChange={(e) => setUutype(e.target.value)}>
                <option value="addnew">Chỉ thêm mới, bỏ qua tài khoản đã có</option>
                <option value="addupdate">Thêm mới và cập nhật tài khoản đã có</option>
                <option value="update">Chỉ cập nhật tài khoản đã có</option>
              </NativeSelect>
            </Field>
            <Field label="Mật khẩu người dùng mới" htmlFor="up-pwd">
              <NativeSelect id="up-pwd" className="w-auto" value={pwd} onChange={(e) => setPwd(e.target.value)}>
                <option value="generate">Tạo mật khẩu và gửi email</option>
                <option value="field">Lấy từ cột password trong file</option>
              </NativeSelect>
            </Field>
            <Field label="Bắt đổi mật khẩu">
              <CheckRow checked={forcechange} onChange={setForcechange} label="Ở lần đăng nhập đầu" />
            </Field>
            <ShowMore count={3}>
              <Field label="Cho phép đổi tên đăng nhập">
                <CheckRow checked={false} onChange={() => {}} label="Không" disabled />
              </Field>
              <Field label="Giá trị mặc định: Thành phố" htmlFor="up-city">
                <NativeSelect id="up-city" className="w-auto" defaultValue="Hồ Chí Minh">
                  <option>Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                </NativeSelect>
              </Field>
              <Field label="Giá trị mặc định: Đơn vị" htmlFor="up-inst">
                <NativeSelect id="up-inst" className="w-auto" defaultValue="VIGO - Văn phòng chính">
                  <option>VIGO - Văn phòng chính</option>
                  <option>VIGO - Chi nhánh Hồ Chí Minh</option>
                  <option>VIGO - Chi nhánh Hà Nội</option>
                </NativeSelect>
              </Field>
            </ShowMore>
          </FormSection>

          <StickySaveBar>
            <Button variant="ghost" asChild>
              <Link href="/admin/users">Hủy</Link>
            </Button>
            <Button
              disabled={!toCreate.length}
              onClick={() => {
                const now = Math.floor(Date.now() / 1000);
                for (const r of toCreate) {
                  const [username, firstname, lastname, email, cohort = "", idnumber = "", department = ""] = r.cells.map((x) => x.trim());
                  const co = ds.cohorts.find((x) => x.idnumber === cohort || x.name === cohort);
                  const user: AdminUser = {
                    id: newId(),
                    username: username.toLowerCase(),
                    firstname,
                    lastname,
                    fullname: `${lastname} ${firstname}`,
                    email,
                    idnumber,
                    department,
                    institution: "VIGO - Văn phòng chính",
                    city: "Hồ Chí Minh",
                    auth: "manual",
                    suspended: false,
                    firstaccess: 0,
                    lastaccess: 0,
                    timecreated: now,
                    customfields: [{ shortname: "phongban", name: "Phòng ban", value: co?.name ?? "" }],
                    systemroles: [],
                  };
                  actions.addUser(user, co?.id);
                }
                router.push("/admin/users");
              }}
            >
              Tạo {toCreate.length} người dùng
            </Button>
          </StickySaveBar>
        </div>
      )}
    </AdminPage>
  );
}
