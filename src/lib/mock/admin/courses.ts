/**
 * Danh mục và khóa học theo góc nhìn quản trị.
 * - 6 khóa learner dùng lại nguyên CourseInfo và nội dung của src/lib/mock/data.ts, chỉ thêm field quản trị.
 * - 2 khóa nháp (visible=0) chỉ có ở admin: Moodle không cho học viên thấy khóa ẩn nên learner không đổi.
 *   Hai khóa này tạo dữ liệu cho cảnh báo "khóa chưa có học viên", "bài kiểm tra chưa có câu hỏi" (DASH-03).
 * Tên danh mục đã sửa chính tả theo CAT-03 (Training).
 */
import { TRAINING_TEAM } from "@/lib/config";
import { courses } from "@/lib/mock/data";
import { at } from "@/lib/mock/time";
import type { CourseModule, CourseSection, Quiz } from "@/types/moodle";
import type { AdminCourse, CourseCategory, ProgramGroup } from "@/types/moodle-admin";

// ---------- Danh mục (course_categories) ----------

const cat = (id: number, name: string, parent: number, sortorder: number, description = ""): Omit<CourseCategory, "coursecount"> => ({
  id,
  name,
  idnumber: "",
  description,
  parent,
  sortorder,
  visible: 1,
  depth: parent ? 2 : 1,
  path: parent ? `/${parent}/${id}` : `/${id}`,
});

const categoryRows = [
  cat(1, "Internal Training", 0, 1, "<p>Chương trình đào tạo nội bộ cho nhân viên VIGO.</p>"),
  cat(2, "Overview Brand", 1, 1),
  cat(3, "Foundational Knowledge", 1, 2),
  cat(4, "Brands", 1, 3),
  cat(5, "Integrated", 1, 4),
  cat(6, "External Training", 0, 2, "<p>Khóa dành cho đối tác phòng khám, spa.</p>"),
];

// ---------- Khóa học ----------

/** Thông tin quản trị của 6 khóa learner (khóa theo id) */
const adminMeta: Record<number, { categoryid: number; programgroup: ProgramGroup; timecreated: number }> = {
  16: { categoryid: 2, programgroup: "Foundational", timecreated: at(-90) },
  13: { categoryid: 3, programgroup: "Foundational", timecreated: at(-70) },
  12: { categoryid: 3, programgroup: "Foundational", timecreated: at(-45) },
  11: { categoryid: 4, programgroup: "Brands", timecreated: at(-30) },
  14: { categoryid: 4, programgroup: "Brands", timecreated: at(-28) },
  15: { categoryid: 5, programgroup: "Integrated", timecreated: at(-25) },
};

const learnerCourses: AdminCourse[] = courses.map((c) => ({
  ...c,
  ...adminMeta[c.id],
  idnumber: c.shortname,
  visible: 1,
  format: "topics",
  enablecompletion: 1,
  showcompletionconditions: 1,
}));

const draftCourses: AdminCourse[] = [
  {
    id: 17,
    fullname: "Chăm sóc da tại nhà sau điều trị",
    shortname: "HOME-CARE",
    idnumber: "HOME-CARE",
    summary: "<p>Hướng dẫn khách hàng chăm sóc da tại nhà sau liệu trình tại phòng khám.</p>",
    description: "<p>Khóa đang soạn, chưa mở cho học viên.</p>",
    objectives: [],
    requirements: [],
    courseimage: "/images/courses/my-pham.jpg",
    coursecategory: "Brands",
    categoryid: 4,
    programgroup: "Brands",
    teacher: TRAINING_TEAM,
    startdate: at(14),
    enddate: 0,
    timecreated: at(-4),
    timemodified: at(-1),
    visible: 0,
    format: "topics",
    enablecompletion: 1,
    showcompletionconditions: 1,
  },
  {
    id: 18,
    fullname: "Kỹ thuật vi kim cơ bản cho đối tác",
    shortname: "MICRO-01",
    idnumber: "MICRO-01",
    summary: "",
    description: "",
    objectives: [],
    requirements: [],
    courseimage: "",
    coursecategory: "External Training",
    categoryid: 6,
    programgroup: "Integrated",
    teacher: TRAINING_TEAM,
    startdate: at(30),
    enddate: 0,
    timecreated: at(-2),
    timemodified: at(-2),
    visible: 0,
    format: "topics",
    enablecompletion: 1,
    showcompletionconditions: 1,
  },
];

export const adminCourses: AdminCourse[] = [...learnerCourses, ...draftCourses];

export const categories: CourseCategory[] = categoryRows.map((c) => ({
  ...c,
  coursecount: adminCourses.filter((x) => x.categoryid === c.id).length,
}));

// ---------- Nội dung khóa nháp ----------

const mod = (id: number, name: string, modname: CourseModule["modname"], completion: 0 | 1 | 2, description = ""): CourseModule => ({
  id,
  instance: id,
  name,
  modname,
  description,
  url: `/mod/${modname}/view.php?id=${id}`,
  uservisible: true,
  visible: 1,
  completion,
});

export const draftCourseContents: Record<number, CourseSection[]> = {
  17: [
    {
      id: 1700,
      name: "Giới thiệu chung",
      section: 0,
      summary: "",
      uservisible: true,
      modules: [mod(1702, "Thông báo khóa học", "forum", 0)],
    },
    {
      id: 1710,
      name: "Phần 1: Quy trình chăm sóc 7 ngày đầu",
      section: 1,
      summary: "<p>Những việc khách hàng cần làm và cần tránh sau liệu trình.</p>",
      uservisible: true,
      modules: [
        mod(1711, "Bài đọc: Hướng dẫn chăm sóc sau điều trị", "page", 2, "<p>Bản nháp, đang chờ duyệt nội dung.</p>"),
        mod(1712, "Kiểm tra Phần 1", "quiz", 2, "<p>Chưa thêm câu hỏi.</p>"),
      ],
    },
  ],
  18: [
    {
      id: 1800,
      name: "Giới thiệu chung",
      section: 0,
      summary: "",
      uservisible: true,
      modules: [],
    },
  ],
};

/** Quiz của khóa nháp: chưa có câu hỏi (sumgrades = 0) */
export const draftQuizzes: Quiz[] = [
  {
    id: 1712,
    coursemodule: 1712,
    course: 17,
    name: "Kiểm tra Phần 1",
    intro: "<p>Chưa thêm câu hỏi.</p>",
    timeopen: 0,
    timeclose: 0,
    timelimit: 900,
    attempts: 3,
    grademethod: 1,
    sumgrades: 0,
    grade: 10,
    gradepass: 8,
    preferredbehaviour: "deferredfeedback",
  },
];
