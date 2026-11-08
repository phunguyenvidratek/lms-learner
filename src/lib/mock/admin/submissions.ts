/**
 * Bài nộp (assign_submission + assign_grades) của "Bài thu hoạch: tình huống tư vấn thực tế" (cmid 1145,
 * Rejuran Internal Training, Phần 4). Chỉ học viên đã học tới Phần 4 trong learner-profiles mới có bài nộp:
 * Võ Ngọc Trâm (2004, đã chấm) và Nguyễn Hồng Nhung (2011, chờ chấm). Dùng cho thẻ Bài chờ chấm (DASH-01, DASH-03).
 */
import { at } from "@/lib/mock/time";

export interface AssignSubmission {
  cmid: number;
  userid: number;
  status: "submitted" | "draft";
  timemodified: number;
  /** null = chưa chấm */
  grade: number | null;
  timegraded: number | null;
}

export const assignSubmissions: AssignSubmission[] = [
  { cmid: 1145, userid: 2004, status: "submitted", timemodified: at(-6, 21, 10), grade: 85, timegraded: at(-5, 10) },
  { cmid: 1145, userid: 2011, status: "submitted", timemodified: at(-2, 20, 40), grade: null, timegraded: null },
];
