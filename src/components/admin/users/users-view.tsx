"use client";

/**
 * Admin USER-02: danh sách người dùng có phòng ban, vai trò; lọc theo phòng ban, trạng thái.
 * Moodle: /admin/user.php (Browse list of users, cột thêm qua Show user identity / profile field phongban).
 */
import Link from "next/link";
import { useState } from "react";
import { Pencil, Upload, UserPlus, Users } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { userCohorts, userLastAccess } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { formatRelative } from "@/lib/utils";
import type { AdminUser } from "@/types/moodle-admin";
import { SearchBox, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { NativeSelect } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";

const SYSROLE = { manager: "Quản lý", coursecreator: "Người tạo khóa" };

function UserStatus({ u }: { u: AdminUser }) {
  if (u.suspended) return <Badge variant="danger">Tạm khóa</Badge>;
  if (!u.firstaccess) return <Badge variant="warning">Chưa đăng nhập</Badge>;
  return <Badge variant="success">Đang hoạt động</Badge>;
}

export function UsersView() {
  const { ds } = useAdmin();
  const [q, setQ] = useState("");
  const [cohort, setCohort] = useState("all");
  const [status, setStatus] = useState("all");
  const term = q.trim().toLowerCase();
  const rows = ds.users
    .filter(
      (u) =>
        (!term || u.fullname.toLowerCase().includes(term) || u.email.includes(term) || u.username.includes(term)) &&
        (cohort === "all" || userCohorts(ds, u.id).some((c) => String(c.id) === cohort)) &&
        (status === "all" ||
          (status === "suspended" && u.suspended) ||
          (status === "never" && !u.firstaccess && !u.suspended) ||
          (status === "active" && u.firstaccess && !u.suspended)),
    )
    .sort((a, b) => a.fullname.localeCompare(b.fullname, "vi"));

  return (
    <AdminPage>
      <AdminPageHeader
        title="Người dùng"
        description={`${ds.users.length} tài khoản`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/users/upload">
                <Upload /> Nhập từ CSV
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/users/new">
                <UserPlus /> Thêm người dùng
              </Link>
            </Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Tìm theo tên, email, tên đăng nhập" />
        <NativeSelect aria-label="Phòng ban" className="w-auto" value={cohort} onChange={(e) => setCohort(e.target.value)}>
          <option value="all">Mọi phòng ban</option>
          {ds.cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect aria-label="Trạng thái" className="w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Mọi trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="never">Chưa đăng nhập</option>
          <option value="suspended">Tạm khóa</option>
        </NativeSelect>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={Users} title="Không có người dùng phù hợp" description="Đổi từ khóa hoặc bỏ bớt bộ lọc." />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Họ tên</Th>
                <Th>Phòng ban</Th>
                <Th>Chức danh</Th>
                <Th>Vai trò hệ thống</Th>
                <Th>Truy cập cuối</Th>
                <Th>Trạng thái</Th>
                <Th className="text-right">Hành động</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const last = userLastAccess(ds, u);
                return (
                  <Tr key={u.id}>
                    <Td>
                      <p className="font-medium whitespace-nowrap">{u.fullname}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </Td>
                    <Td className="whitespace-nowrap">{userCohorts(ds, u.id).map((c) => c.name).join(", ") || "-"}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{u.department}</Td>
                    <Td>{u.systemroles.map((r) => SYSROLE[r]).join(", ") || <span className="text-muted-foreground">-</span>}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{last ? formatRelative(last) : "Chưa bao giờ"}</Td>
                    <Td>
                      <UserStatus u={u} />
                    </Td>
                    <Td className="text-right">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/admin/users/${u.id}/edit`}>
                          <Pencil /> Sửa
                        </Link>
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </AdminPage>
  );
}
