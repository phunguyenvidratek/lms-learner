"use client";

/**
 * Admin ENR-01 (không có thanh chữ cái A-Z, chỉ tìm kiếm + bộ lọc),
 * ENR-03 (cột phòng ban, ngày ghi danh, % hoàn thành, trạng thái, truy cập cuối, xuất Excel).
 * Moodle: /user/index.php?id={courseId} (bảng participants, cột thêm qua Report builder nguồn Course participants).
 */
import Link from "next/link";
import { useState } from "react";
import { Download, Settings2, UserPlus, Users } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { courseEnrolments, courseRoster, enrolMethodName, roleName, ROLE_STUDENT, userCohorts, type RosterRow } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { formatDate, formatRelative } from "@/lib/utils";
import { downloadCsv, PercentBar, SearchBox, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { NativeSelect } from "../common/form";
import { SectionHeader } from "../layout/page-header";
import { EnrolDialog } from "./enrol-dialog";

const STATUS: Record<RosterRow["status"], { label: string; variant: "success" | "secondary" | "muted" }> = {
  completed: { label: "Hoàn thành", variant: "success" },
  inprogress: { label: "Đang học", variant: "secondary" },
  notstarted: { label: "Chưa bắt đầu", variant: "muted" },
};

export function ParticipantsView({ courseId }: { courseId: number }) {
  const { ds } = useAdmin();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [q, setQ] = useState("");
  const [cohort, setCohort] = useState("all");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [role, setRole] = useState(String(ROLE_STUDENT));

  const students = courseRoster(ds, courseId);
  const teachers = courseEnrolments(ds, courseId, null).filter((e) => e.roleid !== ROLE_STUDENT);
  const base: RosterRow[] =
    role === String(ROLE_STUDENT)
      ? students
      : teachers
          .filter((t) => role === "all-staff" || String(t.roleid) === role)
          .map((t) => ({ ...t, progress: 0, done: 0, total: 0, status: "notstarted" as const }));
  const term = q.trim().toLowerCase();
  const rows = base.filter(
    (r) =>
      (!term || r.user.fullname.toLowerCase().includes(term) || r.user.email.includes(term)) &&
      (cohort === "all" || userCohorts(ds, r.user.id).some((c) => String(c.id) === cohort)) &&
      (status === "all" || (status === "suspended" ? r.suspended : !r.suspended && r.status === status)) &&
      (method === "all" || r.methods.some((m) => m.enrol === method)),
  );
  const isStudents = role === String(ROLE_STUDENT);

  const exportCsv = () =>
    downloadCsv(`hoc-vien-khoa-${courseId}.csv`, [
      ["Họ tên", "Email", "Phòng ban", "Ngày ghi danh", "% hoàn thành", "Trạng thái", "Ngày hoàn thành", "Truy cập khóa cuối"],
      ...rows.map((r) => [
        r.user.fullname,
        r.user.email,
        userCohorts(ds, r.user.id).map((c) => c.name).join(", "),
        formatDate(r.timestart),
        r.progress,
        r.suspended ? "Tạm dừng" : STATUS[r.status].label,
        r.completedAt ? formatDate(r.completedAt) : "",
        r.lastaccess ? formatDate(r.lastaccess) : "Chưa vào",
      ]),
    ]);

  return (
    <div>
      <SectionHeader
        title="Học viên"
        description={`${students.length} học viên, ${teachers.length} giảng viên`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/admin/courses/${courseId}/enrolments`}>
                <Settings2 /> Cách ghi danh
              </Link>
            </Button>
            <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
              <Download /> Xuất Excel
            </Button>
            <Button onClick={() => setOpen(true)}>
              <UserPlus /> Ghi danh người dùng
            </Button>
          </>
        }
      />
      {notice && (
        <p role="status" className="mb-4 rounded-lg bg-success-soft px-4 py-2.5 text-sm text-success">
          {notice}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Tìm theo tên hoặc email" />
        <NativeSelect aria-label="Vai trò" className="w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value={ROLE_STUDENT}>Học viên</option>
          <option value="all-staff">Giảng viên, trợ giảng</option>
        </NativeSelect>
        <NativeSelect aria-label="Phòng ban" className="w-auto" value={cohort} onChange={(e) => setCohort(e.target.value)}>
          <option value="all">Mọi phòng ban</option>
          {ds.cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
        {isStudents && (
          <NativeSelect aria-label="Trạng thái" className="w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Mọi trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="inprogress">Đang học</option>
            <option value="notstarted">Chưa bắt đầu</option>
            <option value="suspended">Tạm dừng</option>
          </NativeSelect>
        )}
        <NativeSelect aria-label="Cách ghi danh" className="w-auto" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="all">Mọi cách ghi danh</option>
          <option value="manual">Ghi danh thủ công</option>
          <option value="cohort">Đồng bộ phòng ban</option>
        </NativeSelect>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title={base.length ? "Không có ai phù hợp bộ lọc" : "Khóa chưa có học viên"}
          description={base.length ? "Đổi từ khóa hoặc bỏ bớt bộ lọc." : "Ghi danh người dùng, phòng ban, hoặc bật đồng bộ tự động theo phòng ban."}
          action={
            !base.length && (
              <Button onClick={() => setOpen(true)}>
                <UserPlus /> Ghi danh người dùng
              </Button>
            )
          }
        />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Họ tên</Th>
                <Th>Phòng ban</Th>
                {!isStudents && <Th>Vai trò</Th>}
                <Th>Cách ghi danh</Th>
                <Th>Ngày ghi danh</Th>
                {isStudents && <Th>Hoàn thành</Th>}
                {isStudents && <Th>Trạng thái</Th>}
                <Th>Truy cập khóa cuối</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Tr key={r.user.id}>
                  <Td>
                    <p className="font-medium whitespace-nowrap">{r.user.fullname}</p>
                    <p className="text-xs text-muted-foreground">{r.user.email}</p>
                  </Td>
                  <Td className="whitespace-nowrap">{userCohorts(ds, r.user.id).map((c) => c.name).join(", ") || "-"}</Td>
                  {!isStudents && <Td>{roleName(ds, r.roleid)}</Td>}
                  <Td>
                    <div className="flex flex-col gap-1">
                      {r.methods.map((m) => (
                        <span key={m.id} className="text-xs whitespace-nowrap text-muted-foreground">
                          {m.enrol === "cohort" ? "Đồng bộ phòng ban" : enrolMethodName(ds, m)}
                        </span>
                      ))}
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap">{formatDate(r.timestart)}</Td>
                  {isStudents && (
                    <Td>
                      <PercentBar value={r.progress} />
                    </Td>
                  )}
                  {isStudents && (
                    <Td>
                      {r.suspended ? <Badge variant="danger">Tạm dừng</Badge> : <Badge variant={STATUS[r.status].variant}>{STATUS[r.status].label}</Badge>}
                    </Td>
                  )}
                  <Td className="whitespace-nowrap text-muted-foreground">{r.lastaccess ? formatRelative(r.lastaccess) : "Chưa vào"}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
      <EnrolDialog courseId={courseId} open={open} onOpenChange={setOpen} onDone={(n) => setNotice(`Đã ghi danh ${n} người vào khóa.`)} />
    </div>
  );
}
