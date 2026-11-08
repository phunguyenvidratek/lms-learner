/**
 * Helper sinh tiến độ mẫu (hoàn thành bài, lượt làm quiz). Dùng chung cho:
 * - seed của người học đang đăng nhập (src/lib/store/seed.ts)
 * - tiến độ các học viên khác mà admin thấy (src/lib/mock/admin/learner-profiles.ts)
 * Lượt làm được chấm bằng gradeAnswers() của src/lib/learning.ts nên điểm khớp với learner.
 */
import { courseContents, quizzes } from "@/lib/mock/data";
import { getQuestions, gradeAnswers, isTracked } from "@/lib/learning";
import { at } from "@/lib/mock/time";
import type { StoredAttempt } from "@/types/moodle";

/** Sinh câu trả lời có đúng `wrong` câu sai (để xem lại đáp án được) */
export function answersWithWrong(cmid: number, wrong: number, offset = 0) {
  const answers: Record<number, string[]> = {};
  const questions = getQuestions(cmid);
  questions.forEach((q, i) => {
    const correct = q.correct ?? [];
    // offset xoay vị trí câu sai để mỗi học viên sai câu khác nhau
    const n = questions.length;
    const isWrong = (((i - offset) % n) + n) % n < wrong;
    if (isWrong) {
      const bad = q.options.find((o) => !correct.includes(o.value))?.value;
      // Câu chọn nhiều mà mọi phương án đều đúng: trả lời thiếu một đáp án
      answers[q.slot] = bad ? [bad] : correct.slice(0, -1);
    } else answers[q.slot] = [...correct];
  });
  return answers;
}

export function attempt(cmid: number, n: number, wrong: number, finish: number, offset = 0): StoredAttempt {
  const quiz = quizzes.find((q) => q.coursemodule === cmid)!;
  const answers = answersWithWrong(cmid, wrong, offset);
  const { sumgrades, grade } = gradeAnswers(getQuestions(cmid), answers, quiz);
  return {
    id: cmid * 10 + n,
    quiz: quiz.id,
    attempt: n,
    state: "finished",
    timestart: finish - 11 * 60 - wrong * 37,
    timefinish: finish,
    sumgrades,
    grade,
    answers,
  };
}

/**
 * Đánh dấu hoàn thành module (trừ quiz) của các phần, rải đều từ ngày `from`.
 * `limit`: chỉ hoàn thành `limit` module đầu tiên (học dở một phần).
 */
export function completeSections(
  courseId: number,
  sections: number[],
  from: number,
  out: Record<number, number>,
  limit = Infinity,
) {
  let i = 0;
  for (const s of courseContents[courseId] ?? []) {
    if (!sections.includes(s.section)) continue;
    for (const m of s.modules) {
      if (i >= limit) return;
      if (!isTracked(m) || m.modname === "quiz") continue;
      out[m.id] = at(from + Math.floor(i / 3), 19 + (i % 3), 10 + i * 7 % 40);
      i++;
    }
  }
}
