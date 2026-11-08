/**
 * Người dùng và phòng ban (cohort). Tên hư cấu, không có mật khẩu.
 * - Trần Minh Anh (2048) là người học của learner portal: cùng userid, username với siteInfo.
 * - Lê Thu Hà, Phạm Quốc Bảo, Nguyễn Hoài Nam trùng tên người hỏi trong forum learner.
 * - nhanvienmoi: tài khoản bắt đổi mật khẩu lần đầu (AUTH-05), chưa đăng nhập lần nào.
 * Phòng ban lưu bằng cohort (chuẩn ghi danh) và profile field phongban để hiện trên danh sách
 * (đề xuất BA ở điểm chưa chốt số 3).
 */
import { siteInfo } from "@/lib/mock/data";
import { at } from "@/lib/mock/time";
import type { AdminUser, Cohort, CohortMember, Role } from "@/types/moodle-admin";

// ---------- Phòng ban (cohort) ----------

export const cohorts: Cohort[] = [
  { id: 1, name: "Chuyên môn Hồ Chí Minh", idnumber: "CM-HCM", description: "<p>Nhân viên chuyên môn chi nhánh Hồ Chí Minh.</p>", visible: true, component: "", timecreated: at(-120) },
  { id: 2, name: "Chuyên môn Hà Nội", idnumber: "CM-HN", description: "<p>Nhân viên chuyên môn chi nhánh Hà Nội.</p>", visible: true, component: "", timecreated: at(-120) },
  { id: 3, name: "Kinh doanh Hồ Chí Minh", idnumber: "KD-HCM", description: "<p>Đội kinh doanh khu vực phía Nam.</p>", visible: true, component: "", timecreated: at(-120) },
  { id: 4, name: "Kinh doanh Hà Nội", idnumber: "KD-HN", description: "<p>Đội kinh doanh khu vực phía Bắc.</p>", visible: true, component: "", timecreated: at(-120) },
  { id: 5, name: "Chăm sóc khách hàng", idnumber: "CSKH", description: "<p>Tổng đài và chăm sóc khách hàng sau điều trị.</p>", visible: true, component: "", timecreated: at(-110) },
  { id: 6, name: "Marketing", idnumber: "MKT", description: "", visible: true, component: "", timecreated: at(-110) },
  { id: 7, name: "Phòng Đào tạo", idnumber: "DT", description: "<p>Người quản trị và soạn bài.</p>", visible: true, component: "", timecreated: at(-120) },
];

// ---------- Vai trò ----------

export const roles: Role[] = [
  { id: 1, shortname: "manager", name: "Quản lý" },
  { id: 2, shortname: "coursecreator", name: "Người tạo khóa" },
  { id: 3, shortname: "editingteacher", name: "Giảng viên" },
  { id: 4, shortname: "teacher", name: "Trợ giảng" },
  { id: 5, shortname: "student", name: "Học viên" },
];

export const ROLE_STUDENT = 5;
export const ROLE_EDITINGTEACHER = 3;

// ---------- Người dùng ----------

/** Bỏ dấu tiếng Việt để sinh username: "Lê Thu Hà" -> "thuha.le" */
function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/\s+/g, "");
}

const JOB: Record<number, string> = {
  1: "Nhân viên chuyên môn",
  2: "Nhân viên chuyên môn",
  3: "Nhân viên kinh doanh",
  4: "Nhân viên kinh doanh",
  5: "Nhân viên chăm sóc khách hàng",
  6: "Nhân viên marketing",
  7: "Chuyên viên đào tạo",
};

const BRANCH: Record<number, { institution: string; city: string }> = {
  1: { institution: "VIGO - Chi nhánh Hồ Chí Minh", city: "Hồ Chí Minh" },
  2: { institution: "VIGO - Chi nhánh Hà Nội", city: "Hà Nội" },
  3: { institution: "VIGO - Chi nhánh Hồ Chí Minh", city: "Hồ Chí Minh" },
  4: { institution: "VIGO - Chi nhánh Hà Nội", city: "Hà Nội" },
  5: { institution: "VIGO - Văn phòng chính", city: "Hồ Chí Minh" },
  6: { institution: "VIGO - Văn phòng chính", city: "Hồ Chí Minh" },
  7: { institution: "VIGO - Văn phòng chính", city: "Hồ Chí Minh" },
};

interface Row {
  id: number;
  lastname: string;
  firstname: string;
  cohort: number;
  /** Số ngày trước khi tạo tài khoản */
  created: number;
  /** Số ngày kể từ lần truy cập cuối (null = chưa đăng nhập) */
  seen: number | null;
  google?: boolean;
  suspended?: boolean;
  username?: string;
  systemroles?: AdminUser["systemroles"];
}

const rows: Row[] = [
  // Phòng Đào tạo (quản trị, soạn bài)
  { id: 3, lastname: "Đỗ", firstname: "Ngọc Lan", cohort: 7, created: 400, seen: 0, systemroles: ["manager"] },
  { id: 4, lastname: "Hồ", firstname: "Kim Ngân", cohort: 7, created: 380, seen: 1, systemroles: ["manager"] },
  { id: 5, lastname: "Võ", firstname: "Thanh Tùng", cohort: 7, created: 300, seen: 0, systemroles: ["coursecreator"] },
  // Chuyên môn Hồ Chí Minh
  { id: 2001, lastname: "Lê", firstname: "Thu Hà", cohort: 1, created: 75, seen: 1 },
  { id: 2002, lastname: "Phạm", firstname: "Quốc Bảo", cohort: 1, created: 70, seen: 2, google: true },
  { id: 2003, lastname: "Nguyễn", firstname: "Hoài Nam", cohort: 1, created: 70, seen: 3 },
  { id: 2004, lastname: "Võ", firstname: "Ngọc Trâm", cohort: 1, created: 80, seen: 0 },
  { id: 2005, lastname: "Huỳnh", firstname: "Gia Bảo", cohort: 1, created: 60, seen: 6 },
  { id: 2006, lastname: "Đặng", firstname: "Thảo Vy", cohort: 1, created: 65, seen: 4, google: true },
  { id: 2007, lastname: "Bùi", firstname: "Khánh Linh", cohort: 1, created: 58, seen: 12 },
  { id: 2060, lastname: "Lý", firstname: "Hoàng Phúc", cohort: 1, created: 1, seen: null, username: "nhanvienmoi" },
  // Chuyên môn Hà Nội
  { id: 2011, lastname: "Nguyễn", firstname: "Hồng Nhung", cohort: 2, created: 78, seen: 1 },
  { id: 2012, lastname: "Trịnh", firstname: "Văn Đức", cohort: 2, created: 72, seen: 5 },
  { id: 2013, lastname: "Phan", firstname: "Thu Trang", cohort: 2, created: 70, seen: 2, google: true },
  { id: 2014, lastname: "Đỗ", firstname: "Minh Quân", cohort: 2, created: 66, seen: 41 },
  { id: 2015, lastname: "Hoàng", firstname: "Lan Chi", cohort: 2, created: 64, seen: 3 },
  { id: 2016, lastname: "Vũ", firstname: "Đức Thịnh", cohort: 2, created: 40, seen: 20 },
  { id: 2017, lastname: "Ngô", firstname: "Phương Thảo", cohort: 2, created: 10, seen: 9 },
  // Kinh doanh Hồ Chí Minh
  { id: 2021, lastname: "Trương", firstname: "Quốc Huy", cohort: 3, created: 90, seen: 7 },
  { id: 2022, lastname: "Lâm", firstname: "Mỹ Duyên", cohort: 3, created: 85, seen: 2, google: true },
  { id: 2023, lastname: "Châu", firstname: "Tấn Lộc", cohort: 3, created: 85, seen: 33 },
  { id: 2024, lastname: "Mai", firstname: "Thanh Hằng", cohort: 3, created: 82, seen: 15 },
  { id: 2025, lastname: "Tạ", firstname: "Hữu Nghĩa", cohort: 3, created: 82, seen: 48, suspended: true },
  // Kinh doanh Hà Nội
  { id: 2031, lastname: "Lương", firstname: "Việt Hoàng", cohort: 4, created: 88, seen: 8 },
  { id: 2032, lastname: "Đinh", firstname: "Ngọc Ánh", cohort: 4, created: 80, seen: 26 },
  { id: 2033, lastname: "Kiều", firstname: "Thanh Tâm", cohort: 4, created: 50, seen: 45 },
  { id: 2034, lastname: "Tô", firstname: "Bảo Ngọc", cohort: 4, created: 76, seen: 4 },
  // Chăm sóc khách hàng
  { id: 2041, lastname: "Quách", firstname: "Mỹ Linh", cohort: 5, created: 84, seen: 3 },
  { id: 2042, lastname: "Hà", firstname: "Phương Uyên", cohort: 5, created: 80, seen: 6 },
  { id: 2043, lastname: "Diệp", firstname: "Minh Khoa", cohort: 5, created: 62, seen: 18 },
  { id: 2044, lastname: "Cao", firstname: "Thùy Dương", cohort: 5, created: 60, seen: 2 },
  // Marketing
  { id: 2051, lastname: "La", firstname: "Tường Vi", cohort: 6, created: 90, seen: 10 },
  { id: 2052, lastname: "Văn", firstname: "Hải Đăng", cohort: 6, created: 35, seen: 34 },
  { id: 2053, lastname: "Mạc", firstname: "Kim Oanh", cohort: 6, created: 55, seen: 21 },
];

function toUser(r: Row): AdminUser {
  const username = r.username ?? `${slug(r.firstname)}.${slug(r.lastname)}`;
  const timecreated = at(-r.created, 8);
  return {
    id: r.id,
    username,
    firstname: r.firstname,
    lastname: r.lastname,
    fullname: `${r.lastname} ${r.firstname}`,
    email: `${username}@vigo.vn`,
    idnumber: `VG-${String(r.id).padStart(5, "0")}`,
    department: JOB[r.cohort],
    ...BRANCH[r.cohort],
    auth: r.google ? "oauth2" : "manual",
    suspended: !!r.suspended,
    firstaccess: r.seen === null ? 0 : timecreated + 3600,
    lastaccess: r.seen === null ? 0 : at(-r.seen, 8 + (r.id % 9), (r.id * 7) % 60),
    timecreated,
    customfields: [{ shortname: "phongban", name: "Phòng ban", value: cohorts.find((c) => c.id === r.cohort)!.name }],
    systemroles: r.systemroles ?? [],
  };
}

/** Người học của learner portal: lấy đúng thông tin siteInfo */
const learner: AdminUser = {
  id: siteInfo.userid,
  username: siteInfo.username,
  firstname: siteInfo.firstname,
  lastname: siteInfo.lastname,
  fullname: siteInfo.fullname,
  email: siteInfo.email,
  idnumber: siteInfo.idnumber,
  department: siteInfo.department,
  institution: siteInfo.institution,
  city: "Hồ Chí Minh",
  auth: "manual",
  suspended: false,
  firstaccess: siteInfo.firstaccess,
  lastaccess: at(-1, 20, 35),
  timecreated: at(-63, 8),
  customfields: [{ shortname: "phongban", name: "Phòng ban", value: cohorts[0].name }],
  systemroles: [],
};

const userCohort: Record<number, number> = Object.fromEntries([...rows.map((r) => [r.id, r.cohort]), [learner.id, 1]]);

export const users: AdminUser[] = [...rows.slice(0, 3).map(toUser), learner, ...rows.slice(3).map(toUser)];

export const cohortMembers: CohortMember[] = users.map((u) => ({
  cohortid: userCohort[u.id],
  userid: u.id,
  timeadded: u.timecreated,
}));

/** Người đang dùng admin mockup (không qua đăng nhập): Đỗ Ngọc Lan, Quản lý, Phòng Đào tạo */
export const ADMIN_USER_ID = 3;
/** Người soạn bài, giảng viên của các khóa */
export const COURSE_CREATOR_ID = 5;
