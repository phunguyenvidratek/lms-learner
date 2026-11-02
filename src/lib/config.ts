/**
 * LEARN-08: địa chỉ Moodle để mở hoạt động chưa hỗ trợ trên NextJS (Assignment, H5P, Feedback...).
 * Bản thật: gọi tool_mobile_get_autologin_key để người học không phải đăng nhập lại.
 */
export const LMS_URL = process.env.NEXT_PUBLIC_LMS_URL ?? "https://lms.vigo.vn";

/** Tên hiển thị đơn vị phụ trách đào tạo (giảng viên chung của các khóa). */
export const TRAINING_TEAM = "Phòng Đào tạo VIGO";
