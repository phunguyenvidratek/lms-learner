"use client";

/**
 * Admin ENR-02: hộp Ghi danh giữ 3 phần của Moodle (người dùng, phòng ban, vai trò), thêm giải thích
 * "Ghi danh 1 lần" khác "Đồng bộ tự động" và link sang Cách ghi danh.
 * Moodle: modal enrol_manual (Enrol users) trên /user/index.php?id=
 */
import Link from "next/link";
import { useState } from "react";
import { Info, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cohortMembersOf, courseEnrolments, ROLE_STUDENT } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import type { UserEnrolment } from "@/types/moodle-admin";
import { NativeSelect, ShowMore } from "../common/form";

export function EnrolDialog({ courseId, open, onOpenChange, onDone }: { courseId: number; open: boolean; onOpenChange: (v: boolean) => void; onDone?: (n: number) => void }) {
  const { ds, actions } = useAdmin();
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<number[]>([]);
  const [cohorts, setCohorts] = useState<number[]>([]);
  const [role, setRole] = useState(ROLE_STUDENT);
  const [duration, setDuration] = useState(0);
  const enrolled = new Set(courseEnrolments(ds, courseId, null).map((e) => e.user.id));
  const manual = ds.enrolInstances.find((i) => i.courseid === courseId && i.enrol === "manual");
  const term = q.trim().toLowerCase();
  const matches = term
    ? ds.users.filter((u) => !users.includes(u.id) && (u.fullname.toLowerCase().includes(term) || u.email.includes(term))).slice(0, 6)
    : [];
  const fromCohorts = cohorts.flatMap((c) => cohortMembersOf(ds, c).map((u) => u.id));
  const targets = [...new Set([...users, ...fromCohorts])].filter((id) => !enrolled.has(id));

  const reset = () => {
    setQ("");
    setUsers([]);
    setCohorts([]);
    setRole(ROLE_STUDENT);
    setDuration(0);
  };

  const submit = () => {
    if (!manual) return;
    const now = Math.floor(Date.now() / 1000);
    const ues: UserEnrolment[] = targets.map((userid) => ({
      id: newId(),
      enrolid: manual.id,
      userid,
      status: 0,
      timestart: now,
      timeend: duration ? now + duration * 86400 : 0,
      timecreated: now,
    }));
    actions.addEnrolments([], ues, role === ROLE_STUDENT ? [] : targets.map((userid) => ({ courseid: courseId, userid, roleid: role })));
    onDone?.(targets.length);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ghi danh người dùng</DialogTitle>
          <DialogDescription>Thêm người vào khóa bằng Ghi danh thủ công.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="enrol-users" className="text-sm font-medium">
              Chọn người dùng
            </label>
            {users.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {users.map((id) => {
                  const u = ds.users.find((x) => x.id === id)!;
                  return (
                    <Badge key={id} variant="secondary" className="gap-1 pr-1">
                      {u.fullname}
                      <button type="button" onClick={() => setUsers(users.filter((x) => x !== id))} aria-label={`Bỏ ${u.fullname}`}>
                        <X />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            <Input id="enrol-users" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên hoặc email" autoComplete="off" />
            {matches.length > 0 && (
              <ul className="divide-y rounded-md border">
                {matches.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-60"
                      disabled={enrolled.has(u.id)}
                      onClick={() => {
                        setUsers([...users, u.id]);
                        setQ("");
                      }}
                    >
                      <span>
                        {u.fullname} <span className="text-muted-foreground">· {u.email}</span>
                      </span>
                      {enrolled.has(u.id) && <span className="text-xs text-muted-foreground">Đã ghi danh</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="enrol-cohort" className="text-sm font-medium">
              Chọn phòng ban
            </label>
            <NativeSelect
              id="enrol-cohort"
              value=""
              onChange={(e) => {
                const id = Number(e.target.value);
                if (id && !cohorts.includes(id)) setCohorts([...cohorts, id]);
              }}
            >
              <option value="">Thêm phòng ban...</option>
              {ds.cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({cohortMembersOf(ds, c.id).length} người)
                </option>
              ))}
            </NativeSelect>
            {cohorts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {cohorts.map((id) => (
                  <Badge key={id} variant="secondary" className="gap-1 pr-1">
                    {ds.cohorts.find((c) => c.id === id)?.name}
                    <button type="button" onClick={() => setCohorts(cohorts.filter((x) => x !== id))} aria-label="Bỏ phòng ban">
                      <X />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2.5 rounded-lg bg-warning-soft p-3 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-warning" />
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Ghi danh 1 lần:</span> chỉ thêm người đang ở trong phòng ban lúc này. Người vào phòng ban sau sẽ
                  không tự có trong khóa.
                </p>
                <p>
                  Muốn người mới tự vào khóa, dùng{" "}
                  <Link href={`/admin/courses/${courseId}/enrolments`} className="font-semibold text-primary underline">
                    Đồng bộ tự động theo phòng ban
                  </Link>{" "}
                  ở trang Cách ghi danh.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="enrol-role" className="text-sm font-medium">
              Gán vai trò
            </label>
            <NativeSelect id="enrol-role" value={role} onChange={(e) => setRole(Number(e.target.value))}>
              {ds.roles
                .filter((r) => r.shortname !== "manager" && r.shortname !== "coursecreator")
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </NativeSelect>
          </div>

          <ShowMore count={2}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="font-medium">Bắt đầu từ</span>
                <NativeSelect defaultValue="now">
                  <option value="now">Hôm nay</option>
                  <option value="course">Ngày khóa bắt đầu</option>
                </NativeSelect>
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="font-medium">Thời hạn ghi danh</span>
                <NativeSelect value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                  <option value={0}>Không giới hạn</option>
                  <option value={30}>30 ngày</option>
                  <option value={60}>60 ngày</option>
                  <option value={90}>90 ngày</option>
                </NativeSelect>
              </label>
            </div>
          </ShowMore>
        </div>
        <DialogFooter className="items-center">
          <p className="mr-auto text-sm text-muted-foreground">{targets.length ? `Sẽ ghi danh ${targets.length} người` : "Chưa chọn ai mới"}</p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={!targets.length} onClick={submit}>
            Ghi danh {targets.length || ""} người
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
