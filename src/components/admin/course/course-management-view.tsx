"use client";

/**
 * Admin CAT-01 (nhãn chữ cho hành động, nút Tạo khóa mới primary, "6 khóa"), CAT-02 (cây danh mục trái 30%,
 * bảng khóa phải đủ cột: ảnh, tên, mã, trạng thái, học viên, cập nhật, hành động; thanh "Với khóa đã chọn"),
 * CAT-03 (tên danh mục đã sửa chính tả Training).
 * Moodle: /course/management.php?categoryid= (giữ URL và hành động core: sửa, ẩn/hiện, di chuyển).
 */
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Eye, EyeOff, Folder, FolderPlus, Pencil, Plus, Settings } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { courseStats } from "@/lib/admin";
import { newId, useAdmin } from "@/lib/store/admin-store";
import { cn, formatDate } from "@/lib/utils";
import type { CourseCategory } from "@/types/moodle-admin";
import { SearchBox, Table, TableWrap, Td, Th, Tr } from "../common/data";
import { NativeSelect } from "../common/form";
import { AdminPage, AdminPageHeader } from "../layout/page-header";
import { CourseThumb } from "./course-thumb";
import { VisibilityBadge } from "./my-courses-view";

function CategoryTree({ categories, active, onPick }: { categories: CourseCategory[]; active: number | null; onPick: (id: number | null) => void }) {
  const roots = categories.filter((c) => c.parent === 0).sort((a, b) => a.sortorder - b.sortorder);
  const total = (c: CourseCategory): number => c.coursecount + categories.filter((x) => x.parent === c.id).reduce((s, x) => s + total(x), 0);
  const Item = ({ c, depth }: { c: CourseCategory; depth: number }) => (
    <>
      <li>
        <button
          type="button"
          onClick={() => onPick(c.id)}
          aria-current={active === c.id ? "true" : undefined}
          className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted", active === c.id && "bg-brand-50 font-medium text-brand-700")}
          style={{ paddingLeft: 8 + depth * 16 }}
        >
          <Folder className="size-4 shrink-0" />
          <span className="flex-1 truncate">{c.name}</span>
          <span className="text-xs text-muted-foreground">{total(c)} khóa</span>
        </button>
      </li>
      {categories
        .filter((x) => x.parent === c.id)
        .sort((a, b) => a.sortorder - b.sortorder)
        .map((x) => (
          <Item key={x.id} c={x} depth={depth + 1} />
        ))}
    </>
  );
  return (
    <ul className="space-y-0.5">
      <li>
        <button
          type="button"
          onClick={() => onPick(null)}
          aria-current={active === null ? "true" : undefined}
          className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted", active === null && "bg-brand-50 font-medium text-brand-700")}
        >
          <BookOpen className="size-4" /> <span className="flex-1">Mọi danh mục</span>
        </button>
      </li>
      {roots.map((c) => (
        <Item key={c.id} c={c} depth={0} />
      ))}
    </ul>
  );
}

export function CourseManagementView({ initialCategory }: { initialCategory: number | null }) {
  const { ds, actions } = useAdmin();
  const [cat, setCat] = useState<number | null>(initialCategory);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [moveTo, setMoveTo] = useState(0);
  const [newCat, setNewCat] = useState(false);
  const [catName, setCatName] = useState("");
  const [catParent, setCatParent] = useState(0);
  const descendants = (id: number): number[] => [id, ...ds.categories.filter((c) => c.parent === id).flatMap((c) => descendants(c.id))];
  const inCat = cat === null ? null : descendants(cat);
  const term = q.trim().toLowerCase();
  const courses = ds.courses.filter(
    (c) => (!inCat || inCat.includes(c.categoryid)) && (!term || c.fullname.toLowerCase().includes(term) || c.shortname.toLowerCase().includes(term)),
  );
  const current = ds.categories.find((c) => c.id === cat);
  const pick = (id: number | null) => {
    setCat(id);
    setPicked([]);
    window.history.replaceState(null, "", id ? `/admin/courses?categoryid=${id}` : "/admin/courses");
  };

  return (
    <AdminPage>
      <AdminPageHeader
        title="Quản lý khóa và danh mục"
        description="Chọn danh mục bên trái để lọc. Tạo khóa mới sẽ vào danh mục đang chọn."
        actions={
          <>
            <Button variant="outline" onClick={() => setNewCat(true)}>
              <FolderPlus /> Tạo danh mục
            </Button>
            <Button asChild>
              <Link href={`/admin/courses/new${cat ? `?category=${cat}` : ""}`}>
                <Plus /> Tạo khóa mới
              </Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(240px,30%)_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border bg-card p-3 shadow-xs">
          <p className="mb-2 px-2 text-sm font-semibold">Danh mục</p>
          <CategoryTree categories={ds.categories} active={cat} onPick={pick} />
        </aside>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto font-semibold">
              {current?.name ?? "Mọi danh mục"} <span className="font-normal text-muted-foreground">· {courses.length} khóa</span>
            </h2>
            <SearchBox value={q} onChange={setQ} placeholder="Tìm khóa" />
          </div>
          {picked.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-brand-50 px-3 py-2 text-sm">
              <span className="font-medium">Với {picked.length} khóa đã chọn:</span>
              <span>Chuyển sang</span>
              <NativeSelect className="h-8 w-auto py-0" value={moveTo} onChange={(e) => setMoveTo(Number(e.target.value))} aria-label="Danh mục đích">
                <option value={0}>Chọn danh mục</option>
                {ds.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parent ? "— " : ""}
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
              <Button
                size="sm"
                disabled={!moveTo}
                onClick={() => {
                  const target = ds.categories.find((c) => c.id === moveTo)!;
                  picked.forEach((id) => actions.updateCourse(id, { categoryid: target.id, coursecategory: target.name }));
                  setPicked([]);
                  setMoveTo(0);
                }}
              >
                Chuyển
              </Button>
              <Button size="sm" variant="outline" onClick={() => picked.forEach((id) => actions.updateCourse(id, { visible: 1 }))}>
                <Eye /> Hiện
              </Button>
              <Button size="sm" variant="outline" onClick={() => picked.forEach((id) => actions.updateCourse(id, { visible: 0 }))}>
                <EyeOff /> Ẩn
              </Button>
            </div>
          )}
          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Danh mục chưa có khóa"
              action={
                <Button asChild>
                  <Link href={`/admin/courses/new${cat ? `?category=${cat}` : ""}`}>
                    <Plus /> Tạo khóa mới
                  </Link>
                </Button>
              }
            />
          ) : (
            <TableWrap>
              <Table className="min-w-[760px]">
                <thead>
                  <tr>
                    <Th className="w-10">
                      <Checkbox checked={picked.length === courses.length} onCheckedChange={(v) => setPicked(v === true ? courses.map((c) => c.id) : [])} aria-label="Chọn tất cả khóa" />
                    </Th>
                    <Th>Khóa học</Th>
                    <Th>Trạng thái</Th>
                    <Th className="text-right">Học viên</Th>
                    <Th>Cập nhật</Th>
                    <Th className="text-right">Hành động</Th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <Tr key={c.id}>
                      <Td>
                        <Checkbox
                          checked={picked.includes(c.id)}
                          onCheckedChange={(v) => setPicked((cur) => (v === true ? [...cur, c.id] : cur.filter((x) => x !== c.id)))}
                          aria-label={`Chọn ${c.fullname}`}
                        />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-3">
                          <CourseThumb src={c.courseimage} alt="" className="aspect-video w-20 shrink-0 rounded-md" sizes="80px" />
                          <div className="min-w-0">
                            <Link href={`/admin/courses/${c.id}/edit`} className="font-medium hover:text-primary">
                              {c.fullname}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {c.shortname} · {c.coursecategory}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <VisibilityBadge visible={c.visible} />
                      </Td>
                      <Td className="text-right tabular-nums">{courseStats(ds, c.id).students}</Td>
                      <Td className="whitespace-nowrap text-muted-foreground">{formatDate(c.timemodified)}</Td>
                      <Td>
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/courses/${c.id}/edit`}>
                              <Pencil /> Soạn
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/courses/${c.id}/settings`}>
                              <Settings /> Cài đặt
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => actions.updateCourse(c.id, { visible: c.visible ? 0 : 1 })}>
                            {c.visible ? <EyeOff /> : <Eye />} {c.visible ? "Ẩn" : "Hiện"}
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          )}
        </div>
      </div>

      <Dialog open={newCat} onOpenChange={setNewCat}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo danh mục</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Danh mục cha</span>
              <NativeSelect value={catParent} onChange={(e) => setCatParent(Number(e.target.value))}>
                <option value={0}>Cấp cao nhất</option>
                {ds.categories
                  .filter((c) => c.parent === 0)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </NativeSelect>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Tên danh mục</span>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCat(false)}>
              Hủy
            </Button>
            <Button
              disabled={!catName.trim()}
              onClick={() => {
                const id = newId();
                actions.addCategory({
                  id,
                  name: catName.trim(),
                  idnumber: "",
                  description: "",
                  parent: catParent,
                  sortorder: 99,
                  coursecount: 0,
                  visible: 1,
                  depth: catParent ? 2 : 1,
                  path: catParent ? `/${catParent}/${id}` : `/${id}`,
                });
                setCatName("");
                setNewCat(false);
                pick(id);
              }}
            >
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
