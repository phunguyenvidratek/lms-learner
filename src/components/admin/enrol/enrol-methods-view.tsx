"use client";

/**
 * Admin ENR-04: trang cách ghi danh có nhãn chữ cho từng hành động (Ghi danh người, Tắt/Bật, Xóa),
 * Khách và Tự ghi danh đã tắt ở site nên không hiện. Thêm Đồng bộ phòng ban (ENR-02).
 * Moodle: /enrol/instances.php?id={courseId}, thêm mới qua /enrol/editinstance.php?type=cohort&courseid=
 */
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Info, Plus, RefreshCcw, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cohortMembersOf, enrolInstanceCount, enrolMethodName, roleName, ROLE_STUDENT } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { Table, TableWrap, Td, Th, Tr } from "../common/data";
import { ConfirmDialog } from "../common/confirm-dialog";
import { NativeSelect } from "../common/form";
import { SectionHeader } from "../layout/page-header";
import { EnrolDialog } from "./enrol-dialog";

export function EnrolMethodsView({ courseId }: { courseId: number }) {
  const { ds, actions } = useAdmin();
  const [enrolOpen, setEnrolOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [cohortId, setCohortId] = useState(0);
  const [role, setRole] = useState(ROLE_STUDENT);
  const [remove, setRemove] = useState<number | null>(null);
  const instances = ds.enrolInstances.filter((i) => i.courseid === courseId && i.enrol !== "guest" && i.enrol !== "self");
  const synced = new Set(instances.filter((i) => i.enrol === "cohort").map((i) => i.customint1));
  const available = ds.cohorts.filter((c) => !synced.has(c.id));

  return (
    <div>
      <SectionHeader
        title="Cách ghi danh"
        description="Người vào khóa bằng cách nào. Mỗi người có thể vào bằng nhiều cách."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/admin/courses/${courseId}/participants`}>Về danh sách học viên</Link>
            </Button>
            <Button
              onClick={() => {
                setCohortId(available[0]?.id ?? 0);
                setSyncOpen(true);
              }}
              disabled={!available.length}
            >
              <Plus /> Thêm đồng bộ phòng ban
            </Button>
          </>
        }
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="flex gap-2.5 rounded-xl border bg-card p-4 text-sm shadow-xs">
          <UserPlus className="mt-0.5 size-5 shrink-0 text-brand-600" />
          <p>
            <span className="font-semibold">Ghi danh thủ công:</span> thêm từng người hoặc cả phòng ban một lần. Người vào phòng ban sau không tự có trong khóa.
          </p>
        </div>
        <div className="flex gap-2.5 rounded-xl border bg-card p-4 text-sm shadow-xs">
          <RefreshCcw className="mt-0.5 size-5 shrink-0 text-success" />
          <p>
            <span className="font-semibold">Đồng bộ phòng ban:</span> mọi thành viên phòng ban luôn có trong khóa. Người mới vào phòng ban tự được ghi danh, người rời
            phòng ban bị gỡ.
          </p>
        </div>
      </div>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Cách ghi danh</Th>
              <Th className="text-right">Số người</Th>
              <Th>Vai trò gán</Th>
              <Th>Trạng thái</Th>
              <Th className="text-right">Hành động</Th>
            </tr>
          </thead>
          <tbody>
            {instances.map((i) => (
              <Tr key={i.id}>
                <Td className="font-medium">{enrolMethodName(ds, i)}</Td>
                <Td className="text-right tabular-nums">{enrolInstanceCount(ds, i)}</Td>
                <Td>{roleName(ds, i.roleid)}</Td>
                <Td>{i.status === 0 ? <Badge variant="success">Đang bật</Badge> : <Badge variant="muted">Đang tắt</Badge>}</Td>
                <Td>
                  <div className="flex flex-wrap justify-end gap-1">
                    {i.enrol === "manual" && (
                      <Button size="sm" variant="ghost" onClick={() => setEnrolOpen(true)}>
                        <UserPlus /> Ghi danh người
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => actions.setEnrolStatus(i.id, i.status === 0 ? 1 : 0)}>
                      {i.status === 0 ? <EyeOff /> : <Eye />} {i.status === 0 ? "Tắt" : "Bật"}
                    </Button>
                    {i.enrol === "cohort" && (
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setRemove(i.id)}>
                        <Trash2 /> Xóa
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="size-3.5" /> Khách và Tự ghi danh đã tắt ở cấp hệ thống nên không hiện.
      </p>

      <EnrolDialog courseId={courseId} open={enrolOpen} onOpenChange={setEnrolOpen} />

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm đồng bộ phòng ban</DialogTitle>
            <DialogDescription>Mọi thành viên của phòng ban được ghi danh tự động, kể cả người vào sau.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Phòng ban</span>
              <NativeSelect value={cohortId} onChange={(e) => setCohortId(Number(e.target.value))}>
                {available.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({cohortMembersOf(ds, c.id).length} người)
                  </option>
                ))}
              </NativeSelect>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Gán vai trò</span>
              <NativeSelect value={role} onChange={(e) => setRole(Number(e.target.value))}>
                <option value={ROLE_STUDENT}>Học viên</option>
              </NativeSelect>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncOpen(false)}>
              Hủy
            </Button>
            <Button
              disabled={!cohortId}
              onClick={() => {
                const now = Math.floor(Date.now() / 1000);
                actions.addEnrolments(
                  [
                    {
                      id: newId(),
                      courseid: courseId,
                      enrol: "cohort",
                      status: 0,
                      name: `Đồng bộ ${ds.cohorts.find((c) => c.id === cohortId)?.name ?? ""}`,
                      customint1: cohortId,
                      roleid: role,
                      enrolperiod: 0,
                      timecreated: now,
                    },
                  ],
                  [],
                );
                setSyncOpen(false);
              }}
            >
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {remove && (
        <ConfirmDialog
          open
          onOpenChange={(v) => !v && setRemove(null)}
          title="Xóa đồng bộ phòng ban?"
          description="Thành viên của phòng ban sẽ bị gỡ khỏi khóa nếu không được ghi danh bằng cách khác. Tiến độ học vẫn được giữ."
          confirmLabel="Xóa"
          destructive
          onConfirm={() => actions.deleteEnrolInstance(remove)}
        />
      )}
    </div>
  );
}
