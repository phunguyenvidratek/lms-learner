"use client";

/**
 * Admin QUIZ-06: ngân hàng câu hỏi dễ hiểu (hướng dẫn ngắn đầu trang, bank dùng chung của khóa + bank riêng từng quiz).
 * Moodle 5.1: /question/banks.php?courseid={id}. Trang chọn khóa (/admin/question-banks) là lối vào từ sidebar,
 * Moodle không có trang cấp site (Câu hỏi cho BA admin số 1).
 */
import Link from "next/link";
import { BookOpen, Info, Library } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { courseSections, quizQuestionsOf } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { Table, TableWrap, Td, Th, Tr } from "../common/data";
import { AdminPage, AdminPageHeader, SectionHeader } from "../layout/page-header";

function Guide() {
  return (
    <div className="mb-5 flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
      <Info className="mt-0.5 size-5 shrink-0 text-brand-600" />
      <div className="space-y-1">
        <p className="font-semibold">Câu hỏi nằm ở đâu?</p>
        <p>
          Mỗi bài kiểm tra có ngân hàng riêng, chứa câu hỏi nhập cho bài đó. Muốn dùng lại câu hỏi cho bài khác, đặt câu hỏi vào
          <span className="font-medium"> Ngân hàng chung của khóa</span>, đặt tên danh mục theo phần (Phần 1, Phần 2...).
        </p>
      </div>
    </div>
  );
}

export function useCourseBanks(courseId: number) {
  const { ds } = useAdmin();
  const mods = courseSections(ds, courseId).flatMap((s) => s.modules);
  const shared = mods.find((m) => m.modname === "qbank");
  const quizzes = mods.filter((m) => m.modname === "quiz").map((q) => ({ q, count: quizQuestionsOf(ds, q.id).length }));
  return { shared, quizzes };
}

export function CourseBanksView({ courseId }: { courseId: number }) {
  const { shared, quizzes } = useCourseBanks(courseId);
  return (
    <div>
      <SectionHeader title="Ngân hàng câu hỏi" description="Câu hỏi của khóa, theo ngân hàng." />
      <Guide />
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Ngân hàng</Th>
              <Th>Loại</Th>
              <Th className="text-right">Số câu</Th>
              <Th className="text-right">Hành động</Th>
            </tr>
          </thead>
          <tbody>
            <Tr>
              <Td className="font-medium">{shared?.name ?? "Ngân hàng chung của khóa"}</Td>
              <Td>
                <Badge variant="secondary">Dùng chung trong khóa</Badge>
              </Td>
              <Td className="text-right tabular-nums">0</Td>
              <Td className="text-right text-sm text-muted-foreground">Chưa có câu hỏi</Td>
            </Tr>
            {quizzes.map(({ q, count }) => (
              <Tr key={q.id}>
                <Td className="font-medium">{q.name}</Td>
                <Td>
                  <Badge variant="muted">Riêng của bài kiểm tra</Badge>
                </Td>
                <Td className="text-right tabular-nums">{count}</Td>
                <Td className="text-right">
                  <Button variant="link" size="sm" asChild>
                    <Link href={`/admin/quiz/${q.id}/edit`}>Xem câu hỏi</Link>
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </div>
  );
}

function CourseBankRow({ id, name, short }: { id: number; name: string; short: string }) {
  const { quizzes } = useCourseBanks(id);
  const total = quizzes.reduce((s, x) => s + x.count, 0);
  return (
    <Tr>
      <Td>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{short}</p>
      </Td>
      <Td className="text-right tabular-nums">{quizzes.length + 1}</Td>
      <Td className="text-right tabular-nums">{total}</Td>
      <Td className="text-right">
        <Button variant="link" size="sm" asChild>
          <Link href={`/admin/courses/${id}/question-banks`}>Mở ngân hàng</Link>
        </Button>
      </Td>
    </Tr>
  );
}

export function QuestionBanksIndexView() {
  const { ds } = useAdmin();
  return (
    <AdminPage>
      <AdminPageHeader title="Ngân hàng câu hỏi" description="Câu hỏi lưu theo từng khóa. Chọn khóa để xem ngân hàng." />
      <Guide />
      {ds.courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="Chưa có khóa học" />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Khóa học</Th>
                <Th className="text-right">Số ngân hàng</Th>
                <Th className="text-right">Số câu hỏi</Th>
                <Th className="text-right">
                  <Library className="ml-auto size-4" aria-label="Hành động" />
                </Th>
              </tr>
            </thead>
            <tbody>
              {ds.courses.map((c) => (
                <CourseBankRow key={c.id} id={c.id} name={c.fullname} short={c.shortname} />
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </AdminPage>
  );
}
