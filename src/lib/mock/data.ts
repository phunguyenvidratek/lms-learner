/**
 * Dữ liệu mẫu phía "Moodle" (nội dung khóa, quiz, forum, lịch). Không chứa tiến độ cá nhân:
 * tiến độ, lượt làm bài, yêu thích, thông báo đã đọc nằm ở store phía client (src/lib/store).
 * Cấu trúc theo hướng VIGO: video dưới 20 phút, mỗi phần có bài đọc, tài liệu PDF và 1 bài kiểm tra,
 * đạt 8/10 mới mở phần tiếp theo (Restrict access). Nội dung chuyên môn chỉ để tham khảo nội bộ.
 */
import type {
  Announcement,
  CalendarEvent,
  CourseInfo,
  CourseModule,
  CourseSection,
  ForumDiscussion,
  LearningPath,
  Quiz,
  SiteInfo,
} from "@/types/moodle";
import { at } from "./time";

export const TRAINING_TEAM = "Phòng Đào tạo VIGO";

export const siteInfo: SiteInfo = {
  sitename: "VIGO Learning",
  userid: 2048,
  username: "minhanh.tran",
  firstname: "Minh Anh",
  lastname: "Trần",
  fullname: "Trần Minh Anh",
  userpictureurl: "",
  lang: "vi",
  email: "minhanh.tran@vigo.vn",
  department: "Nhân viên chuyên môn",
  institution: "VIGO - Chi nhánh Hồ Chí Minh",
  idnumber: "VG-02048",
  firstaccess: at(-62, 8, 30),
};

// ---------- Khóa học ----------

export const courses: CourseInfo[] = [
  {
    id: 16,
    fullname: "Overview Brand VIGO",
    shortname: "VIGO-OV",
    summary: "<p>Giới thiệu VIGO, định hướng phát triển, danh mục thương hiệu đang phân phối và chuẩn mực phục vụ khách hàng.</p>",
    description:
      "<p>Khóa học đầu tiên trong lộ trình hội nhập. Sau khóa học, bạn nắm được VIGO là ai, đang mang đến cho khách hàng những thương hiệu nào và cách VIGO làm việc với đối tác phòng khám, spa.</p><p>Khóa học gồm 3 phần ngắn, có thể hoàn thành trong một buổi.</p>",
    objectives: [
      "Trình bày được sứ mệnh, tầm nhìn và giá trị cốt lõi của VIGO",
      "Nhận biết danh mục thương hiệu và nhóm sản phẩm VIGO phân phối",
      "Áp dụng chuẩn mực giao tiếp khi làm việc với khách hàng và đối tác",
      "Nắm quy trình phối hợp giữa các phòng ban và quy tắc bảo mật thông tin",
    ],
    requirements: ["Không yêu cầu kiến thức trước", "Dành cho toàn bộ nhân viên mới"],
    courseimage: "/images/courses/brand-vigo.jpg",
    coursecategory: "Overview Brand",
    teacher: TRAINING_TEAM,
    startdate: at(-60),
    enddate: 0,
    timemodified: at(-75),
  },
  {
    id: 13,
    fullname: "Nền tảng Rejuran và đánh giá da",
    shortname: "RJR-FOUND",
    summary:
      "<p>Cấu trúc da, cơ chế lão hóa, khoa học PN/PDRN &amp; quy trình đánh giá da trước điều trị.</p>",
    description:
      "<p>Khóa nền tảng giúp bạn hiểu da hoạt động thế nào và vì sao PN (polynucleotide) được dùng trong phục hồi, trẻ hóa da. Phần cuối hướng dẫn thăm khám, phân loại da và ghi phiếu đánh giá theo mẫu chuẩn của VIGO.</p>",
    objectives: [
      "Mô tả cấu trúc ba lớp của da và vai trò của nguyên bào sợi",
      "Phân biệt lão hóa nội sinh và ngoại sinh",
      "Giải thích cơ chế tác động của PN và khác biệt với PDRN",
      "Thực hiện đánh giá da theo Fitzpatrick, Glogau và ghi phiếu đánh giá",
    ],
    requirements: ["Hoàn thành khóa Overview Brand VIGO"],
    courseimage: "/images/courses/danh-gia-da.jpg",
    coursecategory: "Foundational Knowledge",
    teacher: TRAINING_TEAM,
    startdate: at(-45),
    enddate: 0,
    timemodified: at(-40),
  },
  {
    id: 11,
    fullname: "Rejuran Internal Training",
    shortname: "RJR-INT",
    summary:
      "<p>Chương trình đào tạo nội bộ về Rejuran: cơ chế PN, dòng sản phẩm, chỉ định, tư vấn khách hàng và chăm sóc sau điều trị.</p>",
    description:
      "<p>Khóa học trọng tâm cho nhân viên chuyên môn làm việc với dòng sản phẩm Rejuran. Nội dung đi từ cơ chế tác động, cách chọn sản phẩm theo tình trạng da, tới kịch bản tư vấn và hướng dẫn khách hàng chăm sóc sau liệu trình.</p><p>Học lần lượt từng phần. Cuối mỗi phần có bài kiểm tra 10 câu, đạt từ 8/10 để mở phần tiếp theo.</p>",
    objectives: [
      "Giải thích cơ chế tác động của PN theo cách khách hàng dễ hiểu",
      "Phân biệt Rejuran Healer, Rejuran I, Rejuran S và Rejuran HB",
      "Chọn sản phẩm phù hợp với tình trạng da và nhu cầu khách hàng",
      "Tư vấn theo quy trình 5 bước và xử lý câu hỏi thường gặp",
      "Hướng dẫn chăm sóc sau điều trị và lịch tái khám",
    ],
    requirements: ["Hoàn thành khóa Nền tảng Rejuran và đánh giá da", "Có tài khoản LMS và tai nghe để xem video"],
    courseimage: "/images/courses/rejuran-internal.jpg",
    coursecategory: "Brands",
    teacher: TRAINING_TEAM,
    startdate: at(-14),
    enddate: at(30),
    timemodified: at(-6),
  },
  {
    id: 12,
    fullname: "An toàn và xử lý biến chứng",
    shortname: "SAFE-01",
    summary:
      "<p>Nguyên tắc vô khuẩn, nhận diện sớm phản ứng và biến chứng sau thủ thuật, quy trình xử trí và báo cáo sự cố.</p>",
    description:
      "<p>Khóa học bắt buộc với mọi nhân viên chuyên môn, không phụ thuộc thương hiệu. Tập trung vào phòng ngừa: chuẩn bị đúng, nhận diện sớm và báo cáo kịp thời để bảo vệ khách hàng và phòng khám đối tác.</p>",
    objectives: [
      "Thực hiện đúng checklist an toàn trước thủ thuật",
      "Phân biệt phản ứng bình thường và dấu hiệu biến chứng",
      "Xử trí ban đầu các tình huống thường gặp",
      "Báo cáo sự cố theo đúng quy trình nội bộ",
    ],
    requirements: ["Dành cho nhân viên chuyên môn"],
    courseimage: "/images/courses/an-toan.jpg",
    coursecategory: "Foundational Knowledge",
    teacher: TRAINING_TEAM,
    startdate: at(-20),
    enddate: at(14),
    timemodified: at(-12),
  },
  {
    id: 14,
    fullname: "Kỹ thuật tiêm Rejuran trong Y tế",
    shortname: "RJR-TECH",
    summary:
      "<p>Giải phẫu vùng mặt ứng dụng, kỹ thuật tiêm nappage, bolus và liệu trình theo từng vùng điều trị.</p>",
    description:
      "<p>Khóa học kỹ thuật dành cho nhân viên hỗ trợ chuyên môn tại phòng khám đối tác. Nội dung gồm giải phẫu ứng dụng, các kỹ thuật tiêm thường dùng với Rejuran và cách xây dựng liệu trình theo vùng.</p>",
    objectives: [
      "Nhận biết các lớp mô và độ sâu tiêm phù hợp",
      "Nắm các vùng nguy hiểm cần tránh khi tiêm vùng mặt",
      "So sánh kỹ thuật nappage và bolus",
      "Xây dựng liệu trình toàn mặt và vùng mắt",
    ],
    requirements: ["Hoàn thành khóa Rejuran Internal Training"],
    courseimage: "/images/courses/ky-thuat-tiem.jpg",
    coursecategory: "Brands",
    teacher: TRAINING_TEAM,
    startdate: at(-14),
    enddate: 0,
    timemodified: at(-9),
  },
  {
    id: 15,
    fullname: "Ứng dụng chuyên sâu và phối hợp",
    shortname: "RJR-ADV",
    summary:
      "<p>Phối hợp Rejuran với laser, thiết bị năng lượng, vi kim và skinbooster. Phân tích ca lâm sàng tham khảo.</p>",
    description:
      "<p>Khóa nâng cao trong lộ trình, tập trung vào các phác đồ phối hợp đang được phòng khám đối tác áp dụng và cách phân tích ca lâm sàng.</p>",
    objectives: [
      "Lựa chọn thời điểm phối hợp với laser và thiết bị năng lượng",
      "Phối hợp với vi kim và skinbooster an toàn",
      "Phân tích ca lâm sàng và đề xuất liệu trình",
    ],
    requirements: ["Hoàn thành khóa Kỹ thuật tiêm Rejuran trong Y tế"],
    courseimage: "/images/courses/phoi-hop.jpg",
    coursecategory: "Integrated",
    teacher: TRAINING_TEAM,
    startdate: at(-14),
    enddate: 0,
    timemodified: at(-3),
  },
];

/** LP-01: lộ trình theo thứ tự, khóa sau mở khi hoàn thành khóa trước. */
export const learningPaths: LearningPath[] = [
  {
    id: 1,
    name: "Lộ trình nhân viên chuyên môn mới",
    description:
      "Lộ trình bắt buộc trong 90 ngày đầu. Học theo thứ tự Overview Brand, Foundational Knowledge, Brands, Integrated. Khóa sau tự mở khi bạn hoàn thành khóa trước.",
    steps: [
      { stage: "Overview Brand", courseid: 16 },
      { stage: "Foundational Knowledge", courseid: 13 },
      { stage: "Brands", courseid: 11 },
      { stage: "Brands", courseid: 14 },
      { stage: "Integrated", courseid: 15 },
    ],
  },
];

// ---------- Nội dung khóa (core_course_get_contents) ----------

type Clip = "kham-da" | "cham-soc-da-mat" | "dieu-tri-da-mat" | "laser" | "tiem";

const base = (id: number, name: string, modname: CourseModule["modname"]): CourseModule => ({
  id,
  instance: id,
  name,
  modname,
  url: `/mod/${modname}/view.php?id=${id}`,
  uservisible: true,
  visible: 1,
  completion: 0,
});

const pdfUrl = (short: string, n: number) => `/files/${short.toLowerCase()}-phan-${n}.pdf`;

/** Video nội bộ (module custom drivevideo). Hoàn thành tự động khi xem tới 90%. */
const video = (id: number, name: string, minutes: number, clip: Clip, description: string, attach?: { name: string; url: string }) => ({
  ...base(id, name, "drivevideo"),
  description,
  completion: 2 as const,
  customdata_duration: minutes * 60 + ((id * 7) % 50),
  videourl: `/videos/${clip}.mp4`,
  videoposter: `/videos/${clip}.jpg`,
  contents: attach
    ? [{ type: "file" as const, filename: attach.name, fileurl: attach.url, filesize: 1_200_000 + (id % 9) * 180_000, mimetype: "application/pdf" }]
    : undefined,
});

/** Bài đọc (mod_page). Hoàn thành khi mở xem (completion view). */
const page = (id: number, name: string, description: string, minutes: number) => ({
  ...base(id, name, "page"),
  description,
  completion: 2 as const,
  customdata_duration: minutes * 60,
});

/** Tài liệu PDF (mod_resource). Người học tự bấm Đánh dấu hoàn thành. */
const pdf = (id: number, name: string, fileurl: string, description: string) => ({
  ...base(id, name, "resource"),
  description,
  completion: 1 as const,
  contents: [
    {
      type: "file" as const,
      filename: fileurl.split("/").pop()!,
      fileurl,
      filesize: 1_400_000 + (id % 7) * 230_000,
      mimetype: "application/pdf",
    },
  ],
});

/** Link ngoài (mod_url). Hoàn thành khi mở link. */
const link = (id: number, name: string, externalurl: string, description: string) => ({
  ...base(id, name, "url"),
  description,
  externalurl,
  completion: 2 as const,
});

const quiz = (id: number, name: string, description: string) => ({
  ...base(id, name, "quiz"),
  description,
  completion: 2 as const,
});

/** Mục chung của khóa: hướng dẫn (label), forum thông báo, forum hỏi đáp, ngân hàng câu hỏi (ẩn với người học). */
const generalSection = (courseId: number, guide: string): CourseSection => ({
  id: courseId * 100,
  name: "Giới thiệu chung",
  section: 0,
  summary: "",
  uservisible: true,
  modules: [
    { ...base(courseId * 100 + 1, "Hướng dẫn học", "label"), description: guide },
    base(courseId * 100 + 2, "Thông báo khóa học", "forum"),
    base(courseId * 100 + 3, "Hỏi đáp", "forum"),
    base(courseId * 100 + 4, "Ngân hàng câu hỏi", "qbank"),
  ],
});

const GUIDE =
  "<p><strong>Cách học:</strong> học lần lượt từng phần. Cuối mỗi phần có bài kiểm tra 10 câu, cần đạt từ <strong>8/10</strong> để mở phần tiếp theo. Mỗi bài kiểm tra được làm tối đa 3 lần, hệ thống ghi nhận lần cao nhất.</p>";

const sec = (courseId: number, n: number, name: string, summary: string, modules: CourseModule[]): CourseSection => ({
  id: courseId * 100 + n * 10,
  name: `Phần ${n}: ${name}`,
  section: n,
  summary,
  uservisible: true,
  modules,
});

export const courseContents: Record<number, CourseSection[]> = {
  16: [
    generalSection(16, GUIDE),
    sec(16, 1, "VIGO và định hướng phát triển", "<p>VIGO là ai, đang đi về đâu và điều gì làm nên cách làm việc của VIGO.</p>", [
      video(1611, "Chào mừng bạn đến với VIGO", 6, "cham-soc-da-mat", "<p>Lời chào từ Ban Giám đốc và tổng quan chương trình hội nhập 90 ngày.</p>"),
      video(1612, "Sứ mệnh, tầm nhìn và giá trị cốt lõi", 9, "dieu-tri-da-mat", "<p>Ba giá trị cốt lõi và cách chúng thể hiện trong công việc hằng ngày.</p>", { name: "So-tay-hoi-nhap.pdf", url: pdfUrl("VIGO-OV", 1) }),
      page(1613, "Bài đọc: Sổ tay hội nhập nhân viên mới", "<p>Những việc cần làm trong tuần đầu và đầu mối hỗ trợ.</p>", 6),
      pdf(1614, "Sổ tay hội nhập (PDF)", pdfUrl("VIGO-OV", 1), "<p>Bản PDF để lưu và tra cứu.</p>"),
      quiz(1615, "Kiểm tra Phần 1", "<p>10 câu về định hướng và giá trị cốt lõi của VIGO.</p>"),
    ]),
    sec(16, 2, "Danh mục thương hiệu và sản phẩm", "<p>Các thương hiệu VIGO phân phối và nhóm khách hàng tương ứng.</p>", [
      video(1621, "Tổng quan danh mục thương hiệu", 12, "kham-da", "<p>Các nhóm sản phẩm: điều trị chuyên sâu tại phòng khám và chăm sóc tại nhà.</p>"),
      video(1622, "Rejuran và vị trí của dòng PN", 10, "tiem", "<p>Vì sao Rejuran là thương hiệu trọng tâm trong danh mục.</p>", { name: "Catalogue-san-pham.pdf", url: pdfUrl("VIGO-OV", 2) }),
      page(1623, "Bài đọc: Bản đồ sản phẩm theo nhu cầu khách hàng", "<p>Gợi ý nhóm sản phẩm theo nhu cầu phổ biến.</p>", 7),
      pdf(1624, "Catalogue sản phẩm (PDF)", pdfUrl("VIGO-OV", 2), "<p>Catalogue nội bộ, không gửi cho khách hàng.</p>"),
      quiz(1625, "Kiểm tra Phần 2", "<p>10 câu về danh mục thương hiệu.</p>"),
    ]),
    sec(16, 3, "Văn hóa phục vụ và quy trình làm việc", "<p>Chuẩn mực giao tiếp, phối hợp và bảo mật thông tin.</p>", [
      video(1631, "Chuẩn mực giao tiếp với khách hàng và đối tác", 8, "cham-soc-da-mat", "<p>Ngôn ngữ, trang phục và cách phản hồi khiếu nại.</p>"),
      video(1632, "Quy trình phối hợp giữa các phòng ban", 7, "laser", "<p>Đầu mối của Kinh doanh, Chuyên môn, Đào tạo và Chăm sóc khách hàng.</p>"),
      page(1633, "Bài đọc: Quy tắc ứng xử và bảo mật thông tin", "<p>Những điều được và không được chia sẻ ra bên ngoài.</p>", 5),
      pdf(1634, "Quy tắc ứng xử (PDF)", pdfUrl("VIGO-OV", 3), "<p>Bản ký xác nhận gửi Phòng Nhân sự.</p>"),
      quiz(1635, "Kiểm tra Phần 3", "<p>10 câu về văn hóa và quy trình làm việc.</p>"),
    ]),
  ],
  13: [
    generalSection(13, GUIDE),
    sec(13, 1, "Cấu trúc da và quá trình lão hóa", "<p>Nền tảng sinh học của da để hiểu các phương pháp điều trị.</p>", [
      video(1311, "Cấu trúc ba lớp của da", 12, "kham-da", "<p>Thượng bì, trung bì, hạ bì và chức năng từng lớp.</p>"),
      video(1312, "Cơ chế lão hóa nội sinh và ngoại sinh", 14, "dieu-tri-da-mat", "<p>Tuổi tác, tia UV, ô nhiễm và lối sống tác động lên da thế nào.</p>", { name: "Slide-Phan-1.pdf", url: pdfUrl("RJR-FOUND", 1) }),
      page(1313, "Bài đọc: Nguyên bào sợi, collagen và chất nền ngoại bào", "<p>Ba thành phần quyết định độ đàn hồi và độ dày của da.</p>", 8),
      pdf(1314, "Slide bài giảng Phần 1 (PDF)", pdfUrl("RJR-FOUND", 1), "<p>Slide dùng trong buổi đào tạo trực tiếp.</p>"),
      quiz(1315, "Kiểm tra Phần 1", "<p>10 câu về cấu trúc da và lão hóa.</p>"),
    ]),
    sec(13, 2, "Khoa học PN và PDRN", "<p>Polynucleotide là gì và tác động lên mô da ra sao.</p>", [
      video(1321, "PN và PDRN khác nhau thế nào", 15, "tiem", "<p>Nguồn gốc, kích thước phân tử và ứng dụng.</p>"),
      video(1322, "Cơ chế tác động của PN lên mô da", 16, "dieu-tri-da-mat", "<p>Hỗ trợ phục hồi, chống viêm và tái tạo chất nền.</p>", { name: "Slide-Phan-2.pdf", url: pdfUrl("RJR-FOUND", 2) }),
      page(1323, "Bài đọc: Tóm tắt khoa học PN/PDRN", "<p>Các ý chính cần nhớ để tư vấn.</p>", 7),
      pdf(1324, "Slide bài giảng Phần 2 (PDF)", pdfUrl("RJR-FOUND", 2), "<p>Slide dùng trong buổi đào tạo trực tiếp.</p>"),
      link(1325, "Tài liệu tham khảo: nghiên cứu về polynucleotide", "https://pubmed.ncbi.nlm.nih.gov/?term=polynucleotide+skin", "<p>Danh sách bài báo khoa học trên PubMed. Mở ở tab mới.</p>"),
      quiz(1326, "Kiểm tra Phần 2", "<p>10 câu về khoa học PN/PDRN.</p>"),
    ]),
    sec(13, 3, "Đánh giá da trước điều trị", "<p>Thăm khám, phân loại và ghi phiếu đánh giá da.</p>", [
      video(1331, "Quy trình thăm khám và hỏi bệnh sử", 13, "kham-da", "<p>Các câu hỏi bắt buộc trước khi đề xuất liệu trình.</p>"),
      video(1332, "Phân loại da theo Fitzpatrick và Glogau", 11, "cham-soc-da-mat", "<p>Cách xác định nhanh và ứng dụng khi chọn phác đồ.</p>"),
      page(1333, "Bài đọc: Phiếu đánh giá da chuẩn VIGO", "<p>Hướng dẫn điền từng mục của phiếu.</p>", 6),
      pdf(1334, "Mẫu phiếu đánh giá da (PDF)", pdfUrl("RJR-FOUND", 3), "<p>In ra để dùng khi thực hành.</p>"),
      quiz(1335, "Kiểm tra Phần 3", "<p>10 câu về thăm khám và đánh giá da.</p>"),
    ]),
  ],
  11: [
    generalSection(11, GUIDE),
    sec(11, 1, "Tổng quan Rejuran và cơ chế PN", "<p>Câu chuyện thương hiệu, cơ chế tác động và vị trí của Rejuran so với các phương pháp khác.</p>", [
      video(1111, "Câu chuyện thương hiệu Rejuran", 8, "cham-soc-da-mat", "<p>Rejuran ra đời thế nào và vì sao được bác sĩ da liễu tin dùng.</p>"),
      video(1112, "Cơ chế tác động của PN trên da", 14, "dieu-tri-da-mat", "<p>Giải thích cơ chế bằng ngôn ngữ dễ hiểu để dùng khi tư vấn.</p>", { name: "Slide-Phan-1-Rejuran.pdf", url: pdfUrl("RJR-INT", 1) }),
      page(1113, "Bài đọc: Rejuran khác gì filler và skinbooster HA", "<p>Bảng so sánh nhanh, dùng khi khách hàng hỏi.</p>", 6),
      pdf(1114, "Slide bài giảng Phần 1 (PDF)", pdfUrl("RJR-INT", 1), "<p>Slide dùng trong buổi đào tạo trực tiếp.</p>"),
      link(1115, "Tham khảo: tổng quan nghiên cứu về polynucleotide", "https://pubmed.ncbi.nlm.nih.gov/?term=polynucleotide+dermatology", "<p>Danh sách nghiên cứu trên PubMed để đọc thêm. Mở ở tab mới.</p>"),
      quiz(1116, "Kiểm tra Phần 1", "<p>10 câu gồm chọn một, chọn nhiều và đúng/sai. Đạt từ 8/10 để mở Phần 2.</p>"),
    ]),
    sec(11, 2, "Dòng sản phẩm và chỉ định", "<p>Bốn dòng sản phẩm chính và cách chọn theo tình trạng da.</p>", [
      video(1121, "Rejuran Healer, Rejuran I, Rejuran S và Rejuran HB", 16, "tiem", "<p>Đặc điểm và chỉ định chính của từng dòng.</p>"),
      video(1122, "Chọn sản phẩm theo tình trạng da", 12, "kham-da", "<p>Các tình huống thường gặp tại phòng khám đối tác.</p>", { name: "Bang-chi-dinh.pdf", url: pdfUrl("RJR-INT", 2) }),
      page(1123, "Bài đọc: Chỉ định và chống chỉ định", "<p>Bảng tra cứu nhanh trước khi tư vấn.</p>", 7),
      pdf(1124, "Bảng chỉ định sản phẩm (PDF)", pdfUrl("RJR-INT", 2), "<p>In và để tại quầy tư vấn.</p>"),
      quiz(1125, "Kiểm tra Phần 2", "<p>10 câu về dòng sản phẩm và chỉ định.</p>"),
    ]),
    sec(11, 3, "Tư vấn khách hàng", "<p>Quy trình tư vấn 5 bước và cách trả lời câu hỏi thường gặp.</p>", [
      video(1131, "Quy trình tư vấn 5 bước", 11, "cham-soc-da-mat", "<p>Từ lắng nghe nhu cầu tới chốt liệu trình.</p>"),
      video(1132, "Trả lời câu hỏi thường gặp của khách hàng", 13, "laser", "<p>Đau không, bao lâu thấy hiệu quả, có cần nghỉ dưỡng không.</p>"),
      page(1133, "Bài đọc: Kịch bản tư vấn mẫu", "<p>Kịch bản mẫu cho khách hàng lần đầu.</p>", 8),
      pdf(1134, "Bộ câu hỏi thường gặp (PDF)", pdfUrl("RJR-INT", 3), "<p>Bản tổng hợp câu hỏi và gợi ý trả lời.</p>"),
      quiz(1135, "Kiểm tra Phần 3", "<p>10 câu tình huống tư vấn.</p>"),
    ]),
    sec(11, 4, "Chăm sóc sau điều trị và theo dõi", "<p>Hướng dẫn khách hàng sau liệu trình và lịch tái khám.</p>", [
      video(1141, "Hướng dẫn chăm sóc tại nhà sau liệu trình", 9, "dieu-tri-da-mat", "<p>Những việc nên và không nên làm trong 72 giờ đầu.</p>"),
      video(1142, "Lịch tái khám và đánh giá kết quả", 7, "kham-da", "<p>Chụp ảnh trước sau và ghi nhận phản hồi khách hàng.</p>"),
      page(1143, "Bài đọc: Hướng dẫn chăm sóc gửi khách hàng", "<p>Nội dung chuẩn để gửi khách hàng qua Zalo hoặc in.</p>", 5),
      pdf(1144, "Phiếu hướng dẫn chăm sóc (PDF)", pdfUrl("RJR-INT", 4), "<p>Mẫu phiếu in giao cho khách hàng.</p>"),
      {
        ...base(1145, "Bài thu hoạch: tình huống tư vấn thực tế", "assign"),
        description:
          "<p>Mô tả một ca tư vấn bạn đã tham gia (ẩn thông tin khách hàng), nêu sản phẩm đề xuất và lý do. Nộp file Word hoặc PDF, tối đa 2 trang.</p>",
      },
      quiz(1146, "Kiểm tra Phần 4", "<p>10 câu tổng hợp. Đạt từ 8/10 để hoàn thành khóa và nhận chứng nhận.</p>"),
    ]),
  ],
  12: [
    generalSection(12, GUIDE),
    sec(12, 1, "Nguyên tắc vô khuẩn và chuẩn bị thủ thuật", "<p>Phòng ngừa là bước quan trọng nhất trong an toàn thủ thuật.</p>", [
      video(1211, "Chuẩn bị phòng thủ thuật và dụng cụ", 10, "laser", "<p>Sắp xếp khu vực sạch, kiểm tra hạn dùng và nhiệt độ bảo quản.</p>"),
      video(1212, "Sát khuẩn da và vô khuẩn khi tiêm", 9, "tiem", "<p>Trình tự sát khuẩn và các lỗi hay gặp.</p>", { name: "Checklist-an-toan.pdf", url: pdfUrl("SAFE-01", 1) }),
      page(1213, "Bài đọc: Checklist an toàn trước thủ thuật", "<p>12 mục cần kiểm tra trước mỗi ca.</p>", 5),
      pdf(1214, "Checklist an toàn (PDF)", pdfUrl("SAFE-01", 1), "<p>In và dán tại phòng thủ thuật.</p>"),
      link(1215, "WHO: Vệ sinh tay trong cơ sở y tế", "https://www.who.int/campaigns/world-hand-hygiene-day", "<p>Tài liệu của Tổ chức Y tế Thế giới. Mở ở tab mới.</p>"),
      quiz(1216, "Kiểm tra Phần 1", "<p>10 câu về vô khuẩn và chuẩn bị thủ thuật.</p>"),
    ]),
    sec(12, 2, "Nhận diện phản ứng và biến chứng", "<p>Phân biệt phản ứng bình thường với dấu hiệu cần xử trí.</p>", [
      video(1221, "Phản ứng thường gặp sau tiêm vi điểm", 14, "dieu-tri-da-mat", "<p>Sẩn, đỏ, sưng nhẹ và thời gian tự hết.</p>"),
      video(1222, "Dấu hiệu cảnh báo cần xử trí ngay", 12, "kham-da", "<p>Đau tăng dần, đổi màu da, sốt, mụn mủ.</p>", { name: "Bang-phan-biet.pdf", url: pdfUrl("SAFE-01", 2) }),
      page(1223, "Bài đọc: Phân biệt phản ứng và biến chứng", "<p>Bảng phân biệt theo thời gian và triệu chứng.</p>", 7),
      pdf(1224, "Bảng nhận diện biến chứng (PDF)", pdfUrl("SAFE-01", 2), "<p>Tài liệu tra cứu nhanh.</p>"),
      quiz(1225, "Kiểm tra Phần 2", "<p>10 câu nhận diện tình huống.</p>"),
    ]),
    sec(12, 3, "Xử trí, theo dõi và báo cáo sự cố", "<p>Xử trí ban đầu và báo cáo đúng quy trình.</p>", [
      video(1231, "Xử trí bầm tím, sưng nề và nhiễm trùng", 15, "cham-soc-da-mat", "<p>Các bước xử trí ban đầu và khi nào chuyển bác sĩ.</p>"),
      video(1232, "Quy trình báo cáo sự cố và chăm sóc khách hàng", 8, "laser", "<p>Ai cần được báo, trong bao lâu và ghi nhận ra sao.</p>"),
      page(1233, "Bài đọc: Mẫu báo cáo sự cố", "<p>Hướng dẫn điền mẫu báo cáo sự cố nội bộ.</p>", 6),
      pdf(1234, "Mẫu báo cáo sự cố (PDF)", pdfUrl("SAFE-01", 3), "<p>Mẫu dùng thống nhất toàn hệ thống.</p>"),
      quiz(1235, "Kiểm tra Phần 3", "<p>10 câu tình huống xử trí.</p>"),
    ]),
  ],
  14: [
    generalSection(14, GUIDE),
    sec(14, 1, "Giải phẫu vùng mặt ứng dụng", "<p>Hiểu các lớp mô để tiêm đúng độ sâu và an toàn.</p>", [
      video(1411, "Các lớp mô và độ sâu tiêm", 15, "kham-da", "<p>Độ sâu phù hợp cho từng mục tiêu điều trị.</p>"),
      video(1412, "Các vùng nguy hiểm cần tránh", 13, "tiem", "<p>Mạch máu và thần kinh quan trọng vùng mặt.</p>", { name: "Giai-phau-vung-mat.pdf", url: pdfUrl("RJR-TECH", 1) }),
      page(1413, "Bài đọc: Bản đồ giải phẫu vùng mặt", "<p>Tóm tắt các mốc giải phẫu cần nhớ.</p>", 8),
      pdf(1414, "Slide giải phẫu (PDF)", pdfUrl("RJR-TECH", 1), "<p>Slide dùng trong buổi thực hành.</p>"),
      quiz(1415, "Kiểm tra Phần 1", "<p>10 câu về giải phẫu ứng dụng.</p>"),
    ]),
    sec(14, 2, "Kỹ thuật tiêm nappage và bolus", "<p>Hai kỹ thuật thường dùng nhất với Rejuran Healer.</p>", [
      video(1421, "Kỹ thuật nappage (vi điểm)", 17, "tiem", "<p>Góc kim, độ sâu, khoảng cách điểm tiêm.</p>"),
      video(1422, "Kỹ thuật bolus và tiêm theo đường", 14, "dieu-tri-da-mat", "<p>Khi nào chọn bolus và lượng sản phẩm mỗi điểm.</p>"),
      page(1423, "Bài đọc: So sánh nappage và bolus", "<p>Ưu nhược điểm của từng kỹ thuật.</p>", 6),
      pdf(1424, "Slide kỹ thuật tiêm (PDF)", pdfUrl("RJR-TECH", 2), "<p>Slide dùng trong buổi thực hành.</p>"),
      quiz(1425, "Kiểm tra Phần 2", "<p>10 câu về kỹ thuật tiêm.</p>"),
    ]),
    sec(14, 3, "Liệu trình theo vùng điều trị", "<p>Xây dựng liệu trình toàn mặt và vùng mắt.</p>", [
      video(1431, "Liệu trình toàn mặt với Rejuran Healer", 12, "dieu-tri-da-mat", "<p>Số buổi, khoảng cách và lượng sản phẩm.</p>"),
      video(1432, "Vùng mắt với Rejuran I", 10, "cham-soc-da-mat", "<p>Đặc thù vùng da mỏng quanh mắt.</p>"),
      page(1433, "Bài đọc: Bảng liệu trình tham khảo", "<p>Liệu trình tham khảo theo vùng.</p>", 5),
      pdf(1434, "Bảng liệu trình (PDF)", pdfUrl("RJR-TECH", 3), "<p>Tài liệu tra cứu.</p>"),
      quiz(1435, "Kiểm tra Phần 3", "<p>10 câu về liệu trình.</p>"),
    ]),
  ],
  15: [
    generalSection(15, GUIDE),
    sec(15, 1, "Phối hợp với laser và thiết bị năng lượng", "<p>Thời điểm và thứ tự phối hợp an toàn.</p>", [
      video(1511, "Nguyên tắc phối hợp với thiết bị năng lượng", 15, "laser", "<p>Laser, RF, HIFU và thời điểm phối hợp PN.</p>"),
      video(1512, "Phác đồ phối hợp trong điều trị nám và sắc tố", 18, "dieu-tri-da-mat", "<p>Các phác đồ tham khảo tại phòng khám đối tác.</p>"),
      page(1513, "Bài đọc: Thứ tự phối hợp trong cùng buổi", "<p>Nguyên tắc sắp xếp thủ thuật.</p>", 6),
      pdf(1514, "Phác đồ phối hợp (PDF)", pdfUrl("RJR-ADV", 1), "<p>Tài liệu tham khảo.</p>"),
      quiz(1515, "Kiểm tra Phần 1", "<p>10 câu về phối hợp thiết bị.</p>"),
    ]),
    sec(15, 2, "Phối hợp với vi kim và skinbooster", "<p>Kết hợp để tăng hiệu quả phục hồi.</p>", [
      video(1521, "Rejuran kết hợp vi kim", 13, "tiem", "<p>Chỉ định, lưu ý và chăm sóc sau.</p>"),
      video(1522, "Rejuran kết hợp skinbooster HA", 11, "cham-soc-da-mat", "<p>Khi nào nên phối hợp và khoảng cách giữa các buổi.</p>"),
      page(1523, "Bài đọc: Lưu ý khi phối hợp nhiều phương pháp", "<p>Những điểm cần kiểm tra trước khi phối hợp.</p>", 5),
      pdf(1524, "Tài liệu phối hợp vi kim (PDF)", pdfUrl("RJR-ADV", 2), "<p>Tài liệu tham khảo.</p>"),
      quiz(1525, "Kiểm tra Phần 2", "<p>10 câu về phối hợp vi kim và skinbooster.</p>"),
    ]),
    sec(15, 3, "Ca lâm sàng tham khảo", "<p>Phân tích ca thực tế và đề xuất liệu trình.</p>", [
      video(1531, "Ca 1: Da lão hóa sớm do ánh nắng", 12, "kham-da", "<p>Đánh giá, liệu trình và kết quả sau 3 tháng.</p>"),
      video(1532, "Ca 2: Da nhạy cảm sau điều trị laser", 10, "laser", "<p>Phục hồi hàng rào da với PN.</p>"),
      page(1533, "Bài đọc: Khung phân tích ca lâm sàng", "<p>Các bước trình bày một ca.</p>", 6),
      pdf(1534, "Tập ca lâm sàng (PDF)", pdfUrl("RJR-ADV", 3), "<p>Ảnh đã được khách hàng đồng ý sử dụng nội bộ.</p>"),
      quiz(1535, "Kiểm tra Phần 3", "<p>10 câu phân tích ca.</p>"),
    ]),
  ],
};

// ---------- Quiz (mod_quiz_get_quizzes_by_courses) ----------

/** Hạn đóng của từng quiz (0 = không đặt hạn). Tính tương đối theo hôm nay. */
const quizClose: Record<number, number> = {
  1116: at(3, 17),
  1125: at(10, 17),
  1135: at(17, 17),
  1146: at(24, 17),
  1225: at(1, 17),
  1235: at(12, 17),
  1615: at(-48, 17),
  1625: at(-46, 17),
  1635: at(-44, 17),
};

export const quizzes: Quiz[] = Object.entries(courseContents).flatMap(([courseid, sections]) =>
  sections.flatMap((s) =>
    s.modules
      .filter((m) => m.modname === "quiz")
      .map<Quiz>((m) => ({
        id: m.id,
        coursemodule: m.id,
        course: Number(courseid),
        name: m.name,
        intro: m.description ?? "",
        timeopen: 0,
        timeclose: quizClose[m.id] ?? 0,
        timelimit: 900,
        attempts: 3,
        grademethod: 1, // điểm cao nhất
        sumgrades: 10,
        grade: 10,
        gradepass: 8,
        preferredbehaviour: "deferredfeedback",
      })),
  ),
);

// ---------- Thông báo chung (site announcements) ----------

const monthLabel = (offsetDays: number) => {
  const d = new Date(at(offsetDays) * 1000);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
};

export const announcements: Announcement[] = [
  {
    id: 1,
    name: `Lịch đào tạo tập trung tháng ${monthLabel(5)}`,
    message: `<p>Phòng Đào tạo gửi Anh/Chị lịch đào tạo tập trung tháng ${monthLabel(5)}. Các buổi thực hành tiêm trên mô hình tổ chức tại Trung tâm Đào tạo VIGO, tầng 5.</p><ul><li>Thực hành Rejuran Healer trên mô hình: xem trong Lịch</li><li>Workshop tư vấn khách hàng: trực tuyến qua Zoom</li></ul><p>Anh/Chị vui lòng hoàn thành phần học trực tuyến tương ứng trước buổi tập trung.</p>`,
    created: at(-1, 16, 20),
    userfullname: TRAINING_TEAM,
  },
  {
    id: 2,
    name: "Cập nhật quy định hoàn thành lộ trình nhân viên mới",
    message:
      "<p>Từ đợt này, nhân viên mới cần hoàn thành <strong>Lộ trình nhân viên chuyên môn mới</strong> trong 90 ngày kể từ ngày nhận việc. Mỗi bài kiểm tra cuối phần cần đạt từ 8/10, tối đa 3 lần làm.</p><p>Trường hợp hết lượt làm bài, Anh/Chị liên hệ Phòng Đào tạo để được hướng dẫn ôn tập và mở thêm lượt.</p>",
    created: at(-6, 10, 5),
    userfullname: TRAINING_TEAM,
  },
  {
    id: 3,
    name: "Ra mắt cổng học tập VIGO Learning",
    message:
      "<p>Cổng học tập mới cho phép Anh/Chị học trên máy tính và điện thoại, theo dõi tiến độ, làm bài kiểm tra và nhận chứng nhận ngay khi hoàn thành khóa học.</p><p>Mọi góp ý về nội dung và trải nghiệm, vui lòng gửi về daotao@vigo.vn.</p>",
    created: at(-21, 9, 0),
    userfullname: TRAINING_TEAM,
  },
];

// ---------- Forum của khóa (CDET-08) ----------

export const forumDiscussions: ForumDiscussion[] = [
  {
    id: 101,
    courseid: 11,
    forumtype: "news",
    name: "Lịch thực hành Rejuran Healer trên mô hình",
    message:
      "<p>Sau khi hoàn thành Phần 2, Anh/Chị đăng ký buổi thực hành trên mô hình tại Trung tâm Đào tạo. Lịch cụ thể xem ở mục Lịch. Mỗi buổi tối đa 12 học viên.</p>",
    created: at(-2, 14, 0),
    userfullname: TRAINING_TEAM,
    replies: [],
  },
  {
    id: 102,
    courseid: 11,
    forumtype: "news",
    name: "Đã cập nhật slide Phần 1",
    message: "<p>Slide Phần 1 đã bổ sung trang so sánh Rejuran với skinbooster HA. Anh/Chị tải lại bản mới ở mục Tài liệu.</p>",
    created: at(-6, 9, 30),
    userfullname: TRAINING_TEAM,
    replies: [],
  },
  {
    id: 103,
    courseid: 11,
    forumtype: "qanda",
    name: "Khách hàng dị ứng hải sản có dùng Rejuran được không?",
    message: "<p>Em có khách hỏi bị dị ứng hải sản thì có dùng được không, em nên trả lời thế nào ạ?</p>",
    created: at(-4, 20, 15),
    userfullname: "Lê Thu Hà",
    replies: [
      {
        id: 1031,
        message:
          "<p>PN của Rejuran có nguồn gốc từ cá hồi, vì vậy tiền sử dị ứng cá hoặc hải sản là điểm cần hỏi kỹ và báo bác sĩ chỉ định. Nhân viên tư vấn không tự kết luận, hãy ghi vào phiếu đánh giá và chuyển bác sĩ quyết định.</p>",
        created: at(-4, 21, 40),
        userfullname: TRAINING_TEAM,
      },
    ],
  },
  {
    id: 104,
    courseid: 11,
    forumtype: "qanda",
    name: "Sau tiêm bao lâu khách được trang điểm?",
    message: "<p>Khách hỏi sau tiêm bao lâu thì trang điểm lại được ạ?</p>",
    created: at(-9, 11, 0),
    userfullname: "Phạm Quốc Bảo",
    replies: [
      {
        id: 1041,
        message:
          "<p>Hướng dẫn chung là tránh trang điểm trong 24 giờ đầu để các điểm tiêm lành. Xem thêm Bài đọc Phần 4 để có nội dung chuẩn gửi khách hàng.</p>",
        created: at(-9, 15, 10),
        userfullname: TRAINING_TEAM,
      },
    ],
  },
  {
    id: 201,
    courseid: 12,
    forumtype: "news",
    name: "Bổ sung mẫu báo cáo sự cố mới",
    message: "<p>Mẫu báo cáo sự cố đã cập nhật theo quy định mới, áp dụng từ tuần này. Tải ở Phần 3.</p>",
    created: at(-3, 10, 0),
    userfullname: TRAINING_TEAM,
    replies: [],
  },
  {
    id: 202,
    courseid: 12,
    forumtype: "qanda",
    name: "Sẩn sau tiêm kéo dài bao lâu là bình thường?",
    message: "<p>Khách còn sẩn nhẹ sau 2 ngày, như vậy có cần báo bác sĩ không ạ?</p>",
    created: at(-7, 19, 5),
    userfullname: "Nguyễn Hoài Nam",
    replies: [
      {
        id: 2021,
        message:
          "<p>Sẩn nhỏ thường giảm dần trong vài ngày. Nếu sẩn kèm đau tăng, nóng đỏ lan rộng hoặc có mủ thì cần báo bác sĩ ngay. Xem bảng phân biệt ở Phần 2.</p>",
        created: at(-7, 20, 30),
        userfullname: TRAINING_TEAM,
      },
    ],
  },
  {
    id: 1301,
    courseid: 13,
    forumtype: "news",
    name: "Chào mừng đến với khóa Nền tảng",
    message: "<p>Khóa học gồm 3 phần. Anh/Chị nên học Phần 1 và Phần 2 trước buổi đào tạo trực tiếp.</p>",
    created: at(-44, 9, 0),
    userfullname: TRAINING_TEAM,
    replies: [],
  },
  {
    id: 1601,
    courseid: 16,
    forumtype: "news",
    name: "Chào mừng nhân viên mới",
    message: "<p>Chào mừng Anh/Chị gia nhập VIGO. Đây là khóa học đầu tiên trong lộ trình, hãy hoàn thành trong tuần đầu tiên.</p>",
    created: at(-60, 8, 0),
    userfullname: TRAINING_TEAM,
    replies: [],
  },
  {
    id: 1401,
    courseid: 14,
    forumtype: "news",
    name: "Yêu cầu trước khi học khóa kỹ thuật",
    message: "<p>Khóa học mở sau khi Anh/Chị hoàn thành Rejuran Internal Training. Buổi thực hành bắt buộc có mặt trực tiếp.</p>",
    created: at(-10, 9, 0),
    userfullname: TRAINING_TEAM,
    replies: [],
  },
];

// ---------- Lịch (core_calendar_*) ----------

const quizCourseName = (cmid: number) => {
  const q = quizzes.find((x) => x.coursemodule === cmid)!;
  return { courseid: q.course, coursename: courses.find((c) => c.id === q.course)!.fullname, name: q.name };
};

const quizDeadlineEvents: CalendarEvent[] = Object.entries(quizClose)
  .filter(([, t]) => t > at(-30))
  .map(([cmid, t], i) => {
    const info = quizCourseName(Number(cmid));
    return {
      id: 500 + i,
      name: `Hạn nộp: ${info.name}`,
      description: `<p>Bài kiểm tra đóng lúc 17:00. Cần đạt từ 8/10.</p>`,
      eventtype: "close" as const,
      timestart: t,
      timeduration: 0,
      courseid: info.courseid,
      coursename: info.coursename,
      instance: Number(cmid),
    };
  });

export const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    name: "Thực hành Rejuran Healer trên mô hình",
    description: "<p>Thực hành kỹ thuật nappage trên mô hình da. Mang theo phiếu đánh giá da đã in.</p>",
    eventtype: "site",
    timestart: at(2, 14),
    timeduration: 3 * 3600,
    location: "Trung tâm Đào tạo VIGO, tầng 5",
  },
  {
    id: 2,
    name: "Workshop: Tư vấn khách hàng lần đầu",
    description: "<p>Đóng vai các tình huống tư vấn thường gặp. Học trước Phần 3 khóa Rejuran Internal Training.</p>",
    eventtype: "site",
    timestart: at(8, 9),
    timeduration: 2 * 3600,
    location: "Trực tuyến qua Zoom",
  },
  {
    id: 3,
    name: "Chia sẻ ca lâm sàng cùng bác sĩ đối tác",
    description: "<p>Buổi chia sẻ định kỳ hằng tháng.</p>",
    eventtype: "site",
    timestart: at(15, 15),
    timeduration: 2 * 3600,
    location: "Trung tâm Đào tạo VIGO, tầng 5",
  },
  {
    id: 4,
    name: "Đào tạo trực tiếp: An toàn trong thủ thuật",
    description: "<p>Buổi đào tạo trực tiếp đi kèm khóa An toàn và xử lý biến chứng.</p>",
    eventtype: "course",
    timestart: at(-5, 14),
    timeduration: 3 * 3600,
    courseid: 12,
    coursename: "An toàn và xử lý biến chứng",
    location: "Trung tâm Đào tạo VIGO, tầng 5",
  },
  {
    id: 5,
    name: "Hạn hoàn thành khóa An toàn và xử lý biến chứng",
    description: "<p>Hoàn thành cả 3 phần trước ngày này.</p>",
    eventtype: "course",
    timestart: at(14, 17),
    timeduration: 0,
    courseid: 12,
    coursename: "An toàn và xử lý biến chứng",
  },
  {
    id: 6,
    name: "Họp giao ban chuyên môn",
    description: "<p>Cập nhật tình hình đào tạo và kế hoạch tháng.</p>",
    eventtype: "site",
    timestart: at(-12, 8, 30),
    timeduration: 3600,
    location: "Phòng họp lớn",
  },
  ...quizDeadlineEvents,
];
