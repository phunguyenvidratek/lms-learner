/**
 * Backlog learner portal v0.1 (sinh tự động từ file Excel backlog, đừng sửa tay).
 * Nguồn chuẩn là file VidratekLMS_Learner_Backlog_v0.1.xlsx. Khi BA cập nhật Excel, sinh lại file này.
 * Dùng để trang placeholder hiển thị checklist tính năng và để Claude Code bám đúng scope.
 */
export type MoSCoW = "Must" | "Should" | "Could" | "Won't";

export interface BacklogItem {
  id: string;
  screen: string;
  feature: string;
  description: string;
  moscow: MoSCoW;
  api: string;
  source: string;
  note: string;
}

export const screens = [
  {
    "key": "INT",
    "name": "0. Nền tảng tích hợp",
    "route": "-"
  },
  {
    "key": "AUTH",
    "name": "1. Đăng nhập",
    "route": "/login"
  },
  {
    "key": "SHELL",
    "name": "2. Khung ứng dụng",
    "route": "(layout)"
  },
  {
    "key": "DASH",
    "name": "3. Dashboard",
    "route": "/dashboard"
  },
  {
    "key": "COURSE",
    "name": "4. Khóa học của tôi",
    "route": "/courses"
  },
  {
    "key": "CDET",
    "name": "5. Chi tiết khóa học",
    "route": "/courses/[courseId]"
  },
  {
    "key": "LEARN",
    "name": "6. Màn học bài (Course player)",
    "route": "/learn/[courseId]/[cmId]"
  },
  {
    "key": "QUIZ",
    "name": "7. Làm bài kiểm tra (Quiz)",
    "route": "/quiz/[cmId]"
  },
  {
    "key": "TEST",
    "name": "8. Tests (tổng hợp bài kiểm tra)",
    "route": "/tests"
  },
  {
    "key": "GRADE",
    "name": "9. Grades (điểm)",
    "route": "/grades"
  },
  {
    "key": "CAL",
    "name": "10. Calendar",
    "route": "/calendar"
  },
  {
    "key": "NOTI",
    "name": "11. Notifications",
    "route": "/notifications"
  },
  {
    "key": "LP",
    "name": "12. Learning Path",
    "route": "/learning-path"
  },
  {
    "key": "CERT",
    "name": "13. Chứng nhận",
    "route": "/certificates"
  },
  {
    "key": "PROF",
    "name": "14. Profile",
    "route": "/profile"
  },
  {
    "key": "CAT",
    "name": "15. Khám phá khóa học (tùy chọn)",
    "route": "/catalog"
  }
] as const;

export const backlog = [
  {
    "id": "INT-01",
    "screen": "INT",
    "feature": "External service riêng cho NextJS",
    "description": "Tạo 1 External service riêng (không dùng chung Moodle mobile app), bật đúng các function trong sheet Moodle API. Cấp token theo user khi đăng nhập.",
    "moscow": "Must",
    "api": "Site administration > Server > Web services > External services",
    "source": "Core",
    "note": "Owner gợi ý: Đạt Trần. Duy và Đạt cùng tick cột 'Đã bật' ở sheet Moodle API."
  },
  {
    "id": "INT-02",
    "screen": "INT",
    "feature": "Đọc file nội dung kèm token",
    "description": "Ảnh khóa học, file PDF/PPTX, ảnh trong Page đều là link pluginfile.php. FE phải gắn token (webservice/pluginfile.php?token=...) hoặc đi qua proxy NextJS để hiển thị được.",
    "moscow": "Must",
    "api": "webservice/pluginfile.php (không phải WS function)",
    "source": "Core",
    "note": "Không để lộ token trên URL công khai. Đề xuất proxy qua NextJS server."
  },
  {
    "id": "INT-03",
    "screen": "INT",
    "feature": "Chuẩn hóa định nghĩa tiến độ và trạng thái khóa",
    "description": "Một nguồn tính duy nhất dùng cho mọi màn: progress = % activity đã hoàn thành (Moodle tính). Not started = progress 0. Ongoing = 0 < progress, chưa đạt course completion. Completed = đạt Course completion (không phải 100% activity).",
    "moscow": "Must",
    "api": "core_course_get_enrolled_courses_by_timeline_classification; core_completion_get_course_completion_status",
    "source": "Core",
    "note": "Điểm chưa chốt (BA chốt với Vi/Thiện). Hiện Dashboard và My Courses lệch số, card 33% vs chi tiết 31%."
  },
  {
    "id": "INT-04",
    "screen": "INT",
    "feature": "Render nội dung HTML từ Moodle",
    "description": "Mô tả khóa, Page, label, availabilityinfo đều trả HTML. Cần 1 component render HTML an toàn (sanitize) và hàm strip/decode cho chỗ chỉ hiện text.",
    "moscow": "Must",
    "api": "-",
    "source": "Custom FE",
    "note": "Hiện mô tả khóa 'Nền tảng Rejuran' lộ ký tự &amp;."
  },
  {
    "id": "AUTH-01",
    "screen": "AUTH",
    "feature": "Đăng nhập username/password",
    "description": "Form username + password, ẩn/hiện mật khẩu, báo lỗi khi sai, lưu token, quay về trang trước đó (param from).",
    "moscow": "Must",
    "api": "login/token.php (service ở INT-01); core_webservice_get_site_info",
    "source": "Core",
    "note": ""
  },
  {
    "id": "AUTH-02",
    "screen": "AUTH",
    "feature": "Đăng nhập bằng Google",
    "description": "Nút Sign in with Google, dùng chung OAuth2 issuer đã cấu hình trên Moodle, trả về token cho NextJS.",
    "moscow": "Should",
    "api": "auth_oauth2 (OAuth 2 services) + luồng đổi phiên sang token",
    "source": "Core + Custom",
    "note": "Cần Thiện chốt luồng kỹ thuật. Xác nhận VIGO có dùng Google Workspace không."
  },
  {
    "id": "AUTH-03",
    "screen": "AUTH",
    "feature": "Quên mật khẩu",
    "description": "Link Quên mật khẩu, nhập username hoặc email, Moodle gửi mail reset.",
    "moscow": "Should",
    "api": "core_auth_request_password_reset",
    "source": "Core",
    "note": "Hiện chỉ có 'Contact your instructor'."
  },
  {
    "id": "AUTH-04",
    "screen": "AUTH",
    "feature": "Đăng xuất và hết phiên",
    "description": "Sign out xóa token. Khi API trả lỗi token hết hạn/không hợp lệ thì đưa về trang đăng nhập.",
    "moscow": "Must",
    "api": "Xóa token phía client; bắt lỗi invalidtoken",
    "source": "Core",
    "note": ""
  },
  {
    "id": "AUTH-05",
    "screen": "AUTH",
    "feature": "Bắt đổi mật khẩu lần đầu",
    "description": "User tạo với 'Force password change' phải đổi mật khẩu trước khi học.",
    "moscow": "Should",
    "api": "Chưa có WS core cho việc tự đổi mật khẩu",
    "source": "Core + Custom",
    "note": "Kiểm trên sandbox Moodle trả gì khi user bị force change. Phương án: chuyển sang trang đổi mật khẩu của Moodle."
  },
  {
    "id": "SHELL-01",
    "screen": "SHELL",
    "feature": "Sidebar điều hướng",
    "description": "Menu: Dashboard, Courses, Learning Path, Tests, Grades, Calendar, Notifications; dưới cùng Profile, Sign out, Collapse. Highlight mục đang chọn.",
    "moscow": "Must",
    "api": "-",
    "source": "Custom FE",
    "note": "Ẩn menu chưa có nội dung (ví dụ Learning Path) cho tới khi chốt."
  },
  {
    "id": "SHELL-02",
    "screen": "SHELL",
    "feature": "Header: thông báo và tài khoản",
    "description": "Tiêu đề trang, chuông có badge số chưa đọc, avatar + họ tên + vai trò, dropdown tài khoản.",
    "moscow": "Must",
    "api": "core_webservice_get_site_info; message_popup_get_unread_popup_notification_count",
    "source": "Core",
    "note": "Tài khoản Admin đang hiển thị role 'Student'. Cần rule hiển thị (hoặc bỏ dòng role)."
  },
  {
    "id": "SHELL-03",
    "screen": "SHELL",
    "feature": "Responsive mobile",
    "description": "Sidebar thành drawer, layout 1 cột, player và quiz dùng được trên điện thoại.",
    "moscow": "Must",
    "api": "-",
    "source": "Custom FE",
    "note": "Nhân viên VIGO có thể học trên điện thoại."
  },
  {
    "id": "SHELL-04",
    "screen": "SHELL",
    "feature": "Trạng thái chung",
    "description": "Loading skeleton, empty state có hướng dẫn, lỗi mạng có nút thử lại, trang 403/404.",
    "moscow": "Must",
    "api": "-",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "SHELL-05",
    "screen": "SHELL",
    "feature": "Ngôn ngữ giao diện Việt/Anh",
    "description": "Chọn ngôn ngữ giao diện. Nội dung khóa giữ nguyên.",
    "moscow": "Could",
    "api": "core_user_get_users_by_field (lang)",
    "source": "Core",
    "note": "Điểm chưa chốt: VIGO cần UI tiếng Việt hay tiếng Anh. Hiện UI tiếng Anh, nội dung tiếng Việt."
  },
  {
    "id": "SHELL-06",
    "screen": "SHELL",
    "feature": "Tìm kiếm khóa học trên header",
    "description": "Ô tìm kiếm như Udemy, gợi ý theo tên khóa.",
    "moscow": "Could",
    "api": "core_course_search_courses",
    "source": "Core",
    "note": ""
  },
  {
    "id": "DASH-01",
    "screen": "DASH",
    "feature": "Lời chào và số khóa đang học",
    "description": "Hello {tên}, bạn có N khóa đang học, nút View courses.",
    "moscow": "Must",
    "api": "core_course_get_enrolled_courses_by_timeline_classification (inprogress)",
    "source": "Core",
    "note": ""
  },
  {
    "id": "DASH-02",
    "screen": "DASH",
    "feature": "Học tiếp (Continue learning)",
    "description": "Card khóa truy cập gần nhất: ảnh, tên, % tiến độ, tên bài kế tiếp, nút Học tiếp mở thẳng bài đó.",
    "moscow": "Must",
    "api": "core_course_get_recent_courses; core_course_get_contents; core_completion_get_activities_completion_status",
    "source": "Core",
    "note": "Moodle không trả 'bài mở gần nhất' qua WS. Đề xuất: mở bài đầu tiên chưa hoàn thành."
  },
  {
    "id": "DASH-03",
    "screen": "DASH",
    "feature": "Thống kê tiến độ",
    "description": "3 thẻ Ongoing / Completed / Not started trên tổng số khóa, có thanh tỉ lệ.",
    "moscow": "Must",
    "api": "core_course_get_enrolled_courses_by_timeline_classification",
    "source": "Core",
    "note": "Lệch số với My Courses (Dashboard 4/0/3, My Courses 4/1/2). Sửa theo INT-03."
  },
  {
    "id": "DASH-04",
    "screen": "DASH",
    "feature": "Banner thông báo chung",
    "description": "Carousel tin từ Site announcements: tiêu đề, ngày, trích đoạn, tag MỚI, bấm xem chi tiết.",
    "moscow": "Should",
    "api": "mod_forum_get_forums_by_courses (courseids=[1]); mod_forum_get_forum_discussions",
    "source": "Core",
    "note": ""
  },
  {
    "id": "DASH-05",
    "screen": "DASH",
    "feature": "Bài kiểm tra hôm nay và sắp tới",
    "description": "Danh sách quiz có hạn: tên, khóa, hạn, nút vào làm.",
    "moscow": "Should",
    "api": "core_calendar_get_action_events_by_timesort",
    "source": "Core",
    "note": "Chỉ có dữ liệu khi quiz được đặt ngày đóng (Close the quiz)."
  },
  {
    "id": "DASH-06",
    "screen": "DASH",
    "feature": "Lịch mini",
    "description": "Lịch tháng, chấm màu ngày có sự kiện, bấm ngày xem sự kiện.",
    "moscow": "Could",
    "api": "core_calendar_get_calendar_monthly_view",
    "source": "Core",
    "note": ""
  },
  {
    "id": "DASH-07",
    "screen": "DASH",
    "feature": "Biểu đồ điểm",
    "description": "Score comparison, Last 5 test growth.",
    "moscow": "Could",
    "api": "gradereport_overview_get_course_grades; mod_quiz_get_user_quiz_attempts",
    "source": "Core",
    "note": "Giá trị thấp ở MVP. Ẩn block khi chưa có dữ liệu."
  },
  {
    "id": "DASH-08",
    "screen": "DASH",
    "feature": "Weekly streak, nhắc lịch học",
    "description": "Chuỗi tuần học và lịch nhắc như Udemy.",
    "moscow": "Won't",
    "api": "-",
    "source": "Custom",
    "note": "Không làm giai đoạn này."
  },
  {
    "id": "COURSE-01",
    "screen": "COURSE",
    "feature": "Danh sách khóa dạng card",
    "description": "Card: ảnh khóa, tên, mô tả ngắn 2 dòng, % tiến độ + progress bar, badge trạng thái.",
    "moscow": "Must",
    "api": "core_course_get_enrolled_courses_by_timeline_classification (courseimage, summary, progress, isfavourite)",
    "source": "Core",
    "note": "Mô tả lộ &amp; (INT-04). Badge 'Ongoing' đè chữ trên ảnh card Hướng dẫn sử dụng."
  },
  {
    "id": "COURSE-02",
    "screen": "COURSE",
    "feature": "Nút hành động theo trạng thái",
    "description": "Start learning (chưa học), Continue learning (đang học), Review course (đã hoàn thành).",
    "moscow": "Must",
    "api": "Tính từ INT-03",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "COURSE-03",
    "screen": "COURSE",
    "feature": "Tab lọc theo trạng thái",
    "description": "All / Ongoing / Completed / Not started, có số đếm từng tab.",
    "moscow": "Must",
    "api": "core_course_get_enrolled_courses_by_timeline_classification",
    "source": "Core",
    "note": "Định nghĩa theo INT-03."
  },
  {
    "id": "COURSE-04",
    "screen": "COURSE",
    "feature": "Yêu thích khóa học",
    "description": "Icon tim trên card, tab Favourites.",
    "moscow": "Should",
    "api": "core_course_set_favourite_courses; classification=favourites",
    "source": "Core",
    "note": ""
  },
  {
    "id": "COURSE-05",
    "screen": "COURSE",
    "feature": "Tìm kiếm và sắp xếp",
    "description": "Tìm theo tên trong danh sách, sắp xếp theo truy cập gần nhất hoặc tên.",
    "moscow": "Should",
    "api": "Lọc phía client trên dữ liệu COURSE-01",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "COURSE-06",
    "screen": "COURSE",
    "feature": "Thời lượng và số bài trên card",
    "description": "Hiển thị số bài và tổng thời lượng khóa.",
    "moscow": "Should",
    "api": "core_course_get_contents (đếm); core_course_get_courses_by_field (customfields)",
    "source": "Core",
    "note": "Thời lượng cần thêm Course custom field 'duration' hoặc lấy từ thời lượng video (INT/LEARN-02)."
  },
  {
    "id": "COURSE-07",
    "screen": "COURSE",
    "feature": "Ẩn khóa (Archived)",
    "description": "Ẩn khóa khỏi danh sách chính, xem lại ở tab Archived.",
    "moscow": "Could",
    "api": "classification=hidden; core_user_update_user_preferences",
    "source": "Core",
    "note": "Kiểm tên preference ẩn khóa trên bản 5.1."
  },
  {
    "id": "CDET-01",
    "screen": "CDET",
    "feature": "Header khóa học",
    "description": "Tên, mô tả, banner, % tiến độ, nút Bắt đầu / Học tiếp.",
    "moscow": "Must",
    "api": "core_course_get_courses_by_field; progress theo INT-03",
    "source": "Core",
    "note": "% lệch giữa card (33%) và chi tiết (31%)."
  },
  {
    "id": "CDET-02",
    "screen": "CDET",
    "feature": "Số liệu khóa",
    "description": "Tổng activity, đã hoàn thành, số quiz.",
    "moscow": "Should",
    "api": "core_course_get_contents; core_completion_get_activities_completion_status",
    "source": "Core",
    "note": ""
  },
  {
    "id": "CDET-03",
    "screen": "CDET",
    "feature": "Outline section và bài học",
    "description": "Danh sách section mở/thu gọn, mỗi section có số item, tiến độ x/y. Mỗi item: icon loại, tên, thời lượng, trạng thái hoàn thành.",
    "moscow": "Must",
    "api": "core_course_get_contents (sections, modules, completiondata)",
    "source": "Core",
    "note": ""
  },
  {
    "id": "CDET-04",
    "screen": "CDET",
    "feature": "Bài/section bị khóa (Restrict access)",
    "description": "Item chưa đủ điều kiện hiển thị ổ khóa và lý do, ví dụ cần đạt 8/10 bài kiểm tra phần trước.",
    "moscow": "Must",
    "api": "core_course_get_contents (uservisible, availabilityinfo)",
    "source": "Core",
    "note": "Cốt lõi cho rule pass section của VIGO. availabilityinfo là HTML."
  },
  {
    "id": "CDET-05",
    "screen": "CDET",
    "feature": "Ẩn item không dành cho người học",
    "description": "Không hiện Question bank (qbank) như 1 bài học. Text and media area (label) hiển thị nội dung inline thay vì 1 item 'label'.",
    "moscow": "Must",
    "api": "core_course_get_contents (modname)",
    "source": "Core",
    "note": "Hiện đang hiện 'Ngân hàng câu hỏi... qbank' và item kiểu 'label', 'glossary' trong outline."
  },
  {
    "id": "CDET-06",
    "screen": "CDET",
    "feature": "Điều kiện hoàn thành khóa",
    "description": "Hiển thị tiêu chí hoàn thành (ví dụ đạt bài kiểm tra cuối, gửi đánh giá) và trạng thái từng tiêu chí.",
    "moscow": "Should",
    "api": "core_completion_get_course_completion_status",
    "source": "Core",
    "note": ""
  },
  {
    "id": "CDET-07",
    "screen": "CDET",
    "feature": "Panel Outline bên phải",
    "description": "Mục lục section dính bên phải, bấm nhảy tới section.",
    "moscow": "Could",
    "api": "Dùng lại dữ liệu CDET-03",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "CDET-08",
    "screen": "CDET",
    "feature": "Thông báo và hỏi đáp của khóa",
    "description": "Xem bài trong forum Thông báo khóa học và Hỏi đáp.",
    "moscow": "Should",
    "api": "mod_forum_get_forums_by_courses; mod_forum_get_forum_discussions; mod_forum_get_discussion_posts",
    "source": "Core",
    "note": "Hiện forum đang hiện như 1 bài học trong outline. Cân nhắc tách thành tab."
  },
  {
    "id": "LEARN-01",
    "screen": "LEARN",
    "feature": "Layout player",
    "description": "Vùng nội dung chính, sidebar Course content (mở/thu gọn), tiêu đề khóa, nút quay lại. Tham chiếu màn học của Udemy.",
    "moscow": "Must",
    "api": "-",
    "source": "Custom FE",
    "note": "Hiện trang bài học dùng sidebar menu app, chưa có sidebar Course content."
  },
  {
    "id": "LEARN-02",
    "screen": "LEARN",
    "feature": "Video từ link Google Drive",
    "description": "Phát video nhúng từ link Drive, hiển thị thời lượng.",
    "moscow": "Must",
    "api": "Custom của Đạt Trần + core_course_get_contents",
    "source": "Custom",
    "note": "Điểm chưa chốt: cách tính hoàn thành (Moodle không biết đã xem bao nhiêu %) và quyền share link Drive."
  },
  {
    "id": "LEARN-03",
    "screen": "LEARN",
    "feature": "Hiển thị Page",
    "description": "Render nội dung HTML của Page.",
    "moscow": "Must",
    "api": "mod_page_get_pages_by_courses; mod_page_view_page",
    "source": "Core",
    "note": ""
  },
  {
    "id": "LEARN-04",
    "screen": "LEARN",
    "feature": "Hiển thị File",
    "description": "PDF xem trực tiếp. PPTX/DOCX: nút tải về.",
    "moscow": "Must",
    "api": "mod_resource_get_resources_by_courses; mod_resource_view_resource; fileurl + token (INT-02)",
    "source": "Core",
    "note": "Trình duyệt không xem trực tiếp PPTX. Đề xuất VIGO đăng bản PDF như file mẫu RJR."
  },
  {
    "id": "LEARN-05",
    "screen": "LEARN",
    "feature": "Hiển thị URL",
    "description": "Mở link ngoài ở tab mới hoặc nhúng nếu cho phép.",
    "moscow": "Must",
    "api": "mod_url_get_urls_by_courses; mod_url_view_url",
    "source": "Core",
    "note": ""
  },
  {
    "id": "LEARN-06",
    "screen": "LEARN",
    "feature": "Text and media area (label)",
    "description": "Hiển thị inline trong outline và màn bài học.",
    "moscow": "Should",
    "api": "mod_label_get_labels_by_courses hoặc core_course_get_contents (description)",
    "source": "Core",
    "note": ""
  },
  {
    "id": "LEARN-07",
    "screen": "LEARN",
    "feature": "Folder và Book",
    "description": "Folder: danh sách file tải về. Book: mục lục chương và nội dung.",
    "moscow": "Could",
    "api": "mod_folder_get_folders_by_courses; mod_book_get_books_by_courses; mod_book_view_book",
    "source": "Core",
    "note": ""
  },
  {
    "id": "LEARN-08",
    "screen": "LEARN",
    "feature": "Activity chưa hỗ trợ trên NextJS",
    "description": "Assignment, H5P, Feedback... hiển thị card 'Mở trên LMS' và chuyển sang Moodle, không bắt đăng nhập lại.",
    "moscow": "Should",
    "api": "core_course_get_contents (url); tool_mobile_get_autologin_key",
    "source": "Core",
    "note": "Điểm chưa chốt: phạm vi NextJS vs Moodle."
  },
  {
    "id": "LEARN-09",
    "screen": "LEARN",
    "feature": "Đánh dấu hoàn thành",
    "description": "Nút Mark as done với activity hoàn thành thủ công. Tick tự động với activity hoàn thành theo điều kiện.",
    "moscow": "Must",
    "api": "core_completion_update_activity_completion_status_manually; core_completion_get_activities_completion_status",
    "source": "Core",
    "note": "Đang có ở Moodle, chưa có trên NextJS."
  },
  {
    "id": "LEARN-10",
    "screen": "LEARN",
    "feature": "Ghi nhận đã xem",
    "description": "Khi mở bài, gọi API view để Moodle ghi log và tính completion 'View'.",
    "moscow": "Must",
    "api": "mod_page_view_page; mod_resource_view_resource; mod_url_view_url; mod_quiz_view_quiz...",
    "source": "Core",
    "note": "Không gọi thì completion 'View' không bao giờ đạt, kéo theo restrict access và course completion sai."
  },
  {
    "id": "LEARN-11",
    "screen": "LEARN",
    "feature": "Previous / Next",
    "description": "Chuyển bài trước/sau theo thứ tự outline, bỏ qua bài bị khóa hoặc ẩn.",
    "moscow": "Must",
    "api": "Tính từ core_course_get_contents",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "LEARN-12",
    "screen": "LEARN",
    "feature": "Sidebar Course content",
    "description": "Section, checkbox hoàn thành, thời lượng, bài đang học được highlight, x/y mỗi section.",
    "moscow": "Must",
    "api": "core_course_get_contents; core_completion_get_activities_completion_status",
    "source": "Core",
    "note": ""
  },
  {
    "id": "LEARN-13",
    "screen": "LEARN",
    "feature": "Tab Overview của bài",
    "description": "Mô tả bài học, mục tiêu.",
    "moscow": "Should",
    "api": "core_course_get_contents (description)",
    "source": "Core",
    "note": ""
  },
  {
    "id": "LEARN-14",
    "screen": "LEARN",
    "feature": "Tài liệu đính kèm của bài",
    "description": "Dropdown Resources như Udemy: file đi kèm video/bài.",
    "moscow": "Should",
    "api": "core_course_get_contents (contents)",
    "source": "Core",
    "note": "Cần chốt cách gắn tài liệu cho 1 bài video (activity File riêng cùng section hay đính trong mô tả)."
  },
  {
    "id": "LEARN-15",
    "screen": "LEARN",
    "feature": "Breadcrumb",
    "description": "Courses / Tên khóa / Tên bài.",
    "moscow": "Should",
    "api": "-",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "LEARN-16",
    "screen": "LEARN",
    "feature": "Tab Hỏi đáp (Q&A)",
    "description": "Đặt câu hỏi và xem trả lời ngay trong màn học.",
    "moscow": "Could",
    "api": "mod_forum_add_discussion; mod_forum_get_forum_discussions",
    "source": "Core",
    "note": "Dùng forum Hỏi đáp của khóa."
  },
  {
    "id": "LEARN-17",
    "screen": "LEARN",
    "feature": "Ghi chú theo mốc video (Notes)",
    "description": "Như tab Notes của Udemy.",
    "moscow": "Won't",
    "api": "-",
    "source": "Custom",
    "note": "Moodle không có, video Drive không lấy được timestamp."
  },
  {
    "id": "LEARN-18",
    "screen": "LEARN",
    "feature": "AI Assistant",
    "description": "Giải thích bài/câu hỏi như Udemy.",
    "moscow": "Won't",
    "api": "-",
    "source": "Custom",
    "note": "Phase sau, gắn với quyết định công cụ AI hỏi đáp."
  },
  {
    "id": "QUIZ-01",
    "screen": "QUIZ",
    "feature": "Trang giới thiệu quiz",
    "description": "Số câu, thời gian, số lần được làm, điểm đạt, lịch sử các lần làm và điểm cao nhất, nút Bắt đầu / Làm tiếp / Làm lại.",
    "moscow": "Must",
    "api": "mod_quiz_get_quizzes_by_courses; mod_quiz_get_quiz_access_information; mod_quiz_get_user_quiz_attempts; mod_quiz_get_user_best_grade; mod_quiz_view_quiz",
    "source": "Core",
    "note": "mod_quiz_get_user_quiz_attempts thay cho mod_quiz_get_user_attempts ở bản mới, kiểm lại trên 5.1."
  },
  {
    "id": "QUIZ-02",
    "screen": "QUIZ",
    "feature": "Làm bài: chọn một, chọn nhiều, đúng/sai",
    "description": "Hiển thị câu hỏi theo trang, chọn đáp án, điều hướng giữa các câu, tự lưu.",
    "moscow": "Must",
    "api": "mod_quiz_start_attempt; mod_quiz_get_attempt_data; mod_quiz_save_attempt",
    "source": "Core",
    "note": "Moodle trả câu hỏi dạng HTML render sẵn. Duy và Đạt Trần chốt: parse HTML hay BE viết API trả JSON."
  },
  {
    "id": "QUIZ-03",
    "screen": "QUIZ",
    "feature": "Đồng hồ đếm ngược",
    "description": "Hiện thời gian còn lại nếu quiz có time limit, tự nộp khi hết giờ.",
    "moscow": "Should",
    "api": "mod_quiz_get_attempt_access_information; mod_quiz_get_attempt_data",
    "source": "Core",
    "note": ""
  },
  {
    "id": "QUIZ-04",
    "screen": "QUIZ",
    "feature": "Nộp bài có xác nhận",
    "description": "Màn tóm tắt câu đã/chưa trả lời, xác nhận nộp.",
    "moscow": "Must",
    "api": "mod_quiz_get_attempt_summary; mod_quiz_process_attempt (finishattempt=1)",
    "source": "Core",
    "note": ""
  },
  {
    "id": "QUIZ-05",
    "screen": "QUIZ",
    "feature": "Kết quả và xem lại",
    "description": "Điểm, Đạt/Chưa đạt theo grade to pass, đúng/sai từng câu, đáp án đúng và giải thích (tùy Review options).",
    "moscow": "Must",
    "api": "mod_quiz_get_attempt_review; mod_quiz_get_quiz_feedback_for_grade",
    "source": "Core",
    "note": ""
  },
  {
    "id": "QUIZ-06",
    "screen": "QUIZ",
    "feature": "Mở khóa phần tiếp theo sau khi đạt",
    "description": "Nộp xong, nếu đạt thì outline cập nhật ngay, bài/section tiếp theo mở khóa.",
    "moscow": "Must",
    "api": "Gọi lại core_course_get_contents sau khi nộp",
    "source": "Core",
    "note": "Phụ thuộc rule pass (điểm chưa chốt)."
  },
  {
    "id": "QUIZ-07",
    "screen": "QUIZ",
    "feature": "Phản hồi ngay từng câu",
    "description": "Chọn xong biết đúng/sai và được thử lại như Udemy.",
    "moscow": "Could",
    "api": "mod_quiz_process_attempt theo từng trang",
    "source": "Core",
    "note": "Phụ thuộc Question behaviour (Immediate feedback / Interactive with multiple tries). Chốt với VIGO."
  },
  {
    "id": "QUIZ-08",
    "screen": "QUIZ",
    "feature": "Gợi ý bài cần ôn lại",
    "description": "Câu sai liên kết về bài học liên quan (What you should review).",
    "moscow": "Could",
    "api": "-",
    "source": "Custom",
    "note": "Moodle không map sẵn câu hỏi với bài học. Có thể dùng tag câu hỏi."
  },
  {
    "id": "TEST-01",
    "screen": "TEST",
    "feature": "Danh sách bài kiểm tra",
    "description": "Quiz của mọi khóa đã ghi danh: tên, khóa, hạn, số lần đã làm, điểm cao nhất, trạng thái (Chưa làm / Đang làm / Đạt / Chưa đạt).",
    "moscow": "Should",
    "api": "mod_quiz_get_quizzes_by_courses; mod_quiz_get_user_best_grade; mod_quiz_get_user_quiz_attempts",
    "source": "Core",
    "note": ""
  },
  {
    "id": "TEST-02",
    "screen": "TEST",
    "feature": "Lọc theo trạng thái và khóa",
    "description": "Filter trạng thái, chọn khóa.",
    "moscow": "Should",
    "api": "Lọc phía client",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "TEST-03",
    "screen": "TEST",
    "feature": "Vào làm bài",
    "description": "Bấm 1 dòng mở trang giới thiệu quiz (QUIZ-01).",
    "moscow": "Should",
    "api": "-",
    "source": "Custom FE",
    "note": ""
  },
  {
    "id": "GRADE-01",
    "screen": "GRADE",
    "feature": "Tổng quan điểm theo khóa",
    "description": "Mỗi khóa: điểm tổng, % và trạng thái đạt.",
    "moscow": "Should",
    "api": "gradereport_overview_get_course_grades",
    "source": "Core",
    "note": ""
  },
  {
    "id": "GRADE-02",
    "screen": "GRADE",
    "feature": "Chi tiết điểm từng khóa",
    "description": "Từng quiz: điểm, điểm đạt, phản hồi.",
    "moscow": "Should",
    "api": "gradereport_user_get_grade_items",
    "source": "Core",
    "note": ""
  },
  {
    "id": "CAL-01",
    "screen": "CAL",
    "feature": "Lịch tháng",
    "description": "Sự kiện site (lịch đào tạo), hạn quiz, sự kiện khóa.",
    "moscow": "Should",
    "api": "core_calendar_get_calendar_monthly_view",
    "source": "Core",
    "note": ""
  },
  {
    "id": "CAL-02",
    "screen": "CAL",
    "feature": "Sự kiện theo ngày và chi tiết",
    "description": "Danh sách sự kiện của ngày, xem chi tiết.",
    "moscow": "Should",
    "api": "core_calendar_get_calendar_day_view; core_calendar_get_calendar_event_by_id",
    "source": "Core",
    "note": ""
  },
  {
    "id": "CAL-03",
    "screen": "CAL",
    "feature": "Sự kiện sắp tới",
    "description": "List các sự kiện gần nhất.",
    "moscow": "Could",
    "api": "core_calendar_get_calendar_upcoming_view",
    "source": "Core",
    "note": ""
  },
  {
    "id": "NOTI-01",
    "screen": "NOTI",
    "feature": "Danh sách thông báo",
    "description": "Mới nhất trước, phân biệt đã đọc/chưa đọc.",
    "moscow": "Should",
    "api": "message_popup_get_popup_notifications",
    "source": "Core",
    "note": ""
  },
  {
    "id": "NOTI-02",
    "screen": "NOTI",
    "feature": "Đánh dấu đã đọc",
    "description": "Đọc từng cái và đọc tất cả.",
    "moscow": "Should",
    "api": "core_message_mark_notification_read; core_message_mark_all_notifications_as_read",
    "source": "Core",
    "note": ""
  },
  {
    "id": "NOTI-03",
    "screen": "NOTI",
    "feature": "Bấm thông báo đi đúng trang",
    "description": "Mở đúng khóa/bài trên NextJS thay vì link Moodle.",
    "moscow": "Should",
    "api": "contexturl trong notification",
    "source": "Custom FE",
    "note": "Cần bảng map URL Moodle sang route NextJS."
  },
  {
    "id": "NOTI-04",
    "screen": "NOTI",
    "feature": "Badge số chưa đọc",
    "description": "Trên chuông header, cập nhật định kỳ.",
    "moscow": "Must",
    "api": "message_popup_get_unread_popup_notification_count",
    "source": "Core",
    "note": ""
  },
  {
    "id": "LP-01",
    "screen": "LP",
    "feature": "Định nghĩa Learning Path",
    "description": "Lộ trình gồm nhiều khóa theo thứ tự, ví dụ Training New Employees: Overview Brand > Foundational Knowledge > Brands > Integrated. Có % tiến độ lộ trình, khóa sau mở khi xong khóa trước.",
    "moscow": "Should",
    "api": "Moodle core không có",
    "source": "Cần chốt",
    "note": "Điểm chưa chốt. 3 hướng: (1) Category + Course completion điều kiện khóa trước (core), (2) Learning plans của Competencies (core), (3) custom. BA đề xuất sau khi hiểu admin."
  },
  {
    "id": "LP-02",
    "screen": "LP",
    "feature": "Trang lộ trình",
    "description": "Các bước, trạng thái từng khóa, % lộ trình, nút học tiếp.",
    "moscow": "Should",
    "api": "Theo phương án LP-01",
    "source": "Cần chốt",
    "note": "Làm sau LP-01."
  },
  {
    "id": "CERT-01",
    "screen": "CERT",
    "feature": "Danh sách chứng nhận đã đạt",
    "description": "Tên khóa, ngày cấp, tải PDF.",
    "moscow": "Should",
    "api": "Phụ thuộc plugin chứng nhận",
    "source": "Plugin",
    "note": "Điểm chưa chốt: plugin nào (Custom certificate / Certificate), mẫu do ai cung cấp."
  },
  {
    "id": "CERT-02",
    "screen": "CERT",
    "feature": "Báo nhận chứng nhận",
    "description": "Khi hoàn thành khóa hiện thông báo và link tải.",
    "moscow": "Could",
    "api": "message_popup_get_popup_notifications + plugin",
    "source": "Plugin",
    "note": ""
  },
  {
    "id": "PROF-01",
    "screen": "PROF",
    "feature": "Thông tin cá nhân",
    "description": "Họ tên, email, phòng ban, ảnh đại diện.",
    "moscow": "Should",
    "api": "core_user_get_users_by_field",
    "source": "Core",
    "note": "Phòng ban lấy từ field Department hay cohort, chốt cùng S6."
  },
  {
    "id": "PROF-02",
    "screen": "PROF",
    "feature": "Đổi ảnh đại diện",
    "description": "Upload ảnh mới.",
    "moscow": "Could",
    "api": "core_files_upload (draft) + core_user_update_picture",
    "source": "Core",
    "note": ""
  },
  {
    "id": "PROF-03",
    "screen": "PROF",
    "feature": "Đổi mật khẩu",
    "description": "Đổi mật khẩu với tài khoản đăng nhập thường.",
    "moscow": "Should",
    "api": "Chưa có WS core",
    "source": "Core + Custom",
    "note": "Phương án: link sang trang đổi mật khẩu của Moodle. Liên quan AUTH-05."
  },
  {
    "id": "CAT-01",
    "screen": "CAT",
    "feature": "Duyệt khóa theo danh mục",
    "description": "Danh mục theo Category (Foundational, Brands, Integrated), card khóa.",
    "moscow": "Could",
    "api": "core_course_get_categories; core_course_get_courses_by_field",
    "source": "Core",
    "note": "Chỉ cần nếu cho tự ghi danh. Nếu ghi danh theo phòng ban (cohort) thì có thể bỏ."
  },
  {
    "id": "CAT-02",
    "screen": "CAT",
    "feature": "Tự ghi danh",
    "description": "Nút Ghi danh ở trang khóa.",
    "moscow": "Could",
    "api": "core_enrol_get_course_enrolment_methods; enrol_self_enrol_user",
    "source": "Core",
    "note": "Phụ thuộc quyết định phân quyền phòng ban."
  }
] as BacklogItem[];

export function backlogFor(screen: string) {
  return backlog.filter((b) => b.screen === screen);
}
