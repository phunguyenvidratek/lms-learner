/**
 * Mock data cho mockup. Nội dung chuyên môn chỉ là dữ liệu mẫu, không dùng để đào tạo thật.
 * Cấu trúc khóa mô phỏng hướng tư vấn VIGO: video ngắn dưới 20 phút, mỗi section có tài liệu
 * và 1 bài kiểm tra, đạt 8/10 mới mở section tiếp theo (Restrict access).
 */
import type {
  Announcement,
  CalendarEvent,
  CourseCompletionStatus,
  CourseGrade,
  CourseSection,
  EnrolledCourse,
  Notification,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  SiteInfo,
} from "@/types/moodle";

const ts = (y: number, m: number, d: number, h = 9) => Math.floor(Date.UTC(y, m - 1, d, h - 7) / 1000);

export const siteInfo: SiteInfo = {
  sitename: "VIGO LMS",
  userid: 101,
  username: "nguyenvana",
  firstname: "Văn A",
  lastname: "Nguyễn",
  fullname: "Nguyễn Văn A",
  userpictureurl: "",
  lang: "vi",
};

export const enrolledCourses: EnrolledCourse[] = [
  {
    id: 11,
    fullname: "Rejuran Internal Training",
    shortname: "RJR-INT",
    summary: "<p>Nền tảng về Rejuran, cơ chế PN và ứng dụng trong điều trị nám má.</p>",
    courseimage: "",
    progress: 40,
    hasprogress: true,
    isfavourite: true,
    hidden: false,
    lastaccess: ts(2026, 10, 14, 20),
    startdate: ts(2026, 10, 1),
    enddate: 0,
    coursecategory: "Brands / Aesthetics",
  },
  {
    id: 12,
    fullname: "An toàn và xử lý biến chứng",
    shortname: "SAFE-01",
    summary: "<p>Nhận định sớm và xử lý các biến chứng có thể gặp sau tiêm meso, quản lý rủi ro và tư vấn khách hàng.</p>",
    courseimage: "",
    progress: 100,
    hasprogress: true,
    isfavourite: false,
    hidden: false,
    lastaccess: ts(2026, 10, 10),
    startdate: ts(2026, 9, 20),
    enddate: 0,
    coursecategory: "Foundational Knowledge",
    completed: true,
  },
  {
    id: 13,
    fullname: "Nền tảng Rejuran và đánh giá da",
    shortname: "RJR-FOUND",
    summary: "<p>MODULE 1: Tổng quan Rejuran &amp; khoa học PN/PDRN. MODULE 2: Guideline chỉ định &amp; chọn dòng sản phẩm.</p>",
    courseimage: "",
    progress: 14,
    hasprogress: true,
    isfavourite: false,
    hidden: false,
    lastaccess: ts(2026, 10, 12),
    startdate: ts(2026, 10, 1),
    enddate: 0,
    coursecategory: "Brands / Aesthetics",
  },
  {
    id: 14,
    fullname: "Kỹ thuật tiêm Rejuran trong Y tế",
    shortname: "RJR-TECH",
    summary: "<p>Kỹ thuật tiêm cơ bản vùng mặt với Healer và nâng cao trẻ hóa đa tầng.</p>",
    courseimage: "",
    progress: 16,
    hasprogress: true,
    isfavourite: false,
    hidden: false,
    lastaccess: ts(2026, 10, 9),
    startdate: ts(2026, 10, 1),
    enddate: 0,
    coursecategory: "Brands / Aesthetics",
  },
  {
    id: 15,
    fullname: "Ứng dụng chuyên sâu và phối hợp",
    shortname: "RJR-ADV",
    summary: "<p>Phối hợp Rejuran Healer với thiết bị EBDs trong điều trị sắc tố và lão hóa.</p>",
    courseimage: "",
    progress: 0,
    hasprogress: true,
    isfavourite: false,
    hidden: false,
    lastaccess: null,
    startdate: ts(2026, 10, 28),
    enddate: 0,
    coursecategory: "Integrated",
  },
  {
    id: 16,
    fullname: "Overview Brand VIGO",
    shortname: "VIGO-OV",
    summary: "<p>Giới thiệu VIGO, câu chuyện thương hiệu và danh mục brand đang phân phối.</p>",
    courseimage: "",
    progress: 0,
    hasprogress: true,
    isfavourite: false,
    hidden: false,
    lastaccess: null,
    startdate: ts(2026, 10, 1),
    enddate: 0,
    coursecategory: "Overview Brand",
  },
];

/** Màu banner thay cho ảnh khóa trong mockup */
export const courseCover: Record<number, string> = {
  11: "from-brand-700 to-brand-400",
  12: "from-brand-900 to-brand-600",
  13: "from-slate-800 to-brand-600",
  14: "from-brand-800 to-sky-500",
  15: "from-teal-700 to-brand-500",
  16: "from-brand-600 to-indigo-400",
};

const video = (id: number, name: string, minutes: number, state: 0 | 1 = 0) => ({
  id,
  instance: id,
  name,
  modname: "drivevideo" as const,
  description: "<p>Video cắt từ buổi training trực tiếp ngày 22/07/2026.</p>",
  uservisible: true,
  visible: 1,
  completion: 1 as const,
  completiondata: { state, timecompleted: state ? ts(2026, 10, 12) : 0, tracking: 1 as const, isautomatic: false },
  customdata_duration: minutes * 60,
});

/** core_course_get_contents cho khóa 11 */
export const courseContents: Record<number, CourseSection[]> = {
  11: [
    {
      id: 1100,
      name: "Chung",
      section: 0,
      summary: "",
      uservisible: true,
      modules: [
        {
          id: 1101,
          instance: 1,
          name: "Thông báo khóa học",
          modname: "forum",
          uservisible: true,
          visible: 1,
          completion: 0,
        },
        {
          id: 1102,
          instance: 2,
          name: "Hướng dẫn khóa học này",
          modname: "label",
          description:
            "<p>Học lần lượt từng phần. Cuối mỗi phần có bài kiểm tra 10 câu, đạt từ 8/10 để mở phần tiếp theo.</p>",
          uservisible: true,
          visible: 1,
          completion: 0,
        },
        {
          id: 1103,
          instance: 3,
          name: "Ngân hàng câu hỏi Rejuran",
          modname: "qbank",
          uservisible: true,
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 1110,
      name: "Phần 1: Tổng quan về nám má",
      section: 1,
      summary: "",
      uservisible: true,
      modules: [
        video(1111, "Nguyên nhân và sinh bệnh học nám má", 14, 1),
        video(1112, "Đặc điểm lâm sàng và phân loại", 12, 1),
        {
          id: 1113,
          instance: 13,
          name: "Slide bài giảng Phần 1 (PDF)",
          modname: "resource",
          uservisible: true,
          visible: 1,
          completion: 1,
          completiondata: { state: 1, timecompleted: ts(2026, 10, 12), tracking: 1, isautomatic: false },
          contents: [
            { type: "file", filename: "RJR-phan-1.pdf", fileurl: "#", filesize: 2400000, mimetype: "application/pdf" },
          ],
        },
        {
          id: 1114,
          instance: 1,
          name: "Kiểm tra Phần 1",
          modname: "quiz",
          uservisible: true,
          visible: 1,
          completion: 2,
          completiondata: { state: 2, timecompleted: ts(2026, 10, 13), tracking: 2, isautomatic: true },
        },
      ],
    },
    {
      id: 1120,
      name: "Phần 2: Vai trò của PN trong điều trị nám má",
      section: 2,
      summary: "",
      uservisible: true,
      modules: [
        video(1121, "PN (Polynucleotide) và lợi ích", 16, 0),
        video(1122, "Cơ chế tác động của DOT PN", 18, 0),
        {
          id: 1123,
          instance: 23,
          name: "Ghi chú bài học: so sánh PN và HA",
          modname: "page",
          description: "<p>Tóm tắt điểm khác nhau giữa PN và HA.</p>",
          uservisible: true,
          visible: 1,
          completion: 1,
          completiondata: { state: 0, timecompleted: 0, tracking: 2, isautomatic: true },
        },
        {
          id: 1124,
          instance: 2,
          name: "Kiểm tra Phần 2",
          modname: "quiz",
          uservisible: true,
          visible: 1,
          completion: 2,
          completiondata: { state: 0, timecompleted: 0, tracking: 2, isautomatic: true },
        },
      ],
    },
    {
      id: 1130,
      name: "Phần 3: Phối hợp Rejuran Healer với EBDs",
      section: 3,
      summary: "",
      uservisible: false,
      availabilityinfo: "Chưa mở: cần đạt <strong>Kiểm tra Phần 2</strong> với điểm từ 8/10",
      modules: [
        video(1131, "Chỉ định phối hợp với thiết bị năng lượng", 15, 0),
        video(1132, "Phác đồ tham khảo và lưu ý", 11, 0),
        {
          id: 1133,
          instance: 3,
          name: "Kiểm tra cuối khóa",
          modname: "quiz",
          uservisible: false,
          visible: 1,
          completion: 2,
          completiondata: { state: 0, timecompleted: 0, tracking: 2, isautomatic: true },
        },
      ],
    },
  ],
};

export const pageContents: Record<number, string> = {
  1123: `<h2>PN và HA khác nhau thế nào</h2>
<p>Nội dung mẫu để dựng giao diện. Nội dung thật do VIGO cung cấp.</p>
<table><thead><tr><th>Tiêu chí</th><th>PN</th><th>HA</th></tr></thead>
<tbody><tr><td>Bản chất</td><td>Chuỗi nucleotide</td><td>Polysaccharide</td></tr>
<tr><td>Vai trò chính</td><td>Hỗ trợ phục hồi mô</td><td>Cấp ẩm, làm đầy</td></tr></tbody></table>
<h3>Ghi nhớ</h3><ul><li>Ý 1 của bài học</li><li>Ý 2 của bài học</li></ul>`,
};

export const completionStatus: Record<number, CourseCompletionStatus> = {
  11: {
    completed: false,
    aggregation: 1,
    completions: [
      { type: 4, title: "Hoàn thành activity", status: "Chưa xong", complete: false, details: { criteria: "Kiểm tra cuối khóa", requirement: "Đạt điểm", status: "Chưa xong" } },
      { type: 6, title: "Điểm khóa học", status: "Chưa xong", complete: false, details: { criteria: "Điểm khóa", requirement: "Tối thiểu 8.00", status: "" } },
    ],
  },
};

export const quizzes: Quiz[] = [
  { id: 1, coursemodule: 1114, course: 11, name: "Kiểm tra Phần 1", intro: "<p>10 câu, chọn đáp án đúng nhất.</p>", timeopen: 0, timeclose: 0, timelimit: 900, attempts: 3, grademethod: 1, sumgrades: 10, grade: 10, gradepass: 8, preferredbehaviour: "deferredfeedback" },
  { id: 2, coursemodule: 1124, course: 11, name: "Kiểm tra Phần 2", intro: "<p>10 câu gồm chọn một, chọn nhiều và đúng/sai.</p>", timeopen: 0, timeclose: ts(2026, 10, 21, 17), timelimit: 900, attempts: 3, grademethod: 1, sumgrades: 10, grade: 10, gradepass: 8, preferredbehaviour: "deferredfeedback" },
  { id: 3, coursemodule: 1133, course: 11, name: "Kiểm tra cuối khóa", intro: "<p>20 câu tổng hợp.</p>", timeopen: 0, timeclose: ts(2026, 10, 28, 17), timelimit: 1800, attempts: 2, grademethod: 1, sumgrades: 20, grade: 10, gradepass: 8, preferredbehaviour: "deferredfeedback" },
];

export const quizAttempts: Record<number, QuizAttempt[]> = {
  1: [
    { id: 501, quiz: 1, attempt: 1, state: "finished", timestart: ts(2026, 10, 12, 21), timefinish: ts(2026, 10, 12, 21), sumgrades: 6 },
    { id: 502, quiz: 1, attempt: 2, state: "finished", timestart: ts(2026, 10, 13, 20), timefinish: ts(2026, 10, 13, 20), sumgrades: 9 },
  ],
  2: [],
  3: [],
};

export const quizQuestions: Record<number, QuizQuestion[]> = {
  2: [
    {
      slot: 1,
      type: "multichoice",
      text: "PN là viết tắt của?",
      options: [
        { value: "a", label: "Polynucleotide" },
        { value: "b", label: "Polypeptide" },
        { value: "c", label: "Phospholipid" },
        { value: "d", label: "Plant Nutrient" },
      ],
      correct: ["a"],
      feedback: "PN là Polynucleotide (nội dung mẫu).",
    },
    {
      slot: 2,
      type: "multichoiceset",
      text: "Chọn các ý đúng về PN (chọn nhiều đáp án)",
      options: [
        { value: "a", label: "Ý đúng mẫu 1" },
        { value: "b", label: "Ý sai mẫu" },
        { value: "c", label: "Ý đúng mẫu 2" },
      ],
      correct: ["a", "c"],
    },
    {
      slot: 3,
      type: "truefalse",
      text: "PN và HA có cùng bản chất hóa học.",
      options: [
        { value: "1", label: "Đúng" },
        { value: "0", label: "Sai" },
      ],
      correct: ["0"],
    },
  ],
};

export const notifications: Notification[] = [
  { id: 1, subject: "Bạn đã đạt Kiểm tra Phần 1", smallmessage: "Điểm 9/10. Phần 2 đã được mở.", contexturl: "/courses/11", timecreated: ts(2026, 10, 13, 20), read: false, component: "mod_quiz" },
  { id: 2, subject: "Lịch đào tạo nội bộ Rejuran tháng 10/2026", smallmessage: "Ban Đào tạo VIGO vừa đăng thông báo mới.", contexturl: "/dashboard", timecreated: ts(2026, 9, 22, 16), read: false, component: "mod_forum" },
  { id: 3, subject: "Bạn được ghi danh vào Overview Brand VIGO", smallmessage: "Khóa học mới đã sẵn sàng.", contexturl: "/courses/16", timecreated: ts(2026, 10, 1), read: true, component: "enrol_cohort" },
];

export const announcements: Announcement[] = [
  {
    id: 1,
    name: "[Thông báo] Lịch đào tạo nội bộ chương trình Rejuran, tháng 10/2026",
    message: "<p>VIGO tổ chức chuỗi đào tạo nội bộ gồm 04 khóa trong tháng 10/2026. Kính mời Anh/Chị sắp xếp thời gian tham dự đầy đủ.</p>",
    created: ts(2026, 9, 22, 16),
    userfullname: "Ban Đào tạo VIGO",
  },
  {
    id: 2,
    name: "[Đăng ký] Khóa 1: Rejuran Internal Training (nền tảng), 07/10/2026",
    message: "<p>Mở đầu chuỗi đào tạo, đăng ký trước 17:00 ngày 03/10/2026.</p>",
    created: ts(2026, 9, 22, 16),
    userfullname: "Ban Đào tạo VIGO",
  },
];

export const calendarEvents: CalendarEvent[] = [
  { id: 1, name: "Rejuran Internal Training (nền tảng)", description: "Online (Zoom)", eventtype: "site", timestart: ts(2026, 10, 7, 14), timeduration: 10800 },
  { id: 2, name: "An toàn và xử lý biến chứng", description: "Offline, TT Đào tạo VIGO", eventtype: "site", timestart: ts(2026, 10, 14, 14), timeduration: 10800 },
  { id: 3, name: "Hạn nộp: Kiểm tra Phần 2", description: "", eventtype: "close", timestart: ts(2026, 10, 21, 17), timeduration: 0, courseid: 11, coursename: "Rejuran Internal Training" },
  { id: 4, name: "Ứng dụng Rejuran phối hợp EBDs", description: "Offline, TT Đào tạo VIGO", eventtype: "site", timestart: ts(2026, 10, 21, 14), timeduration: 10800 },
  { id: 5, name: "Ứng dụng chuyên sâu và phối hợp", description: "Offline, TT Đào tạo VIGO", eventtype: "site", timestart: ts(2026, 10, 28, 14), timeduration: 10800 },
];

export const courseGrades: CourseGrade[] = [
  { courseid: 11, coursename: "Rejuran Internal Training", grade: "9.00", rawgrade: "9", gradepass: 8 },
  { courseid: 12, coursename: "An toàn và xử lý biến chứng", grade: "8.50", rawgrade: "8.5", gradepass: 8 },
  { courseid: 13, coursename: "Nền tảng Rejuran và đánh giá da", grade: "-", rawgrade: null, gradepass: 8 },
];
