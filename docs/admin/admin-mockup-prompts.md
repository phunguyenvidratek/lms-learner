# Prompt dựng mockup Admin trong repo vidratek-lms-learner-mockup

Chạy lần lượt trong Claude Code tại thư mục repo. Mỗi prompt là một phiên làm việc, xong thì commit rồi mới sang prompt sau.

## Chuẩn bị (làm tay, 1 lần)

1. Giải nén `admin-mockup-kit.zip` vào gốc repo. Kết quả:
   - `docs/admin-backlog.md` (bản text của file Excel admin)
   - `docs/admin-mockup-prompts.md` (file này)
   - `docs/reference/moodle-admin/*.jpg` (41 ảnh hiện trạng admin Moodle, tên ảnh khớp cột Ảnh trong backlog)
2. Không cần dán ảnh vào chat. Các prompt đã chỉ đường dẫn ảnh, Claude Code tự đọc.
3. Sửa backlog Excel sau buổi review thì xuất lại `docs/admin-backlog.md` (hoặc nhờ Claude cập nhật) trước khi chạy prompt của màn đó.

## Prompt 1: Tái cấu trúc repo cho 2 site (chạy ở Plan mode)

```
Đọc CLAUDE.md, AGENTS.md, docs/backlog.md và docs/admin-backlog.md.

Bối cảnh: repo đang là mockup learner portal. Mình cần thêm mockup admin portal trong cùng repo để dev thấy giao diện mới của admin Moodle sau khi đổi theme.
Admin thật vẫn là Moodle 5.1 + Boost Union, chỉ đổi theme. Vì vậy mockup admin phải giữ đúng luồng, URL và field của Moodle, chỉ đổi cách trình bày theo backlog.

Yêu cầu:
1. Lên plan cấu trúc, chưa code:
   - Admin nằm dưới /admin, layout riêng (src/app/admin/layout.tsx), không đụng route learner hiện có.
   - Dùng chung token trong globals.css và component trong src/components/ui. Component riêng của admin để ở src/components/admin/<nhóm>.
   - Mock data admin ở src/lib/mock/admin/*, đọc qua src/lib/admin-data.ts. Dùng lại khóa, bài, quiz của mock learner, thêm dữ liệu quản trị (người dùng, phòng ban, ghi danh, bài nộp chờ chấm, báo cáo). Số liệu admin phải khớp số liệu learner.
   - Bảng map route mockup sang URL Moodle thật (ví dụ /admin/courses/[id]/edit -> /course/view.php?id=&edit=on).
2. Cập nhật CLAUDE.md:
   - Thêm phần "Admin portal (mockup theme Moodle)": nguồn sự thật là docs/admin-backlog.md, ảnh hiện trạng ở docs/reference/moodle-admin.
   - Ràng buộc: không thêm bước, field, luồng mà Moodle không có; mỗi màn admin ghi URL Moodle tương ứng trong comment đầu file; mã backlog chỉ nằm trong comment.
   - Map màn hình admin (giống bảng Map màn hình learner), trạng thái "Chưa dựng".
   - Mục "Câu hỏi cho BA (admin)" ở cuối.
3. Giữ nguyên toàn bộ learner. Sau khi xong, chạy lint, build và node scripts/e2e-demo.mjs để chắc learner không vỡ.
Trình bày plan cho mình duyệt trước khi code.
```

## Prompt 2: Khung admin (SHELL)

```
Dựng khung admin theo SHELL-01..07 trong docs/admin-backlog.md.
Ảnh hiện trạng: docs/reference/moodle-admin/shell-04-more-menu.jpg, ced-01-course-top.jpg, shell-02-site-admin.jpg, user-01-browse.jpg.

- Thanh trên cùng giữ cấu trúc Moodle (logo, menu chính, chuông, avatar, công tắc Chế độ chỉnh sửa).
- Sidebar trái thu gọn được (SHELL-04) với nhóm: Tổng quan, Khóa học, Ngân hàng câu hỏi, Người dùng, Phòng ban, Báo cáo, Lịch và thông báo. Mỗi mục trỏ đúng màn tương ứng với URL Moodle trong bảng map.
- Page header chung (SHELL-07): breadcrumb, tiêu đề, mô tả ngắn, nút chính bên phải.
- Tab khóa (SHELL-05): Nội dung, Cài đặt, Học viên, Điểm, Hoàn thành, Báo cáo, Câu hỏi, Thêm. "Thêm" chỉ còn Course reuse, Recycle bin.
- Nội dung rộng tối đa 1200px, trang báo cáo full width (SHELL-01).
- Toàn bộ text tiếng Việt, dùng token brand như learner.
Kiểm 1280px, 768px, 375px bằng scripts/screenshot.mjs và cập nhật bảng map trong CLAUDE.md.
```

## Prompt 3: Tổng quan và Khóa học của tôi (DASH, MYC, HOME-01)

```
Dựng /admin (Tổng quan) theo DASH-01..04 và /admin/my-courses theo MYC-01..04 trong docs/admin-backlog.md.
Ảnh hiện trạng: docs/reference/moodle-admin/dash-02-dashboard.jpg, dash-01-dashboard-edit.jpg, myc-01-my-courses.jpg.
Tham khảo bố cục learner /dashboard để đồng bộ.

- Tổng quan: 4 thẻ số liệu (mỗi thẻ link tới báo cáo), hàng lối tắt 5 nút, khối Việc cần xử lý, khối Khóa tôi phụ trách; cột phải lịch nhỏ và thông báo.
- Khóa học của tôi: thẻ khóa cho người soạn (nhãn Đang hiển thị/Đang ẩn, danh mục, không có % học cá nhân), menu 3 chấm có Soạn nội dung, Cài đặt, Học viên, Báo cáo tiến độ; lọc theo Nhóm chương trình; chế độ Thẻ/Danh sách.
- Mọi danh sách có empty state, có loading.
Ghi vào "Câu hỏi cho BA (admin)" nếu chỉ số nào chưa đủ dữ liệu mock.
```

## Prompt 4: Soạn nội dung khóa và thêm bài (CED, ACT)

```
Dựng /admin/courses/[courseId]/edit (trang khóa ở chế độ chỉnh sửa) theo CED-01..07 và luồng thêm bài theo ACT-01..07 trong docs/admin-backlog.md.
Ảnh hiện trạng: docs/reference/moodle-admin/ced-02-section.jpg, ced-03-restriction.jpg, ced-01-course-top.jpg, act-01-chooser-starred.jpg, act-02-chooser-all.jpg, act-03-page-form.jpg, act-04-restrict-completion.jpg.

- Giữ cấu trúc Moodle: Course index bên trái, danh sách phần, mỗi phần có danh sách bài. Không biến thành wizard.
- Dòng bài: icon + nhãn loại bằng chữ, chip hoàn thành, chip điều kiện mở gọn, menu 3 chấm. Không có nút Mark as done của người xem.
- Đầu phần có dòng tóm tắt. Cuối phần có nút "Thêm bài học" full width và vùng kéo thả file.
- Hàng nút đầu khóa: Xem như học viên, Sửa hàng loạt, Cài đặt hoàn thành.
- Bảng chọn loại bài: 7 loại nghiệp vụ VIGO, tiếng Việt, mô tả 1 dòng. Loại "Bài video (Google Drive)" dựng theo hướng A trong ACT-02 nhưng ghi rõ trong Câu hỏi cho BA là điểm chưa chốt.
- Form bài học /admin/courses/[courseId]/modedit: giữ đúng field Moodle, thứ tự mới: Chung, Nội dung, Hoàn thành, Điều kiện truy cập (mở sẵn), các nhóm khác thu gọn ở cuối. Thanh Lưu cố định đáy.
- Lưu là lưu vào store mock, quay lại trang khóa thấy bài mới.
```

## Prompt 5: Bài kiểm tra và điều kiện hoàn thành (QUIZ, COMP)

```
Dựng theo QUIZ-01..06 và COMP-01..03 trong docs/admin-backlog.md.
Ảnh hiện trạng: docs/reference/moodle-admin/quiz-01-settings.jpg, quiz-02-questions.jpg, quiz-03-import-excel.jpg, quiz-04-question-banks.jpg, quiz-05-results.jpg, comp-01-course-completion.jpg.

- Form cài đặt quiz: 6 trường cốt lõi hiện sẵn, phần còn lại trong "Hiện thêm" (giống cơ chế Advanced của Moodle), không bỏ field nào.
- Trang câu hỏi: chip loại câu, điểm, thang điểm có giải thích quy đổi, nút "Thêm câu hỏi từ Excel" là nút chính.
- Import Excel 3 bước: Tải mẫu, Chọn file, Xem trước có lỗi theo dòng. Dùng file mẫu giả trong mock.
- Kết quả quiz: thẻ tóm tắt (đã làm, đạt, điểm TB, câu sai nhiều nhất), khung lọc thu gọn.
- Hoàn thành khóa: câu tóm tắt quy tắc ở đầu trang, cập nhật khi tick; điều kiện ít dùng trong "Điều kiện khác"; tab Mặc định hoàn thành bài, Sửa hàng loạt.
Quy tắc tính hoàn thành phải dùng chung src/lib/learning.ts để khớp learner.
```

## Prompt 6: Học viên, người dùng, phòng ban (ENR, USER, COH)

```
Dựng theo ENR-01..04, USER-01..03, COH-01..02 trong docs/admin-backlog.md.
Ảnh hiện trạng: docs/reference/moodle-admin/enr-01-participants.jpg, enr-02-enrol-modal.jpg, enr-03-enrol-methods.jpg, user-01-browse.jpg, user-02-add-user.jpg, coh-01-cohorts.jpg.

- Học viên của khóa: không có thanh chữ cái, có tìm kiếm và lọc; cột phòng ban, ngày ghi danh, % hoàn thành, trạng thái.
- Hộp Ghi danh: giữ 3 phần Moodle (người dùng, phòng ban, vai trò) và thêm giải thích "Ghi danh 1 lần" khác "Đồng bộ tự động", link sang Cách ghi danh.
- Người dùng: danh sách có phòng ban; form thêm người rút gọn (các nhóm khác thu gọn, không bỏ field bắt buộc); trang Import CSV có file mẫu.
- Phòng ban: tên, mô tả, số người, khóa đang đồng bộ.
Không ghi mật khẩu thật vào mock, trường mật khẩu dùng placeholder.
```

## Prompt 7: Báo cáo, lịch, thông báo, danh mục, cài đặt khóa (RPT, NOTI, CAT, CSET)

```
Dựng theo RPT-01..04, NOTI-01..02, CAT-01..03, CSET-01..03 trong docs/admin-backlog.md.
Ảnh hiện trạng: docs/reference/moodle-admin/rpt-01-activity-completion.jpg, rpt-02-grader.jpg, rpt-03-custom-reports.jpg, noti-01-calendar.jpg, home-03-categories-news.jpg, cat-01-management.jpg, cat-02-category-index.jpg, cset-01-settings-top.jpg, cset-02-settings-bottom.jpg.

- Trang Báo cáo: danh sách báo cáo theo câu hỏi nghiệp vụ, mỗi báo cáo là bảng có lọc phòng ban và nút xuất.
- Báo cáo hoàn thành: full width, % mỗi học viên, màu trạng thái. Sổ điểm ở chế độ xem, màu đạt/không đạt.
- Lịch: tên sự kiện xuống 2 dòng, màu theo loại. Thông báo dạng thẻ.
- Quản lý khóa: cây danh mục trái, bảng khóa phải, nút Tạo khóa mới primary, hành động có nhãn.
- Cài đặt khóa: khối Thông tin chính, khối Nâng cao thu gọn, ô xem trước thẻ khóa giống learner /courses.
```

## Prompt 8: Rà soát và báo cáo

```
Rà toàn bộ admin theo docs/admin-backlog.md:
1. Lập bảng: mã backlog, đã dựng hay chưa, route mockup, URL Moodle, chỗ nào lệch backlog.
2. Kiểm không có màn nào thêm bước hoặc field Moodle không có. Nếu có, liệt kê để mình quyết.
3. Chụp 1280px và 375px mọi route admin vào docs/screenshots/admin bằng scripts/screenshot.mjs.
4. Chạy lint, build, e2e learner. Cập nhật Map màn hình và Câu hỏi cho BA (admin) trong CLAUDE.md.
```
