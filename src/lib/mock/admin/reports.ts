/**
 * Admin RPT-01, RPT-02: bộ custom report dựng sẵn bằng Report builder (core), nhóm theo câu hỏi nghiệp vụ.
 * Mỗi báo cáo ghi nguồn (report source của Moodle), lịch gửi email và người xem (audience).
 * Dữ liệu từng báo cáo tính ở src/lib/admin.ts từ cùng tiến độ học viên.
 */

export type ReportId = "tien-do-khoa" | "tien-do-phong-ban" | "chua-hoan-thanh" | "ket-qua-kiem-tra" | "hoat-dong";

export interface ReportDef {
  id: ReportId;
  /** reportbuilder/view.php?id= */
  reportid: number;
  name: string;
  /** Câu hỏi nghiệp vụ báo cáo trả lời (RPT-02) */
  question: string;
  description: string;
  /** Report source của Report builder */
  source: string;
  audience: string;
  schedule: string;
}

export const reportDefs: ReportDef[] = [
  {
    id: "chua-hoan-thanh",
    reportid: 3,
    name: "Học viên chưa hoàn thành",
    question: "Ai chưa học xong?",
    description: "Học viên đang học hoặc chưa bắt đầu ở từng khóa, kèm lần truy cập cuối.",
    source: "Course participants",
    audience: "Phòng Đào tạo, trưởng phòng ban",
    schedule: "Thứ Hai hằng tuần, 8:00",
  },
  {
    id: "tien-do-phong-ban",
    reportid: 2,
    name: "Tiến độ theo phòng ban",
    question: "Phòng nào chậm?",
    description: "Tỉ lệ hoàn thành và % trung bình của từng phòng ban trên các khóa được ghi danh.",
    source: "Cohorts + Course participants",
    audience: "Ban Giám đốc, Phòng Đào tạo",
    schedule: "Thứ Hai hằng tuần, 8:00",
  },
  {
    id: "tien-do-khoa",
    reportid: 1,
    name: "Tiến độ theo khóa",
    question: "Khóa nào đang có nhiều người học, khóa nào ít người xong?",
    description: "Số học viên, đang học, hoàn thành và % trung bình của từng khóa.",
    source: "Courses + Course participants",
    audience: "Phòng Đào tạo",
    schedule: "Ngày 1 hằng tháng",
  },
  {
    id: "ket-qua-kiem-tra",
    reportid: 4,
    name: "Kết quả bài kiểm tra",
    question: "Bài kiểm tra nào khó?",
    description: "Số người đã làm, đạt, điểm trung bình và số người hết lượt của từng bài kiểm tra.",
    source: "Quiz attempts",
    audience: "Phòng Đào tạo, người soạn bài",
    schedule: "Không gửi định kỳ",
  },
  {
    id: "hoat-dong",
    reportid: 5,
    name: "Học viên hoạt động",
    question: "Ai không vào học 30 ngày qua?",
    description: "Lần truy cập cuối của từng học viên, lọc theo phòng ban.",
    source: "Users",
    audience: "Phòng Đào tạo",
    schedule: "Thứ Hai hằng tuần, 8:00",
  },
];
