# Rà soát mockup admin theo backlog (v0.1)

Đối chiếu `docs/admin/admin-backlog.md` với mockup trong `src/app/admin`. Ảnh chụp 1280px và 375px của mọi route:
`docs/screenshots/admin`. Kiểm tra tự động: `node scripts/e2e-admin.mjs` (luồng chính + 36 route không lỗi, không cuộn
ngang ở 375px) và `node scripts/e2e-demo.mjs` (learner không vỡ).

## 1. Bảng đối chiếu

Trạng thái: **Đã dựng** / **Một phần** / **Không dựng** (lý do ở cột Lệch backlog).

| Mã | Trạng thái | Route mockup | URL Moodle | Lệch backlog |
| --- | --- | --- | --- | --- |
| SHELL-01 | Đã dựng | Mọi trang (`AdminPage`, full width cho báo cáo, sổ điểm) | Boost Union Course content max width | - |
| SHELL-02 | Đã dựng | Dùng chung `globals.css` | Boost Union Brand colors, Raw SCSS | - |
| SHELL-03 | Đã dựng | Menu "Quản trị đào tạo" trên thanh trên cùng | Smart menu | Thêm mục Ngân hàng câu hỏi (Moodle không có trang cấp site, xem mục 2) |
| SHELL-04 | Đã dựng | Sidebar trái, thu gọn được, nhớ trạng thái | Child theme drawers.mustache | - |
| SHELL-05 | Đã dựng | Tab khóa: Nội dung, Cài đặt, Học viên, Điểm, Hoàn thành, Báo cáo, Câu hỏi, Thêm | Secondary navigation | "Thêm" chỉ còn Dùng lại khóa, Thùng rác như prompt |
| SHELL-06 | Đã dựng | Toàn bộ tiếng Việt, thuật ngữ VIGO | Language customisation | Ngôn ngữ admin chưa chốt (Điểm chưa chốt 1) |
| SHELL-07 | Đã dựng | `AdminPageHeader`, `SectionHeader` | core/full_header.mustache | - |
| HOME-01 | Đã dựng | /admin | /my/ | - |
| HOME-02 | Không dựng | - | /?redirect=0 | Trang chủ site không dùng sau HOME-01 |
| HOME-03 | Đã dựng | /admin/announcements (thẻ, trích 2 dòng) | Front page settings | Dựng ở trang Thông báo chung thay vì trang chủ |
| HOME-04 | Không dựng | - | SCSS pagelayout-frontpage | Không có trang chủ trong mockup |
| DASH-01 | Đã dựng | /admin (4 thẻ số liệu, link báo cáo) | Block custom | Thẻ "Học viên hoạt động" link báo cáo thứ 5 |
| DASH-02 | Đã dựng | /admin (5 lối tắt) | Block Text | "Nhập câu hỏi Excel" mở hộp chọn bài kiểm tra; "Ghi danh phòng ban" trỏ trang Phòng ban |
| DASH-03 | Đã dựng | /admin#viec-can-xu-ly | Block custom | 5 loại cảnh báo (thêm "hết lượt chưa đạt" ngoài 4 loại backlog) |
| DASH-04 | Đã dựng | /admin (2 cột, lịch nhỏ + thông báo) | Block region | - |
| MYC-01 | Đã dựng | /admin/my-courses | /my/courses.php | - |
| MYC-02 | Đã dựng | Menu 3 chấm của thẻ | course action menu | - |
| MYC-03 | Đã dựng | Lọc Nhóm chương trình | Course custom field | Thêm lọc trạng thái và ô tìm |
| MYC-04 | Đã dựng | Số học viên, % trung bình trên thẻ | Web service custom | - |
| CAT-01 | Đã dựng | /admin/courses | /course/management.php | - |
| CAT-02 | Đã dựng | /admin/courses?categoryid= | /course/management.php?categoryid= | Thanh "Với khóa đã chọn" có thêm Ẩn/Hiện hàng loạt |
| CAT-03 | Đã dựng | Tên danh mục "Training" trong dữ liệu mẫu | Sửa dữ liệu | - |
| CSET-01 | Đã dựng | /admin/courses/new | /course/edit.php?category= | Bộ mặc định chờ chốt (câu hỏi BA 21) |
| CSET-02 | Đã dựng | /admin/courses/[id]/settings | /course/edit.php?id= | Khối Nâng cao chưa vẽ hết field (mục 2) |
| CSET-03 | Đã dựng | Ô xem trước thẻ khóa | AMD JS | - |
| CED-01 | Đã dựng | /admin/courses/[id]/edit | /course/view.php?id=&edit=on | - |
| CED-02 | Đã dựng | Chip "Cần đạt 8/10..." / "Mở sau: ...", bấm xem chi tiết | availability template | - |
| CED-03 | Đã dựng | Không có nút Mark as done | SCSS body.editing | - |
| CED-04 | Đã dựng | Nút "Thêm bài học" full width + link "Thêm phần con" | divider template | - |
| CED-05 | Đã dựng | Vùng kéo thả file mỗi phần (tạo bài Tài liệu thật trong mockup) | Drag and drop upload core | - |
| CED-06 | Đã dựng | Dòng tóm tắt đầu phần | section template | - |
| CED-07 | Đã dựng | Xem như học viên, Sửa hàng loạt, Cài đặt hoàn thành | course header | Xem như học viên mở learner portal (khóa ẩn bị tắt) |
| ACT-01 | Đã dựng | Hộp chọn: Thường dùng (7 loại) / Tất cả | Activity chooser | Nghĩa của "Thông báo" chờ xác nhận (câu hỏi BA 10) |
| ACT-02 | Đã dựng (hướng A) | /admin/courses/[id]/modedit?add=drivevideo | mod_drivevideo (custom) | Điểm chưa chốt 2 |
| ACT-03 | Đã dựng | Ghi chú nhóm đã tắt ở cuối form | Advanced features | - |
| ACT-04 | Đã dựng | Chung, Nội dung, Hoàn thành, Điều kiện mở sẵn; còn lại thu gọn | AMD JS | - |
| ACT-05 | Đã dựng | Thanh Lưu cố định đáy | SCSS sticky | - |
| ACT-06 | Đã dựng | Mặc định theo loại + /completion/default | Default activity completion | Tài liệu = Xem bài khác learner hiện tại (câu hỏi BA 11) |
| ACT-07 | Đã dựng | Nút "Mở sau bài trước" | AMD JS điền JSON availability | - |
| QUIZ-01 | Đã dựng | /admin/courses/[id]/modedit?update={quiz} | mod_quiz_mod_form | - |
| QUIZ-02 | Đã dựng | /admin/quiz/[cmId]/edit | /mod/quiz/edit.php?cmid= | "Thêm" (câu mới, từ ngân hàng, ngẫu nhiên) chỉ trỏ trang ngân hàng |
| QUIZ-03 | Đã dựng | Khối thang điểm + câu giải thích quy đổi | Language customisation | - |
| QUIZ-04 | Đã dựng | /admin/quiz/[cmId]/import (3 bước) | /local/quizexcel/import.php | .xlsx dùng dữ liệu mẫu, .csv đọc thật |
| QUIZ-05 | Đã dựng | /admin/quiz/[cmId]/results | /mod/quiz/report.php?mode=overview | - |
| QUIZ-06 | Đã dựng | /admin/courses/[id]/question-banks, /admin/question-banks | /question/banks.php?courseid= | Trang cấp site không có ở Moodle |
| COMP-01 | Đã dựng | /admin/courses/[id]/completion | /course/completion.php?id= | - |
| COMP-02 | Đã dựng | Khối "Điều kiện khác" thu gọn | AMD JS/SCSS | - |
| COMP-03 | Đã dựng | Tab Hoàn thành khóa / Mặc định / Sửa hàng loạt | tertiary navigation | - |
| ENR-01 | Đã dựng | /admin/courses/[id]/participants (không có A-Z) | /user/index.php?id= | - |
| ENR-02 | Đã dựng | Hộp Ghi danh có giải thích + link Cách ghi danh | enrol_manual modal | - |
| ENR-03 | Đã dựng | Cột phòng ban, ngày ghi danh, %, trạng thái, xuất Excel | Report builder | Gộp vào trang Học viên (mục 2) |
| ENR-04 | Đã dựng | /admin/courses/[id]/enrolments | /enrol/instances.php?id= | Thêm đồng bộ phòng ban dạng hộp thoại (mục 2) |
| USER-01 | Đã dựng | /admin/users/new, /admin/users/[id]/edit | /user/editadvanced.php | Phòng ban trong form ghi cả cohort (mục 2) |
| USER-02 | Đã dựng | /admin/users | /admin/user.php | - |
| USER-03 | Đã dựng | /admin/users/upload | /admin/tool/uploaduser/index.php | Cài đặt nhập rút gọn (mục 2) |
| COH-01 | Đã dựng | /admin/cohorts | /cohort/index.php | - |
| COH-02 | Đã dựng | Cột "Khóa đang đồng bộ" | Custom nhỏ | Thành viên quản lý trong hộp thoại thay vì trang cohort/assign.php |
| RPT-01 | Đã dựng | /admin/reports/[reportId] (5 báo cáo) | Report builder | Lịch gửi, người nhận ghi tạm |
| RPT-02 | Đã dựng | /admin/reports | Smart menu / trang | - |
| RPT-03 | Đã dựng | /admin/courses/[id]/reports/progress | /report/progress/index.php | Mã bài 1.1, 1.2 thay tên xoay dọc, rê chuột xem tên |
| RPT-04 | Đã dựng | /admin/courses/[id]/grades | /grade/report/grader/index.php | Nhập điểm chỉ cho bài nộp (mục 2) |
| NOTI-01 | Đã dựng | /admin/calendar | /calendar/view.php?view=month | Chưa có nút Thêm sự kiện |
| NOTI-02 | Đã dựng | /admin/announcements/new | /mod/forum/post.php?forum= | - |
| CERT-01 | Không dựng | - | /badges | Chờ chốt plugin (backlog ghi rõ chốt trước rồi mới làm UI) |

Tổng: 62/65 mã đã dựng. HOME-02, HOME-04 (trang chủ site, không dùng sau HOME-01) và CERT-01 (chờ chốt plugin) không dựng.

## 2. Chỗ mockup thêm bước, field, hoặc lệch Moodle (cần anh quyết)

Ràng buộc chung là không thêm bước, field, luồng mà Moodle không có. Các điểm dưới đây vượt hoặc lệch:

| # | Màn | Điểm lệch | Moodle thật | Đề xuất |
| --- | --- | --- | --- | --- |
| 1 | Người dùng (USER-01) | Ô "Phòng ban" trong form thêm người ghi cả profile field và thêm vào cohort | editadvanced chỉ ghi profile field; vào cohort phải qua cohort/assign.php hoặc upload CSV (cột cohort1) | Giữ nếu chốt phương án "field tự đẩy vào cohort" (Điểm chưa chốt 3, cần plugin nhỏ); nếu không, đổi thành chỉ profile field |
| 2 | Học viên của khóa (ENR-03) | Cột %, trạng thái hoàn thành, phòng ban hiện ngay trên trang Học viên | user/index.php không có cột %; backlog đề xuất custom report riêng, link từ tab | Chấp nhận trình bày gộp cho mockup, dev làm bằng Report builder + link |
| 3 | Thêm đồng bộ phòng ban (ENR-04) | Hộp thoại 2 field (phòng ban, vai trò) | enrol/editinstance.php có thêm Tên tùy chỉnh, Thêm vào nhóm | Thêm 2 field vào khối "Hiện thêm" nếu cần trung thành |
| 4 | Ngân hàng câu hỏi (SHELL-03, QUIZ-06) | Trang /admin/question-banks liệt kê bank theo khóa | Không có trang cấp site | Câu hỏi BA 1 |
| 5 | Bài video (ACT-02) | Field link Drive, thời lượng, xem trước, hoàn thành "xem X% video" | Không có trong core, là plugin mod_drivevideo (hướng A) | Điểm chưa chốt 2 |
| 6 | Tổng quan (DASH-03) | Loại cảnh báo thứ 5 "hết lượt chưa đạt" | Block custom | Giữ, thêm vào backlog nếu đồng ý |
| 7 | Sổ điểm (RPT-04) | Bật nhập điểm chỉ cho cột Bài nộp, điểm bài kiểm tra không sửa | Quick grading cho sửa cả quiz (override) | Giữ (an toàn hơn) hoặc mở cả quiz cho đúng Moodle |
| 8 | Nhập người dùng (USER-03) | Màn 1 trang (mô tả cột, chọn file, xem trước + cài đặt); cài đặt rút gọn còn 6 mục | uploaduser có ~20 cài đặt + giá trị mặc định cho mọi field | Bổ sung đủ cài đặt vào "Hiện thêm" khi làm thật |
| 9 | Form bài học (ACT) | Bài nộp, Khảo sát, Diễn đàn mới vẽ field chính; Giao diện thiếu kích thước cửa sổ bật lên; Nội dung trang là ô văn bản thay cho trình soạn TinyMCE | Đủ field theo mod_form của từng module | Chỉ là phạm vi vẽ mockup, theme thật không bỏ field |
| 10 | Cài đặt khóa (CSET-02) | Khối Nâng cao thiếu: Ngày tương đối, Cho tải nội dung khóa, Loại lịch, Ép theme; ảnh khóa chọn từ thư viện 8 ảnh | Có đủ; ảnh chọn bằng File picker | Như mục 9; thư viện ảnh là gợi ý giao diện cho File picker |
| 11 | Phòng ban (COH-02) | Quản lý thành viên trong hộp thoại | Trang cohort/assign.php riêng | Giữ trang Moodle, hộp thoại chỉ là cách trình bày |
| 12 | Thanh trên cùng | Mục "Bỏ mọi thay đổi trên trang quản trị" | Không có | Chỉ là công cụ mockup để trình bày lại từ đầu |
| 13 | Sidebar | Link "Mở cổng học viên" | Không có | Thêm bằng smart menu nếu VIGO muốn |
| 14 | Lịch (NOTI-01) | Thiếu nút "Sự kiện mới" | Có | Thêm khi làm thật (không phải field thừa) |

Không màn nào thêm bước vào luồng Moodle ngoài các điểm trên. Các form giữ thứ tự mới theo backlog (ACT-04, CSET-02,
COMP-02, QUIZ-01) nhưng không đổi tên field hay cách submit.

## 3. Kết quả kiểm tra

- `npm run lint`, `npm run build`: sạch.
- `node scripts/e2e-demo.mjs`: luồng trình bày learner chạy trọn (learner không vỡ).
- `node scripts/e2e-admin.mjs`: thêm bài video Drive, kéo thả file, sửa cài đặt quiz, nhập Excel 3 bước, câu tóm tắt
  hoàn thành, đồng bộ phòng ban tự ghi danh người mới, % ở admin đổi khi học viên học bên learner, chấm bài nộp, tạo khóa
  mới, lọc báo cáo, 36 route không lỗi và không cuộn ngang ở 375px.
