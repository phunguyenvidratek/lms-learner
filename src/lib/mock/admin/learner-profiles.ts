/**
 * Tiến độ học của các học viên khác (không phải người đang học trên learner portal).
 * Mỗi học viên có một hồ sơ ngắn, được dựng thành LearnerState đầy đủ rồi đưa qua chính
 * buildAllCourses()/summarizeQuiz() của src/lib/learning.ts. Admin không tự lưu % nào,
 * nên số liệu báo cáo luôn cùng quy tắc với learner (khóa phần, khóa theo lộ trình, điểm đạt).
 * Trần Minh Anh (2048) không có ở đây: admin đọc state thật của learner qua useLearning().
 * Hồ sơ tuân thủ thứ tự lộ trình 16 > 13 > 11 > 14 > 15 (khóa sau chỉ có tiến độ khi xong khóa trước).
 */
import { courseContents } from "@/lib/mock/data";
import type { LearnerState } from "@/lib/learning";
import { attempt, completeSections } from "@/lib/mock/progress-helpers";
import { at } from "@/lib/mock/time";
import type { StoredAttempt } from "@/types/moodle";

interface CourseSpec {
  /** Số phần đã xong hẳn (học hết bài + đạt bài kiểm tra cuối phần) */
  done: number;
  /** Số bài (không tính quiz) đã xong ở phần kế tiếp */
  partial?: number;
  /** Số lượt trượt bài kiểm tra của phần kế tiếp (3 = hết lượt) */
  fails?: number;
}

type Profile = Partial<Record<number, CourseSpec>>;

/** Ngày bắt đầu học từng khóa (âm = quá khứ), lệch thêm theo userid */
const COURSE_START: Record<number, number> = { 16: -52, 13: -32, 12: -17, 11: -12, 14: -6, 15: -4 };

const all = (n: number): CourseSpec => ({ done: n });

export const learnerProfiles: Record<number, Profile> = {
  // Chuyên môn Hồ Chí Minh
  2001: { 16: all(3), 13: all(3), 11: { done: 2, partial: 2 }, 12: all(3) },
  2002: { 16: all(3), 13: all(3), 11: { done: 1, partial: 1 }, 12: { done: 1, partial: 2 } },
  2003: { 16: all(3), 13: { done: 1, partial: 3, fails: 1 }, 12: all(2) },
  2004: { 16: all(3), 13: all(3), 11: all(4), 14: { done: 1 }, 12: all(3) },
  2005: { 16: { done: 2, partial: 1 }, 12: { done: 0, partial: 4, fails: 3 } },
  2006: { 16: all(3), 13: all(2), 12: all(1) },
  2007: { 16: { done: 1, partial: 2 } },
  // Chuyên môn Hà Nội
  2011: { 16: all(3), 13: all(3), 11: { done: 3, partial: 1 }, 12: all(3) },
  2012: { 16: all(3), 13: { done: 2, partial: 1 }, 12: { done: 2, partial: 1 } },
  2013: { 16: all(3), 13: all(3), 11: { done: 0, partial: 3 }, 12: { done: 1, partial: 4, fails: 2 } },
  2014: { 16: all(3) },
  2015: { 16: all(3), 13: all(3), 11: all(1), 12: all(3) },
  2016: { 16: { done: 0, partial: 2 } },
  // Kinh doanh Hồ Chí Minh (2021, 2022 ghi danh thủ công khóa 13)
  2021: { 16: all(3), 13: all(1) },
  2022: { 16: all(3), 13: { done: 0, partial: 2 } },
  2023: { 16: all(2) },
  2024: { 16: all(3) },
  2025: { 16: { done: 0, partial: 1 } },
  // Kinh doanh Hà Nội
  2031: { 16: all(3) },
  2032: { 16: { done: 1, partial: 1 } },
  2034: { 16: all(3) },
  // Chăm sóc khách hàng
  2041: { 16: all(3) },
  2042: { 16: { done: 2, partial: 3, fails: 1 } },
  2043: { 16: { done: 0, partial: 3 } },
  2044: { 16: all(3) },
  // Marketing
  2051: { 16: all(3) },
  2053: { 16: all(1) },
};

function quizOf(courseId: number, section: number) {
  return courseContents[courseId]?.find((s) => s.section === section)?.modules.find((m) => m.modname === "quiz");
}

function emptyState(): LearnerState {
  return {
    v: 1,
    session: null,
    passwordChanged: [],
    completions: {},
    attempts: {},
    drafts: {},
    favourites: [],
    notifications: [],
    lastAccess: {},
    lastModule: {},
    courseCompleted: {},
  };
}

/** Dựng LearnerState từ hồ sơ. Hàm thuần, kết quả cố định theo userid. */
export function buildProfileState(userid: number): LearnerState {
  const state = emptyState();
  const profile = learnerProfiles[userid];
  if (!profile) return state;

  for (const [cid, spec] of Object.entries(profile)) {
    if (!spec) continue;
    const courseId = Number(cid);
    const start = COURSE_START[courseId] - (userid % 5);
    const day = (section: number) => Math.min(start + (section - 1) * 2, -2);
    const tries: Record<number, StoredAttempt[]> = {};
    let last = 0;

    for (let s = 1; s <= spec.done; s++) {
      completeSections(courseId, [s], day(s), state.completions);
      const q = quizOf(courseId, s);
      if (!q) continue;
      const t = at(day(s) + 1, 20, 10 + ((userid + s) % 40));
      // Một số học viên trượt lần đầu rồi đạt ở lần 2
      tries[q.id] =
        (userid + s) % 4 === 0
          ? [attempt(q.id, 1, 3, t - 3600, userid), attempt(q.id, 2, 1, t, userid + 1)]
          : [attempt(q.id, 1, (userid + s) % 3, t, userid)];
      last = Math.max(last, t);
    }

    const next = spec.done + 1;
    if (spec.partial) completeSections(courseId, [next], day(next), state.completions, spec.partial);
    const nq = quizOf(courseId, next);
    if (spec.fails && nq) {
      const base = (tries[nq.id] ?? []).length;
      tries[nq.id] = Array.from({ length: spec.fails }, (_, k) =>
        attempt(nq.id, base + k + 1, 3 + ((userid + k) % 3), at(day(next) + 1 + k, 21, 5 + k * 9), userid + k),
      );
    }

    Object.assign(state.attempts, tries);
    const times = [
      last,
      ...Object.entries(state.completions)
        .filter(([cmid]) => Math.floor(Number(cmid) / 100) === courseId)
        .map(([, t]) => t),
      ...Object.values(tries).flatMap((a) => a.map((x) => x.timefinish)),
    ];
    const lastAccess = Math.max(...times);
    if (lastAccess > 0) state.lastAccess[courseId] = lastAccess;
  }
  return state;
}
