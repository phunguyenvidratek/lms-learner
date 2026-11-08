/** Admin QUIZ-04: tải file mẫu câu hỏi (CSV mở bằng Excel, cột theo local_quizexcel) */
import { QUIZ_COLUMNS, sampleImportRows } from "@/lib/admin";
import { downloadCsv } from "../common/data";

export function downloadTemplate() {
  downloadCsv("mau-cau-hoi-bai-kiem-tra.csv", [[...QUIZ_COLUMNS], ...sampleImportRows.filter((r) => r[1]).slice(0, 3)]);
}
