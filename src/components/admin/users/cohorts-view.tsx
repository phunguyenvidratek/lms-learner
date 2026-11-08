"use client";

/**
 * Admin COH-01 (Cohort đổi tên thành Phòng ban, ẩn cột kỹ thuật Source), COH-02 (khóa đang đồng bộ của phòng ban).
 * Moodle: /cohort/index.php (+ /cohort/edit.php, /cohort/assign.php).
 */
import Link from "next/link";
import { useState } from "react";
import { Building2, Plus, RefreshCcw, UserPlus, Users } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cohortMembersOf, cohortSyncCourses } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { stripHtml } from "@/lib/utils";
import type { Cohort } from "@/types/moodle-admin";
import { SearchBox, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { Textarea } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";

function MembersDialog({ cohort, onClose }: { cohort: Cohort; onClose: () => void }) {
  const { ds, actions } = useAdmin();
  const [q, setQ] = useState("");
  const members = cohortMembersOf(ds, cohort.id);
  const ids = new Set(members.map((m) => m.id));
  const term = q.trim().toLowerCase();
  const candidates = term ? ds.users.filter((u) => !ids.has(u.id) && (u.fullname.toLowerCase().includes(term) || u.email.includes(term))).slice(0, 5) : [];
  const synced = cohortSyncCourses(ds, cohort.id).filter((s) => s.active);
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thành viên: {cohort.name}</DialogTitle>
          <DialogDescription>
            {synced.length
              ? `Người thêm vào sẽ tự được ghi danh ${synced.length} khóa đang đồng bộ.`
              : "Phòng ban chưa đồng bộ khóa nào."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <SearchBox value={q} onChange={setQ} placeholder="Thêm người: tìm theo tên hoặc email" className="sm:w-full" />
          {candidates.length > 0 && (
            <ul className="divide-y rounded-md border">
              {candidates.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                  <span>
                    {u.fullname} <span className="text-muted-foreground">· {u.email}</span>
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      actions.addCohortMembers([{ cohortid: cohort.id, userid: u.id, timeadded: Math.floor(Date.now() / 1000) }]);
                      setQ("");
                    }}
                  >
                    <UserPlus /> Thêm
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul className="max-h-72 divide-y overflow-y-auto rounded-lg border">
          {members.map((u) => (
            <li key={u.id} className="px-3 py-2 text-sm">
              <p className="font-medium">{u.fullname}</p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
            </li>
          ))}
          {!members.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">Chưa có thành viên.</li>}
        </ul>
        <DialogFooter>
          <Button onClick={onClose}>Xong</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewCohortDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { ds, actions } = useAdmin();
  const [name, setName] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [description, setDescription] = useState("");
  const dup = ds.cohorts.some((c) => c.idnumber && c.idnumber === idnumber.trim());
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm phòng ban</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Tên phòng ban</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Mã phòng ban</span>
            <Input value={idnumber} onChange={(e) => setIdnumber(e.target.value)} placeholder="Ví dụ: KD-DN" />
            {dup && <span className="text-xs text-destructive">Mã đã được dùng.</span>}
            <span className="block text-xs text-muted-foreground">Dùng ở cột cohort1 khi nhập người dùng từ CSV.</span>
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Mô tả</span>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            disabled={!name.trim() || dup}
            onClick={() => {
              actions.addCohort({
                id: newId(),
                name: name.trim(),
                idnumber: idnumber.trim(),
                description: description.trim() ? `<p>${description.trim()}</p>` : "",
                visible: true,
                component: "",
                timecreated: Math.floor(Date.now() / 1000),
              });
              setName("");
              setIdnumber("");
              setDescription("");
              onOpenChange(false);
            }}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CohortsView() {
  const { ds } = useAdmin();
  const [q, setQ] = useState("");
  const [members, setMembers] = useState<Cohort | null>(null);
  const [create, setCreate] = useState(false);
  const term = q.trim().toLowerCase();
  const rows = ds.cohorts.filter((c) => !term || c.name.toLowerCase().includes(term) || c.idnumber.toLowerCase().includes(term));

  return (
    <AdminPage>
      <AdminPageHeader
        title="Phòng ban"
        description="Nhóm nhân viên theo phòng ban. Dùng để ghi danh hàng loạt và đồng bộ tự động vào khóa."
        actions={
          <Button onClick={() => setCreate(true)}>
            <Plus /> Thêm phòng ban
          </Button>
        }
      />
      <div className="mb-4">
        <SearchBox value={q} onChange={setQ} placeholder="Tìm phòng ban" />
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={Building2} title="Không có phòng ban phù hợp" />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Phòng ban</Th>
                <Th>Mô tả</Th>
                <Th className="text-right">Số người</Th>
                <Th>Khóa đang đồng bộ</Th>
                <Th className="text-right">Hành động</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const synced = cohortSyncCourses(ds, c.id);
                return (
                  <Tr key={c.id}>
                    <Td>
                      <p className="font-medium whitespace-nowrap">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.idnumber}</p>
                    </Td>
                    <Td className="max-w-xs text-muted-foreground">{stripHtml(c.description) || "-"}</Td>
                    <Td className="text-right tabular-nums">{cohortMembersOf(ds, c.id).length}</Td>
                    <Td>
                      {synced.length ? (
                        <div className="flex flex-wrap gap-1">
                          {synced.map(({ course, active }) => (
                            <Link key={course.id} href={`/admin/courses/${course.id}/enrolments`}>
                              <Badge variant={active ? "secondary" : "muted"} className="hover:underline">
                                <RefreshCcw /> {course.shortname}
                                {!active && " (tắt)"}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Chưa đồng bộ</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => setMembers(c)}>
                        <Users /> Thành viên
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
      {members && <MembersDialog cohort={members} onClose={() => setMembers(null)} />}
      <NewCohortDialog open={create} onOpenChange={setCreate} />
    </AdminPage>
  );
}
