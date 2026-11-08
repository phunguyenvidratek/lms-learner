"use client";

/**
 * Admin QUIZ-02 (chip loại câu, điểm, nút "Thêm câu hỏi từ Excel" là nút chính, ẩn cột Always latest),
 * QUIZ-03 (thang điểm bài kiểm tra có giải thích quy đổi).
 * Moodle: /mod/quiz/edit.php?cmid={cmid} (+ local_quizexcel cho nút Excel).
 */
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileQuestion, Library, Plus, Shuffle } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findAdminModule, quizQuestionsOf, quizSettingsOf, effectiveQuiz } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { stripHtml } from "@/lib/utils";
import type { QuizQuestion } from "@/types/moodle";
import { NativeSelect } from "../common/form";
import { SectionHeader } from "../layout/page-header";
import { downloadTemplate } from "./quiz-template";

export const QTYPE: Record<QuizQuestion["type"], { label: string; variant: "secondary" | "warning" | "success" }> = {
  multichoice: { label: "Chọn một", variant: "secondary" },
  multichoiceset: { label: "Chọn nhiều", variant: "warning" },
  truefalse: { label: "Đúng/Sai", variant: "success" },
};

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export function QuizQuestionsView({ cmid }: { cmid: number }) {
  const { ds, actions } = useAdmin();
  const found = findAdminModule(ds, cmid)!;
  const quiz = effectiveQuiz(ds, cmid);
  const settings = quizSettingsOf(ds, cmid);
  const questions = quizQuestionsOf(ds, cmid);
  const [repaginate, setRepaginate] = useState(false);
  const [perPage, setPerPage] = useState(settings.questionsperpage);
  const total = questions.length; // mỗi câu 1 điểm (maxmark mặc định)
  const max = quiz?.grade ?? 10;
  const pp = settings.questionsperpage;

  return (
    <div>
      <SectionHeader
        title="Câu hỏi"
        description={`${questions.length} câu · ${settings.attempts ? `${settings.attempts} lượt làm` : "Không giới hạn lượt"} · Đạt từ ${String(settings.gradepass).replace(".", ",")}/${max}`}
        actions={
          <>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download /> Tải file mẫu
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Plus /> Thêm <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${found.course.id}/question-banks`}>
                    <FileQuestion /> Câu hỏi mới
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${found.course.id}/question-banks`}>
                    <Library /> Từ ngân hàng câu hỏi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${found.course.id}/question-banks`}>
                    <Shuffle /> Câu hỏi ngẫu nhiên
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild>
              <Link href={`/admin/quiz/${cmid}/import`}>
                <FileSpreadsheet /> Thêm câu hỏi từ Excel
              </Link>
            </Button>
          </>
        }
      />

      <div className="mb-5 grid gap-4 rounded-xl border bg-card p-4 shadow-xs sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Thang điểm bài kiểm tra</p>
            <p className="text-2xl font-bold">{fmt(max)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tổng điểm các câu</p>
            <p className="text-2xl font-bold">{fmt(total)}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground sm:border-l sm:pl-4">
          Học viên được chấm trên tổng điểm các câu rồi quy đổi về thang {fmt(max)}.{" "}
          {total > 0 && (
            <>
              Ví dụ đúng {Math.max(1, Math.round(total * 0.8))}/{total} điểm câu hỏi thành{" "}
              <span className="font-medium text-foreground">{fmt((Math.max(1, Math.round(total * 0.8)) / total) * max)}</span> điểm bài.
            </>
          )}
        </p>
      </div>

      {questions.length === 0 ? (
        <EmptyState
          icon={FileQuestion}
          title="Bài kiểm tra chưa có câu hỏi"
          description="Nhập câu hỏi từ file Excel theo mẫu, hoặc thêm từ ngân hàng câu hỏi."
          action={
            <Button asChild>
              <Link href={`/admin/quiz/${cmid}/import`}>
                <FileSpreadsheet /> Thêm câu hỏi từ Excel
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">{pp ? `${pp} câu mỗi trang` : "Mọi câu trên một trang"}</p>
            <Button variant="ghost" size="sm" onClick={() => setRepaginate(true)}>
              Sắp xếp lại trang
            </Button>
          </div>
          <ol className="divide-y rounded-xl border bg-card shadow-xs">
            {questions.map((q, i) => (
              <li key={`${q.slot}-${i}`}>
                {pp > 0 && i % pp === 0 && (
                  <p className="bg-muted/50 px-4 py-1 text-xs font-medium text-muted-foreground">Trang {Math.floor(i / pp) + 1}</p>
                )}
                <div className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 w-6 shrink-0 text-right text-sm font-semibold text-muted-foreground">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm">{stripHtml(q.text)}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant={QTYPE[q.type].variant}>{QTYPE[q.type].label}</Badge>
                      <span className="text-xs text-muted-foreground">{q.options.length} phương án</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums">{fmt(1)} điểm</span>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      <Dialog open={repaginate} onOpenChange={setRepaginate}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sắp xếp lại trang</DialogTitle>
          </DialogHeader>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Trang mới sau mỗi</span>
            <NativeSelect value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
              <option value={0}>Không ngắt trang</option>
              {[1, 2, 5, 10].map((n) => (
                <option key={n} value={n}>
                  {n} câu
                </option>
              ))}
            </NativeSelect>
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRepaginate(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                actions.updateQuizSettings(cmid, { questionsperpage: perPage });
                setRepaginate(false);
              }}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
