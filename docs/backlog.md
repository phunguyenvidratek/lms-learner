# Learner Portal Backlog v0.1

Bản text của file Excel backlog để Claude Code đọc. Nguồn chuẩn là file Excel, Status theo dõi ở đó.

MoSCoW: Must = cần cho pilot VIGO, Should = nên có ở pilot, Could = làm sau, Won't = không làm giai đoạn này.

## 0. Nền tảng tích hợp  (`-`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| INT-01 | External service riêng cho NextJS | Must | Tạo 1 External service riêng (không dùng chung Moodle mobile app), bật đúng các function trong sheet Moodle API. Cấp token theo user khi đăng nhập. | Site administration > Server > Web services > External services | Owner gợi ý: Đạt Trần. Duy và Đạt cùng tick cột 'Đã bật' ở sheet Moodle API. |
| INT-02 | Đọc file nội dung kèm token | Must | Ảnh khóa học, file PDF/PPTX, ảnh trong Page đều là link pluginfile.php. FE phải gắn token (webservice/pluginfile.php?token=...) hoặc đi qua proxy NextJS để hiển thị được. | webservice/pluginfile.php (không phải WS function) | Không để lộ token trên URL công khai. Đề xuất proxy qua NextJS server. |
| INT-03 | Chuẩn hóa định nghĩa tiến độ và trạng thái khóa | Must | Một nguồn tính duy nhất dùng cho mọi màn: progress = % activity đã hoàn thành (Moodle tính). Not started = progress 0. Ongoing = 0 < progress, chưa đạt course completion. Completed = đạt Course completion (không phải 100% activity). | core_course_get_enrolled_courses_by_timeline_classification; core_completion_get_course_completion_status | Điểm chưa chốt (BA chốt với Vi/Thiện). Hiện Dashboard và My Courses lệch số, card 33% vs chi tiết 31%. |
| INT-04 | Render nội dung HTML từ Moodle | Must | Mô tả khóa, Page, label, availabilityinfo đều trả HTML. Cần 1 component render HTML an toàn (sanitize) và hàm strip/decode cho chỗ chỉ hiện text. | - | Hiện mô tả khóa 'Nền tảng Rejuran' lộ ký tự &amp;. |

## 1. Đăng nhập  (`/login`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| AUTH-01 | Đăng nhập username/password | Must | Form username + password, ẩn/hiện mật khẩu, báo lỗi khi sai, lưu token, quay về trang trước đó (param from). | login/token.php (service ở INT-01); core_webservice_get_site_info |  |
| AUTH-02 | Đăng nhập bằng Google | Should | Nút Sign in with Google, dùng chung OAuth2 issuer đã cấu hình trên Moodle, trả về token cho NextJS. | auth_oauth2 (OAuth 2 services) + luồng đổi phiên sang token | Cần Thiện chốt luồng kỹ thuật. Xác nhận VIGO có dùng Google Workspace không. |
| AUTH-03 | Quên mật khẩu | Should | Link Quên mật khẩu, nhập username hoặc email, Moodle gửi mail reset. | core_auth_request_password_reset | Hiện chỉ có 'Contact your instructor'. |
| AUTH-04 | Đăng xuất và hết phiên | Must | Sign out xóa token. Khi API trả lỗi token hết hạn/không hợp lệ thì đưa về trang đăng nhập. | Xóa token phía client; bắt lỗi invalidtoken |  |
| AUTH-05 | Bắt đổi mật khẩu lần đầu | Should | User tạo với 'Force password change' phải đổi mật khẩu trước khi học. | Chưa có WS core cho việc tự đổi mật khẩu | Kiểm trên sandbox Moodle trả gì khi user bị force change. Phương án: chuyển sang trang đổi mật khẩu của Moodle. |

## 2. Khung ứng dụng  (`(layout)`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| SHELL-01 | Sidebar điều hướng | Must | Menu: Dashboard, Courses, Learning Path, Tests, Grades, Calendar, Notifications; dưới cùng Profile, Sign out, Collapse. Highlight mục đang chọn. | - | Ẩn menu chưa có nội dung (ví dụ Learning Path) cho tới khi chốt. |
| SHELL-02 | Header: thông báo và tài khoản | Must | Tiêu đề trang, chuông có badge số chưa đọc, avatar + họ tên + vai trò, dropdown tài khoản. | core_webservice_get_site_info; message_popup_get_unread_popup_notification_count | Tài khoản Admin đang hiển thị role 'Student'. Cần rule hiển thị (hoặc bỏ dòng role). |
| SHELL-03 | Responsive mobile | Must | Sidebar thành drawer, layout 1 cột, player và quiz dùng được trên điện thoại. | - | Nhân viên VIGO có thể học trên điện thoại. |
| SHELL-04 | Trạng thái chung | Must | Loading skeleton, empty state có hướng dẫn, lỗi mạng có nút thử lại, trang 403/404. | - |  |
| SHELL-05 | Ngôn ngữ giao diện Việt/Anh | Could | Chọn ngôn ngữ giao diện. Nội dung khóa giữ nguyên. | core_user_get_users_by_field (lang) | Điểm chưa chốt: VIGO cần UI tiếng Việt hay tiếng Anh. Hiện UI tiếng Anh, nội dung tiếng Việt. |
| SHELL-06 | Tìm kiếm khóa học trên header | Could | Ô tìm kiếm như Udemy, gợi ý theo tên khóa. | core_course_search_courses |  |

## 3. Dashboard  (`/dashboard`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| DASH-01 | Lời chào và số khóa đang học | Must | Hello {tên}, bạn có N khóa đang học, nút View courses. | core_course_get_enrolled_courses_by_timeline_classification (inprogress) |  |
| DASH-02 | Học tiếp (Continue learning) | Must | Card khóa truy cập gần nhất: ảnh, tên, % tiến độ, tên bài kế tiếp, nút Học tiếp mở thẳng bài đó. | core_course_get_recent_courses; core_course_get_contents; core_completion_get_activities_completion_status | Moodle không trả 'bài mở gần nhất' qua WS. Đề xuất: mở bài đầu tiên chưa hoàn thành. |
| DASH-03 | Thống kê tiến độ | Must | 3 thẻ Ongoing / Completed / Not started trên tổng số khóa, có thanh tỉ lệ. | core_course_get_enrolled_courses_by_timeline_classification | Lệch số với My Courses (Dashboard 4/0/3, My Courses 4/1/2). Sửa theo INT-03. |
| DASH-04 | Banner thông báo chung | Should | Carousel tin từ Site announcements: tiêu đề, ngày, trích đoạn, tag MỚI, bấm xem chi tiết. | mod_forum_get_forums_by_courses (courseids=[1]); mod_forum_get_forum_discussions |  |
| DASH-05 | Bài kiểm tra hôm nay và sắp tới | Should | Danh sách quiz có hạn: tên, khóa, hạn, nút vào làm. | core_calendar_get_action_events_by_timesort | Chỉ có dữ liệu khi quiz được đặt ngày đóng (Close the quiz). |
| DASH-06 | Lịch mini | Could | Lịch tháng, chấm màu ngày có sự kiện, bấm ngày xem sự kiện. | core_calendar_get_calendar_monthly_view |  |
| DASH-07 | Biểu đồ điểm | Could | Score comparison, Last 5 test growth. | gradereport_overview_get_course_grades; mod_quiz_get_user_quiz_attempts | Giá trị thấp ở MVP. Ẩn block khi chưa có dữ liệu. |
| DASH-08 | Weekly streak, nhắc lịch học | Won't | Chuỗi tuần học và lịch nhắc như Udemy. | - | Không làm giai đoạn này. |

## 4. Khóa học của tôi  (`/courses`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| COURSE-01 | Danh sách khóa dạng card | Must | Card: ảnh khóa, tên, mô tả ngắn 2 dòng, % tiến độ + progress bar, badge trạng thái. | core_course_get_enrolled_courses_by_timeline_classification (courseimage, summary, progress, isfavourite) | Mô tả lộ &amp; (INT-04). Badge 'Ongoing' đè chữ trên ảnh card Hướng dẫn sử dụng. |
| COURSE-02 | Nút hành động theo trạng thái | Must | Start learning (chưa học), Continue learning (đang học), Review course (đã hoàn thành). | Tính từ INT-03 |  |
| COURSE-03 | Tab lọc theo trạng thái | Must | All / Ongoing / Completed / Not started, có số đếm từng tab. | core_course_get_enrolled_courses_by_timeline_classification | Định nghĩa theo INT-03. |
| COURSE-04 | Yêu thích khóa học | Should | Icon tim trên card, tab Favourites. | core_course_set_favourite_courses; classification=favourites |  |
| COURSE-05 | Tìm kiếm và sắp xếp | Should | Tìm theo tên trong danh sách, sắp xếp theo truy cập gần nhất hoặc tên. | Lọc phía client trên dữ liệu COURSE-01 |  |
| COURSE-06 | Thời lượng và số bài trên card | Should | Hiển thị số bài và tổng thời lượng khóa. | core_course_get_contents (đếm); core_course_get_courses_by_field (customfields) | Thời lượng cần thêm Course custom field 'duration' hoặc lấy từ thời lượng video (INT/LEARN-02). |
| COURSE-07 | Ẩn khóa (Archived) | Could | Ẩn khóa khỏi danh sách chính, xem lại ở tab Archived. | classification=hidden; core_user_update_user_preferences | Kiểm tên preference ẩn khóa trên bản 5.1. |

## 5. Chi tiết khóa học  (`/courses/[courseId]`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| CDET-01 | Header khóa học | Must | Tên, mô tả, banner, % tiến độ, nút Bắt đầu / Học tiếp. | core_course_get_courses_by_field; progress theo INT-03 | % lệch giữa card (33%) và chi tiết (31%). |
| CDET-02 | Số liệu khóa | Should | Tổng activity, đã hoàn thành, số quiz. | core_course_get_contents; core_completion_get_activities_completion_status |  |
| CDET-03 | Outline section và bài học | Must | Danh sách section mở/thu gọn, mỗi section có số item, tiến độ x/y. Mỗi item: icon loại, tên, thời lượng, trạng thái hoàn thành. | core_course_get_contents (sections, modules, completiondata) |  |
| CDET-04 | Bài/section bị khóa (Restrict access) | Must | Item chưa đủ điều kiện hiển thị ổ khóa và lý do, ví dụ cần đạt 8/10 bài kiểm tra phần trước. | core_course_get_contents (uservisible, availabilityinfo) | Cốt lõi cho rule pass section của VIGO. availabilityinfo là HTML. |
| CDET-05 | Ẩn item không dành cho người học | Must | Không hiện Question bank (qbank) như 1 bài học. Text and media area (label) hiển thị nội dung inline thay vì 1 item 'label'. | core_course_get_contents (modname) | Hiện đang hiện 'Ngân hàng câu hỏi... qbank' và item kiểu 'label', 'glossary' trong outline. |
| CDET-06 | Điều kiện hoàn thành khóa | Should | Hiển thị tiêu chí hoàn thành (ví dụ đạt bài kiểm tra cuối, gửi đánh giá) và trạng thái từng tiêu chí. | core_completion_get_course_completion_status |  |
| CDET-07 | Panel Outline bên phải | Could | Mục lục section dính bên phải, bấm nhảy tới section. | Dùng lại dữ liệu CDET-03 |  |
| CDET-08 | Thông báo và hỏi đáp của khóa | Should | Xem bài trong forum Thông báo khóa học và Hỏi đáp. | mod_forum_get_forums_by_courses; mod_forum_get_forum_discussions; mod_forum_get_discussion_posts | Hiện forum đang hiện như 1 bài học trong outline. Cân nhắc tách thành tab. |

## 6. Màn học bài (Course player)  (`/learn/[courseId]/[cmId]`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| LEARN-01 | Layout player | Must | Vùng nội dung chính, sidebar Course content (mở/thu gọn), tiêu đề khóa, nút quay lại. Tham chiếu màn học của Udemy. | - | Hiện trang bài học dùng sidebar menu app, chưa có sidebar Course content. |
| LEARN-02 | Video từ link Google Drive | Must | Phát video nhúng từ link Drive, hiển thị thời lượng. | Custom của Đạt Trần + core_course_get_contents | Điểm chưa chốt: cách tính hoàn thành (Moodle không biết đã xem bao nhiêu %) và quyền share link Drive. |
| LEARN-03 | Hiển thị Page | Must | Render nội dung HTML của Page. | mod_page_get_pages_by_courses; mod_page_view_page |  |
| LEARN-04 | Hiển thị File | Must | PDF xem trực tiếp. PPTX/DOCX: nút tải về. | mod_resource_get_resources_by_courses; mod_resource_view_resource; fileurl + token (INT-02) | Trình duyệt không xem trực tiếp PPTX. Đề xuất VIGO đăng bản PDF như file mẫu RJR. |
| LEARN-05 | Hiển thị URL | Must | Mở link ngoài ở tab mới hoặc nhúng nếu cho phép. | mod_url_get_urls_by_courses; mod_url_view_url |  |
| LEARN-06 | Text and media area (label) | Should | Hiển thị inline trong outline và màn bài học. | mod_label_get_labels_by_courses hoặc core_course_get_contents (description) |  |
| LEARN-07 | Folder và Book | Could | Folder: danh sách file tải về. Book: mục lục chương và nội dung. | mod_folder_get_folders_by_courses; mod_book_get_books_by_courses; mod_book_view_book |  |
| LEARN-08 | Activity chưa hỗ trợ trên NextJS | Should | Assignment, H5P, Feedback... hiển thị card 'Mở trên LMS' và chuyển sang Moodle, không bắt đăng nhập lại. | core_course_get_contents (url); tool_mobile_get_autologin_key | Điểm chưa chốt: phạm vi NextJS vs Moodle. |
| LEARN-09 | Đánh dấu hoàn thành | Must | Nút Mark as done với activity hoàn thành thủ công. Tick tự động với activity hoàn thành theo điều kiện. | core_completion_update_activity_completion_status_manually; core_completion_get_activities_completion_status | Đang có ở Moodle, chưa có trên NextJS. |
| LEARN-10 | Ghi nhận đã xem | Must | Khi mở bài, gọi API view để Moodle ghi log và tính completion 'View'. | mod_page_view_page; mod_resource_view_resource; mod_url_view_url; mod_quiz_view_quiz... | Không gọi thì completion 'View' không bao giờ đạt, kéo theo restrict access và course completion sai. |
| LEARN-11 | Previous / Next | Must | Chuyển bài trước/sau theo thứ tự outline, bỏ qua bài bị khóa hoặc ẩn. | Tính từ core_course_get_contents |  |
| LEARN-12 | Sidebar Course content | Must | Section, checkbox hoàn thành, thời lượng, bài đang học được highlight, x/y mỗi section. | core_course_get_contents; core_completion_get_activities_completion_status |  |
| LEARN-13 | Tab Overview của bài | Should | Mô tả bài học, mục tiêu. | core_course_get_contents (description) |  |
| LEARN-14 | Tài liệu đính kèm của bài | Should | Dropdown Resources như Udemy: file đi kèm video/bài. | core_course_get_contents (contents) | Cần chốt cách gắn tài liệu cho 1 bài video (activity File riêng cùng section hay đính trong mô tả). |
| LEARN-15 | Breadcrumb | Should | Courses / Tên khóa / Tên bài. | - |  |
| LEARN-16 | Tab Hỏi đáp (Q&A) | Could | Đặt câu hỏi và xem trả lời ngay trong màn học. | mod_forum_add_discussion; mod_forum_get_forum_discussions | Dùng forum Hỏi đáp của khóa. |
| LEARN-17 | Ghi chú theo mốc video (Notes) | Won't | Như tab Notes của Udemy. | - | Moodle không có, video Drive không lấy được timestamp. |
| LEARN-18 | AI Assistant | Won't | Giải thích bài/câu hỏi như Udemy. | - | Phase sau, gắn với quyết định công cụ AI hỏi đáp. |

## 7. Làm bài kiểm tra (Quiz)  (`/quiz/[cmId]`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| QUIZ-01 | Trang giới thiệu quiz | Must | Số câu, thời gian, số lần được làm, điểm đạt, lịch sử các lần làm và điểm cao nhất, nút Bắt đầu / Làm tiếp / Làm lại. | mod_quiz_get_quizzes_by_courses; mod_quiz_get_quiz_access_information; mod_quiz_get_user_quiz_attempts; mod_quiz_get_user_best_grade; mod_quiz_view_quiz | mod_quiz_get_user_quiz_attempts thay cho mod_quiz_get_user_attempts ở bản mới, kiểm lại trên 5.1. |
| QUIZ-02 | Làm bài: chọn một, chọn nhiều, đúng/sai | Must | Hiển thị câu hỏi theo trang, chọn đáp án, điều hướng giữa các câu, tự lưu. | mod_quiz_start_attempt; mod_quiz_get_attempt_data; mod_quiz_save_attempt | Moodle trả câu hỏi dạng HTML render sẵn. Duy và Đạt Trần chốt: parse HTML hay BE viết API trả JSON. |
| QUIZ-03 | Đồng hồ đếm ngược | Should | Hiện thời gian còn lại nếu quiz có time limit, tự nộp khi hết giờ. | mod_quiz_get_attempt_access_information; mod_quiz_get_attempt_data |  |
| QUIZ-04 | Nộp bài có xác nhận | Must | Màn tóm tắt câu đã/chưa trả lời, xác nhận nộp. | mod_quiz_get_attempt_summary; mod_quiz_process_attempt (finishattempt=1) |  |
| QUIZ-05 | Kết quả và xem lại | Must | Điểm, Đạt/Chưa đạt theo grade to pass, đúng/sai từng câu, đáp án đúng và giải thích (tùy Review options). | mod_quiz_get_attempt_review; mod_quiz_get_quiz_feedback_for_grade |  |
| QUIZ-06 | Mở khóa phần tiếp theo sau khi đạt | Must | Nộp xong, nếu đạt thì outline cập nhật ngay, bài/section tiếp theo mở khóa. | Gọi lại core_course_get_contents sau khi nộp | Phụ thuộc rule pass (điểm chưa chốt). |
| QUIZ-07 | Phản hồi ngay từng câu | Could | Chọn xong biết đúng/sai và được thử lại như Udemy. | mod_quiz_process_attempt theo từng trang | Phụ thuộc Question behaviour (Immediate feedback / Interactive with multiple tries). Chốt với VIGO. |
| QUIZ-08 | Gợi ý bài cần ôn lại | Could | Câu sai liên kết về bài học liên quan (What you should review). | - | Moodle không map sẵn câu hỏi với bài học. Có thể dùng tag câu hỏi. |

## 8. Tests (tổng hợp bài kiểm tra)  (`/tests`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| TEST-01 | Danh sách bài kiểm tra | Should | Quiz của mọi khóa đã ghi danh: tên, khóa, hạn, số lần đã làm, điểm cao nhất, trạng thái (Chưa làm / Đang làm / Đạt / Chưa đạt). | mod_quiz_get_quizzes_by_courses; mod_quiz_get_user_best_grade; mod_quiz_get_user_quiz_attempts |  |
| TEST-02 | Lọc theo trạng thái và khóa | Should | Filter trạng thái, chọn khóa. | Lọc phía client |  |
| TEST-03 | Vào làm bài | Should | Bấm 1 dòng mở trang giới thiệu quiz (QUIZ-01). | - |  |

## 9. Grades (điểm)  (`/grades`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GRADE-01 | Tổng quan điểm theo khóa | Should | Mỗi khóa: điểm tổng, % và trạng thái đạt. | gradereport_overview_get_course_grades |  |
| GRADE-02 | Chi tiết điểm từng khóa | Should | Từng quiz: điểm, điểm đạt, phản hồi. | gradereport_user_get_grade_items |  |

## 10. Calendar  (`/calendar`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| CAL-01 | Lịch tháng | Should | Sự kiện site (lịch đào tạo), hạn quiz, sự kiện khóa. | core_calendar_get_calendar_monthly_view |  |
| CAL-02 | Sự kiện theo ngày và chi tiết | Should | Danh sách sự kiện của ngày, xem chi tiết. | core_calendar_get_calendar_day_view; core_calendar_get_calendar_event_by_id |  |
| CAL-03 | Sự kiện sắp tới | Could | List các sự kiện gần nhất. | core_calendar_get_calendar_upcoming_view |  |

## 11. Notifications  (`/notifications`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| NOTI-01 | Danh sách thông báo | Should | Mới nhất trước, phân biệt đã đọc/chưa đọc. | message_popup_get_popup_notifications |  |
| NOTI-02 | Đánh dấu đã đọc | Should | Đọc từng cái và đọc tất cả. | core_message_mark_notification_read; core_message_mark_all_notifications_as_read |  |
| NOTI-03 | Bấm thông báo đi đúng trang | Should | Mở đúng khóa/bài trên NextJS thay vì link Moodle. | contexturl trong notification | Cần bảng map URL Moodle sang route NextJS. |
| NOTI-04 | Badge số chưa đọc | Must | Trên chuông header, cập nhật định kỳ. | message_popup_get_unread_popup_notification_count |  |

## 12. Learning Path  (`/learning-path`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| LP-01 | Định nghĩa Learning Path | Should | Lộ trình gồm nhiều khóa theo thứ tự, ví dụ Training New Employees: Overview Brand > Foundational Knowledge > Brands > Integrated. Có % tiến độ lộ trình, khóa sau mở khi xong khóa trước. | Moodle core không có | Điểm chưa chốt. 3 hướng: (1) Category + Course completion điều kiện khóa trước (core), (2) Learning plans của Competencies (core), (3) custom. BA đề xuất sau khi hiểu admin. |
| LP-02 | Trang lộ trình | Should | Các bước, trạng thái từng khóa, % lộ trình, nút học tiếp. | Theo phương án LP-01 | Làm sau LP-01. |

## 13. Chứng nhận  (`/certificates`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| CERT-01 | Danh sách chứng nhận đã đạt | Should | Tên khóa, ngày cấp, tải PDF. | Phụ thuộc plugin chứng nhận | Điểm chưa chốt: plugin nào (Custom certificate / Certificate), mẫu do ai cung cấp. |
| CERT-02 | Báo nhận chứng nhận | Could | Khi hoàn thành khóa hiện thông báo và link tải. | message_popup_get_popup_notifications + plugin |  |

## 14. Profile  (`/profile`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| PROF-01 | Thông tin cá nhân | Should | Họ tên, email, phòng ban, ảnh đại diện. | core_user_get_users_by_field | Phòng ban lấy từ field Department hay cohort, chốt cùng S6. |
| PROF-02 | Đổi ảnh đại diện | Could | Upload ảnh mới. | core_files_upload (draft) + core_user_update_picture |  |
| PROF-03 | Đổi mật khẩu | Should | Đổi mật khẩu với tài khoản đăng nhập thường. | Chưa có WS core | Phương án: link sang trang đổi mật khẩu của Moodle. Liên quan AUTH-05. |

## 15. Khám phá khóa học (tùy chọn)  (`/catalog`)

| ID | Tính năng | MoSCoW | Mô tả | Moodle API | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| CAT-01 | Duyệt khóa theo danh mục | Could | Danh mục theo Category (Foundational, Brands, Integrated), card khóa. | core_course_get_categories; core_course_get_courses_by_field | Chỉ cần nếu cho tự ghi danh. Nếu ghi danh theo phòng ban (cohort) thì có thể bỏ. |
| CAT-02 | Tự ghi danh | Could | Nút Ghi danh ở trang khóa. | core_enrol_get_course_enrolment_methods; enrol_self_enrol_user | Phụ thuộc quyết định phân quyền phòng ban. |
