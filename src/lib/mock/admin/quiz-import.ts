/**
 * Admin QUIZ-04: file mẫu giả lập khi người soạn chọn file Excel (.xlsx). Mockup không đọc .xlsx,
 * nên dùng 8 dòng này (có 2 dòng lỗi) để minh họa bước xem trước. File .csv thì đọc thật.
 * Cột theo mẫu của local_quizexcel (team tự làm, owner Đạt Trần).
 */
export const QUIZ_COLUMNS = ["Loại câu", "Câu hỏi", "Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D", "Đáp án E", "Đáp án đúng", "Điểm", "Giải thích"] as const;

export const sampleImportRows: string[][] = [
  ["Chọn một", "Rejuran Healer thường dùng bao nhiêu buổi cho một liệu trình cơ bản?", "1 buổi", "3 buổi, cách nhau 2-4 tuần", "10 buổi liên tục", "", "", "B", "1", "Liệu trình cơ bản 3 buổi."],
  ["Chọn nhiều", "Những dấu hiệu nào cần ngừng thủ thuật ngay?", "Đau nhẹ tại chỗ tiêm", "Khó thở", "Phát ban lan rộng", "Đỏ nhẹ 10 phút", "", "B,C", "1", "Dấu hiệu phản vệ."],
  ["Đúng/Sai", "Có thể trang điểm ngay sau khi tiêm Rejuran.", "", "", "", "", "", "Sai", "1", "Chờ ít nhất 24 giờ."],
  ["Chọn một", "", "Có", "Không", "", "", "", "A", "1", ""],
  ["Chọn một", "PN trong Rejuran được chiết xuất từ đâu?", "Cá hồi", "Thực vật", "Tổng hợp hóa học", "", "", "A", "1", ""],
  ["Chọn nhiều", "Sản phẩm nào thuộc dòng Rejuran?", "Rejuran Healer", "Rejuran I", "Rejuran S", "", "", "A,B,C", "1", ""],
  ["Chọn một", "Khoảng cách giữa hai buổi tiêm khuyến nghị là?", "1 ngày", "2-4 tuần", "", "", "", "D", "1", ""],
  ["Đúng/Sai", "Khách hàng dị ứng cá hồi cần được hỏi kỹ trước khi điều trị.", "", "", "", "", "", "Đúng", "1", ""],
];
