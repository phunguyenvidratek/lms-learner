/**
 * Trạng thái ban đầu của người học Trần Minh Anh (khôi phục bằng ?reset=1).
 * - Overview Brand VIGO, Nền tảng Rejuran: đã hoàn thành, có chứng nhận.
 * - Rejuran Internal Training: vừa mở, mới xem video đầu Phần 1 (khóa dùng cho luồng trình bày).
 * - An toàn và xử lý biến chứng: đã đạt Phần 1 ở lần làm thứ 2, đang học Phần 2.
 * - Kỹ thuật tiêm, Ứng dụng chuyên sâu: chưa mở theo lộ trình.
 */
import { announcements, courseContents, quizzes } from "@/lib/mock/data";
import { getQuestions, gradeAnswers, isTracked, type LearnerState } from "@/lib/learning";
import { at, nowSeconds } from "@/lib/mock/time";
import { formatDate } from "@/lib/utils";
import type { Notification, StoredAttempt } from "@/types/moodle";

/** Sinh câu trả lời có đúng `wrong` câu sai (để xem lại đáp án được) */
function answersWithWrong(cmid: number, wrong: number) {
  const answers: Record<number, string[]> = {};
  getQuestions(cmid).forEach((q, i) => {
    const correct = q.correct ?? [];
    if (i < wrong) {
      const bad = q.options.find((o) => !correct.includes(o.value))!.value;
      answers[q.slot] = [bad];
    } else answers[q.slot] = [...correct];
  });
  return answers;
}

function attempt(cmid: number, n: number, wrong: number, finish: number): StoredAttempt {
  const quiz = quizzes.find((q) => q.coursemodule === cmid)!;
  const answers = answersWithWrong(cmid, wrong);
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

/** Đánh dấu hoàn thành mọi module (trừ quiz) của các phần, rải đều từ ngày `from` */
function completeSections(courseId: number, sections: number[], from: number, out: Record<number, number>) {
  let i = 0;
  for (const s of courseContents[courseId]) {
    if (!sections.includes(s.section)) continue;
    for (const m of s.modules) {
      if (!isTracked(m) || m.modname === "quiz") continue;
      out[m.id] = at(from + Math.floor(i / 3), 19 + (i % 3), 10 + i * 7 % 40);
      i++;
    }
  }
}

export function createSeedState(): LearnerState {
  const completions: Record<number, number> = {};
  completeSections(16, [1], -57, completions);
  completeSections(16, [2], -55, completions);
  completeSections(16, [3], -53, completions);
  completeSections(13, [1], -23, completions);
  completeSections(13, [2], -14, completions);
  completeSections(13, [3], -5, completions);
  completeSections(12, [1], -11, completions);
  completions[1221] = at(-4, 20, 45);
  completions[1111] = at(-1, 20, 18);

  const now = nowSeconds();
  const n = (
    id: number,
    subject: string,
    smallmessage: string,
    contexturl: string,
    timecreated: number,
    read: boolean,
    component: string,
  ): Notification => ({ id, subject, smallmessage, contexturl, timecreated, read, component });

  const deadline = formatDate(at(3, 17)).slice(0, 5);

  return {
    v: 1,
    session: null,
    passwordChanged: [],
    completions,
    attempts: {
      1615: [attempt(1615, 1, 1, at(-55, 21, 5))],
      1625: [attempt(1625, 1, 3, at(-54, 20, 40)), attempt(1625, 2, 1, at(-53, 21, 12))],
      1635: [attempt(1635, 1, 0, at(-52, 16, 2))],
      1315: [attempt(1315, 1, 2, at(-20, 21, 30))],
      1326: [attempt(1326, 1, 4, at(-12, 20, 50)), attempt(1326, 2, 1, at(-11, 21, 15))],
      1335: [attempt(1335, 1, 1, at(-2, 10, 25))],
      1216: [attempt(1216, 1, 4, at(-9, 21, 3)), attempt(1216, 2, 1, at(-8, 20, 14))],
    },
    drafts: {},
    favourites: [11],
    notifications: [
      n(9008, "Kiểm tra Phần 1 sắp đến hạn", `Rejuran Internal Training: hạn nộp 17:00 ngày ${deadline}. Cần đạt từ 8/10.`, "/quiz/1116", now - 2 * 3600, false, "mod_quiz"),
      n(9007, announcements[0].name, "Phòng Đào tạo VIGO vừa đăng thông báo mới.", `/dashboard?announcement=${announcements[0].id}`, announcements[0].created, false, "mod_forum"),
      n(9006, "Khóa học mới đã mở: Rejuran Internal Training", "Bạn đã hoàn thành Nền tảng Rejuran và đánh giá da. Khóa tiếp theo trong lộ trình đã sẵn sàng.", "/courses/11", at(-2, 10, 26), false, "core_course"),
      n(9005, "Chứng nhận mới: Nền tảng Rejuran và đánh giá da", "Chứng nhận hoàn thành khóa học đã sẵn sàng để tải xuống.", "/certificates/13", at(-2, 10, 26), true, "core_completion"),
      n(9004, "Phòng Đào tạo đã trả lời câu hỏi trong Hỏi đáp", "Khách hàng dị ứng hải sản có dùng Rejuran được không?", "/courses/11?tab=hoi-dap", at(-4, 21, 40), true, "mod_forum"),
      n(9003, "Bạn đã đạt Kiểm tra Phần 1", "An toàn và xử lý biến chứng: điểm 9/10. Phần 2 đã được mở.", "/courses/12", at(-8, 20, 14), true, "mod_quiz"),
      n(9002, "Bạn được ghi danh vào khóa An toàn và xử lý biến chứng", "Khóa học bắt buộc cho nhân viên chuyên môn, hạn hoàn thành trong 30 ngày.", "/courses/12", at(-20, 8, 0), true, "enrol_cohort"),
      n(9001, "Chứng nhận mới: Overview Brand VIGO", "Chứng nhận hoàn thành khóa học đã sẵn sàng để tải xuống.", "/certificates/16", at(-52, 16, 3), true, "core_completion"),
    ],
    lastAccess: { 16: at(-52, 16), 13: at(-2, 10, 25), 12: at(-4, 20, 50), 11: at(-1, 20, 35) },
    lastModule: { 11: 1112, 12: 1222 },
    courseCompleted: { 16: at(-52, 16, 3), 13: at(-2, 10, 26) },
  };
}
