"use client";

/**
 * Admin QUIZ-04: nhập câu hỏi Excel 3 bước (Tải mẫu, Chọn file, Xem trước có lỗi theo dòng và cột) rồi mới xác nhận.
 * Nút quay lại nằm ở breadcrumb. Moodle: /local/quizexcel/import.php?cmid={cmid} (plugin team tự làm).
 * Mockup: file .csv đọc thật; file .xlsx dùng 8 dòng mẫu có 2 dòng lỗi (src/lib/mock/admin/quiz-import.ts).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Check, CircleAlert, Download, FileSpreadsheet, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseCsv, QUIZ_COLUMNS, quizQuestionsOf, sampleImportRows, validateImportRows, type ImportRow } from "@/lib/admin";
import { useAdmin } from "@/lib/store/admin-store";
import { cn } from "@/lib/utils";
import { Table, TableWrap, Td, Th, Tr } from "../common/data";
import { CheckRow, StickySaveBar } from "../common/form";
import { SectionHeader } from "../layout/page-header";
import { downloadTemplate } from "./quiz-template";

const STEPS = ["Tải file mẫu", "Chọn file", "Xem trước và nhập"];

const COLUMN_HELP: [string, string][] = [
  ["Loại câu", "Chọn một, Chọn nhiều hoặc Đúng/Sai"],
  ["Câu hỏi", "Nội dung câu hỏi (bắt buộc)"],
  ["Đáp án A đến E", "Ít nhất 2 đáp án, để trống cột không dùng. Câu Đúng/Sai bỏ trống"],
  ["Đáp án đúng", "Chữ cái đáp án, ví dụ B. Chọn nhiều ghi B,C. Câu Đúng/Sai ghi Đúng hoặc Sai"],
  ["Điểm", "Mặc định 1"],
  ["Giải thích", "Hiện cho học viên khi xem lại (không bắt buộc)"],
];

export function QuizImportView({ cmid }: { cmid: number }) {
  const router = useRouter();
  const { ds, actions } = useAdmin();
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [skipErrors, setSkipErrors] = useState(true);
  const input = useRef<HTMLInputElement>(null);
  const existing = quizQuestionsOf(ds, cmid).length;
  const valid = rows.filter((r) => r.question);
  const invalid = rows.filter((r) => !r.question);

  const readFile = async (f: File) => {
    setFileName(f.name);
    const data = /\.csv$/i.test(f.name) ? parseCsv(await f.text()) : [[...QUIZ_COLUMNS], ...sampleImportRows];
    const body = data[0]?.[0]?.toLowerCase().includes("loại") ? data.slice(1) : data;
    setRows(validateImportRows(body, existing + 1));
    setStep(2);
  };

  return (
    <div>
      <SectionHeader title="Thêm câu hỏi từ Excel" description={`Bài kiểm tra đang có ${existing} câu. Câu nhập thêm nằm sau câu cuối.`} />

      <ol className="mb-6 flex flex-wrap gap-2" aria-label="Các bước">
        {STEPS.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
              i === step ? "border-primary bg-brand-50 font-medium text-brand-700" : i < step ? "border-success/40 text-success" : "text-muted-foreground",
            )}
          >
            <span className={cn("flex size-5 items-center justify-center rounded-full text-xs", i < step ? "bg-success text-white" : i === step ? "bg-primary text-white" : "bg-muted")}>
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-5">
          <div className="rounded-xl border bg-card p-5 shadow-xs">
            <p className="mb-3 font-semibold">Các cột trong file</p>
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[180px_1fr]">
              {COLUMN_HELP.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-medium">{k}</dt>
                  <dd className="text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <Button variant="outline" className="mt-4" onClick={downloadTemplate}>
              <Download /> Tải file mẫu
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(1)}>Tiếp tục</Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) readFile(f);
            }}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-card px-6 py-12 text-center hover:border-primary hover:bg-brand-50/40"
          >
            <Upload className="size-8 text-brand-600" />
            <span className="font-medium">Kéo thả file vào đây hoặc bấm để chọn</span>
            <span className="text-sm text-muted-foreground">File .xlsx hoặc .csv theo mẫu, tối đa 200 câu</span>
          </button>
          <input
            ref={input}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            aria-label="Chọn file câu hỏi"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFile(f);
              e.target.value = "";
            }}
          />
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Quay lại
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <FileSpreadsheet className="size-4 text-success" />
            <span className="font-medium">{fileName}</span>
            <Badge variant="success">{valid.length} câu hợp lệ</Badge>
            {invalid.length > 0 && <Badge variant="danger">{invalid.length} dòng lỗi</Badge>}
            <Button variant="link" size="sm" onClick={() => setStep(1)}>
              Chọn file khác
            </Button>
          </div>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th className="w-16">Dòng</Th>
                  <Th>Loại câu</Th>
                  <Th className="min-w-64">Câu hỏi</Th>
                  <Th>Đáp án đúng</Th>
                  <Th className="min-w-64">Kết quả kiểm tra</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <Tr key={r.line} className={cn(!r.question && "bg-danger-soft/60")}>
                    <Td className="tabular-nums">{r.line}</Td>
                    <Td>{r.cells[0] || <span className="text-muted-foreground">(trống)</span>}</Td>
                    <Td>{r.cells[1] || <span className="text-muted-foreground">(trống)</span>}</Td>
                    <Td>{r.cells[7]}</Td>
                    <Td>
                      {r.question ? (
                        <span className="flex items-center gap-1 text-success">
                          <Check className="size-4" /> Hợp lệ
                        </span>
                      ) : (
                        <ul className="space-y-1 text-destructive">
                          {r.errors.map((e, i) => (
                            <li key={i} className="flex gap-1">
                              <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
                              <span>
                                <span className="font-medium">Cột {e.column}:</span> {e.message}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          {invalid.length > 0 && (
            <CheckRow
              checked={skipErrors}
              onChange={setSkipErrors}
              label="Bỏ qua dòng lỗi, chỉ nhập câu hợp lệ"
              description="Bỏ chọn nếu muốn sửa file rồi nhập lại toàn bộ."
            />
          )}
          <StickySaveBar note={invalid.length && !skipErrors ? "Sửa các dòng lỗi trong file rồi chọn lại file." : undefined}>
            <Button variant="ghost" asChild>
              <Link href={`/admin/quiz/${cmid}/edit`}>Hủy</Link>
            </Button>
            <Button
              disabled={!valid.length || (invalid.length > 0 && !skipErrors)}
              onClick={() => {
                actions.importQuestions(
                  cmid,
                  valid.map((r) => r.question!),
                );
                router.push(`/admin/quiz/${cmid}/edit`);
              }}
            >
              Nhập {valid.length} câu
            </Button>
          </StickySaveBar>
        </div>
      )}
    </div>
  );
}
