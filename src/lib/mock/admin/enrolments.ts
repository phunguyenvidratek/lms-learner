/**
 * Cách ghi danh (enrol) và lượt ghi danh (user_enrolments).
 * - Overview Brand VIGO: đồng bộ 6 phòng ban (mọi nhân viên).
 * - Khóa lộ trình chuyên môn (13, 11, 14, 15) và An toàn (12): đồng bộ Chuyên môn HCM, Chuyên môn HN.
 *   Khóa 12 bật đồng bộ 20 ngày trước, khớp thông báo "Bạn được ghi danh..." của learner.
 * - Nền tảng Rejuran có thêm 2 nhân viên kinh doanh ghi danh thủ công.
 * - Giảng viên Võ Thanh Tùng và người quản trị Đỗ Ngọc Lan ghi danh thủ công vai trò Giảng viên ở mọi khóa
 *   (nên khóa hiện trong Khóa học của tôi của họ, như Moodle).
 * - 2 khóa nháp (17, 18) chưa có học viên.
 * Mỗi khóa có sẵn Ghi danh thủ công (bật) và Khách (tắt) như Moodle mặc định.
 */
import { at } from "@/lib/mock/time";
import type { EnrolInstance, UserEnrolment } from "@/types/moodle-admin";
import { adminCourses } from "./courses";
import { ADMIN_USER_ID, cohortMembers, cohorts, COURSE_CREATOR_ID, ROLE_EDITINGTEACHER, ROLE_STUDENT, users } from "./users";

/** Người được ghi danh vai trò Giảng viên ở mọi khóa */
export const TEACHER_IDS = [COURSE_CREATOR_ID, ADMIN_USER_ID];

const syncPlan: Record<number, { cohorts: number[]; since: number }> = {
  16: { cohorts: [1, 2, 3, 4, 5, 6], since: at(-60) },
  13: { cohorts: [1, 2], since: at(-60) },
  11: { cohorts: [1, 2], since: at(-14) },
  12: { cohorts: [1, 2], since: at(-20) },
  14: { cohorts: [1, 2], since: at(-14) },
  15: { cohorts: [1, 2], since: at(-14) },
};

/** Ghi danh thủ công học viên: courseid -> userid[] */
const manualStudents: Record<number, number[]> = {
  13: [2021, 2022],
};

const instances: EnrolInstance[] = [];
const enrolments: UserEnrolment[] = [];
let ueSeq = 1;

for (const course of adminCourses) {
  const base = course.id * 10;
  const manual: EnrolInstance = {
    id: base + 1,
    courseid: course.id,
    enrol: "manual",
    status: 0,
    name: "",
    roleid: ROLE_STUDENT,
    enrolperiod: 0,
    timecreated: course.timecreated,
  };
  instances.push(manual);

  for (const userid of TEACHER_IDS) {
    enrolments.push({
      id: ueSeq++,
      enrolid: manual.id,
      userid,
      status: 0,
      timestart: course.timecreated,
      timeend: 0,
      timecreated: course.timecreated,
    });
  }
  for (const userid of manualStudents[course.id] ?? []) {
    enrolments.push({ id: ueSeq++, enrolid: manual.id, userid, status: 0, timestart: at(-45), timeend: 0, timecreated: at(-45) });
  }

  const plan = syncPlan[course.id];
  plan?.cohorts.forEach((cohortid, i) => {
    const inst: EnrolInstance = {
      id: base + 2 + i,
      courseid: course.id,
      enrol: "cohort",
      status: 0,
      name: `Đồng bộ ${cohorts.find((c) => c.id === cohortid)!.name}`,
      customint1: cohortid,
      roleid: ROLE_STUDENT,
      enrolperiod: 0,
      timecreated: plan.since,
    };
    instances.push(inst);
    for (const m of cohortMembers.filter((x) => x.cohortid === cohortid)) {
      const timestart = Math.max(plan.since, m.timeadded);
      const suspended = users.find((u) => u.id === m.userid)?.suspended;
      enrolments.push({
        id: ueSeq++,
        enrolid: inst.id,
        userid: m.userid,
        status: suspended ? 1 : 0,
        timestart,
        timeend: 0,
        timecreated: timestart,
      });
    }
  });

  instances.push({
    id: base + 9,
    courseid: course.id,
    enrol: "guest",
    status: 1,
    name: "",
    roleid: 0,
    enrolperiod: 0,
    timecreated: course.timecreated,
  });
}

export const enrolInstances: EnrolInstance[] = instances;
export const userEnrolments: UserEnrolment[] = enrolments;

/** role_assignments trong context khóa: giảng viên = Giảng viên, còn lại = Học viên */
export const courseRoleAssignments: { courseid: number; userid: number; roleid: number }[] = (() => {
  const seen = new Set<string>();
  const out: { courseid: number; userid: number; roleid: number }[] = [];
  for (const ue of enrolments) {
    const inst = instances.find((i) => i.id === ue.enrolid)!;
    const key = `${inst.courseid}:${ue.userid}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ courseid: inst.courseid, userid: ue.userid, roleid: TEACHER_IDS.includes(ue.userid) ? ROLE_EDITINGTEACHER : ROLE_STUDENT });
  }
  return out;
})();
