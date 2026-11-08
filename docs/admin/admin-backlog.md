# Admin backlog v0.1 - VIGO LMS (UI/UX, theme-only)

Bản text của file `VidratekLMS_Admin_UX_Backlog_v0.1.xlsx`. Nguồn sự thật cho mockup admin.

## Ràng buộc chung

- Admin thật vẫn là Moodle 5.1 + theme Boost Union. Cải tiến chỉ bằng cấu hình, child theme (SCSS, mustache, renderer, JS nhỏ) và vài block/plugin nhỏ (đánh dấu Ngoài theme).
- Không đổi luồng, không đổi URL, không đổi field của form Moodle. Mockup chỉ đổi cách trình bày, thứ tự, nhãn, gom nhóm.
- Người dùng: Phòng Đào tạo VIGO (Manager) và người soạn bài (Course creator, Teacher).
- Priority: Must > Should > Could. Phạm vi: Cấu hình | Theme | Ngoài theme.
- Ảnh hiện trạng: `docs/reference/moodle-admin/<tên>.jpg`.

## SHELL - Khung chung admin

Route Moodle: `Mọi trang`  
Người dùng: Mọi người quản trị, mọi lúc  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- Nội dung bị bó trong khung 830px, màn 1440px bỏ trống gần nửa
- Menu chính chỉ có Home, Dashboard, My courses, Site administration. Việc hay làm nằm sâu trong Site administration
- Tab của khóa có 12 mục giấu trong More (Course completion, Question banks, Recycle bin...)
- Giao diện lẫn Anh Việt, màu và font không giống learner portal

Hướng cải tiến chính:
- Mở rộng khung nội dung, dùng chung token màu, font với learner
- Menu theo việc của Phòng Đào tạo, giới hạn theo role
- Đưa mục hay dùng ra khỏi More

Ảnh: `shell-04-more-menu.jpg`, `ced-01-course-top.jpg`

### SHELL-01 Mở rộng khung nội dung

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `ced-01-course-top.jpg`

- Expected: Trang soạn bài, bảng báo cáo dùng hết bề ngang màn hình, không phải cuộn ngang khi còn trống hai bên.
- Actual:
  - Boost Union đang đặt Course content max width = 830px
  - Màn 1440px: vùng nội dung chỉ chiếm khoảng 57%
  - Báo cáo hoàn thành, sổ điểm phải cuộn ngang
- Đề xuất: Tăng độ rộng khung cho trang khóa, form; trang báo cáo và bảng dùng full width.
- Việc cần làm:
  - Đổi Course content max width lên 1200px
  - Thêm SCSS: pagelayout-report, admin dùng 100%
  - Kiểm 1280, 1440, 1920px
- Cách làm trong Moodle: Site administration > Appearance > Boost Union > Look > Page: Course content max width. SCSS cho layout report.
- Tham chiếu: TalentLMS, Docebo: bảng admin full width

### SHELL-02 Đồng bộ brand với learner portal

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `shell-01-home-vi.jpg`

- Expected: Admin và learner nhìn như một sản phẩm: cùng màu chủ đạo, font, bo góc, kiểu nút.
- Actual:
  - Brand color của Boost Union để trống, đang là xanh mặc định của Boost
  - Font hệ thống, nút bo nhỏ, khác learner (Be Vietnam Pro, #0033a0)
- Đề xuất: Dùng chung bộ token của learner: primary #0033a0, thang brand, success/warning/destructive, font Be Vietnam Pro, radius.
- Việc cần làm:
  - Nhập Brand color, Button color, màu Bootstrap success/warning/danger
  - Thêm SCSS import font Be Vietnam Pro
  - Chuẩn hóa radius card 12px, input/button 6px
  - Mockup: dùng chung globals.css của repo
- Cách làm trong Moodle: Boost Union > Look > Brand colors, Bootstrap colors; Raw SCSS / Raw initial SCSS.
- Tham chiếu: Learner mockup (repo vidratek-lms-learner-mockup)

### SHELL-03 Menu theo việc của Phòng Đào tạo

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `shell-02-site-admin.jpg`

- Expected: Vào là thấy ngay các nhóm việc: Khóa học, Ngân hàng câu hỏi, Người dùng và phòng ban, Báo cáo, Thông báo. Không phải biết Moodle để tìm.
- Actual:
  - Menu chính: Home, Dashboard, My courses, Site administration
  - Người dùng, Cohorts, Báo cáo nằm trong Site administration với hàng trăm mục khác
- Đề xuất: Thêm Smart menu 'Quản trị đào tạo' (hoặc vài mục cấp 1) chỉ hiện cho Manager và Course creator, trỏ thẳng URL core.
- Việc cần làm:
  - Tạo smart menu: Khóa học (/course/management.php), Người dùng (/admin/user.php), Phòng ban (/cohort/index.php), Báo cáo (/reportbuilder/index.php), Lịch (/calendar/view.php)
  - Giới hạn theo role
  - Ẩn mục Home khỏi primary navigation nếu đặt Dashboard làm trang đầu
- Cách làm trong Moodle: Boost Union > Smart menus; Boost Union > Navigation > Hide nodes in primary navigation.
- Tham chiếu: TalentLMS: menu trái Home, Users, Courses, Groups, Reports

### SHELL-04 Sidebar trái cố định cho người quản trị

Priority: Should · Phạm vi: Theme · Effort: M · Ảnh: `ced-01-course-top.jpg`

- Expected: Như các LMS khác: sidebar trái có nhóm menu, mục đang mở được tô sáng, thu gọn được. Giống learner portal.
- Actual:
  - Moodle chỉ có thanh ngang trên cùng
  - Drawer trái là Course index, chỉ có trong khóa
- Đề xuất: Template override layout drawers: thêm sidebar chung lấy từ smart menu ở SHELL-03, giữ Course index khi ở trong khóa.
- Việc cần làm:
  - Tạo child theme của Boost Union
  - Override layout drawers.mustache, thêm vùng sidebar
  - Trạng thái thu gọn lưu bằng user preference
  - Kiểm không đè Course index và Block drawer
- Cách làm trong Moodle: Child theme Boost Union: override theme_boost/drawers.mustache + SCSS.
- Tham chiếu: TalentLMS, Docebo, learner mockup (app)
- Notes: Làm sau SHELL-03. Cần Thiện xem rủi ro khi nâng cấp Boost Union.

### SHELL-05 Đưa mục hay dùng ra khỏi More của khóa

Priority: Should · Phạm vi: Theme · Effort: M · Ảnh: `shell-04-more-menu.jpg`

- Expected: Các việc chính của một khóa nằm ngay trên tab: Nội dung, Cài đặt, Học viên, Điểm, Hoàn thành, Báo cáo, Câu hỏi.
- Actual:
  - Tab khóa: Course, Settings, Participants, Grades, Activities, More
  - More chứa 12 mục: Reports, Question banks, Content bank, Course completion, Badges, Competencies, Filters, Unenrol me, LTI, Accessibility toolkit, Recycle bin, Course reuse
- Đề xuất: Đưa Course completion, Question banks, Reports lên tab chính. Ẩn mục không dùng cho VIGO (Competencies, Filters, LTI, Content bank, Unenrol me).
- Việc cần làm:
  - Tắt tính năng không dùng ở site (Competencies, LTI...) để mục tự biến mất
  - Override secondary navigation để đổi thứ tự và số tab hiện
  - Đổi nhãn tiếng Việt
- Cách làm trong Moodle: Tắt tính năng: Site administration > Advanced features. Thứ tự tab: override renderer secondary navigation trong child theme.
- Tham chiếu: Canvas: menu khóa bật tắt từng mục

### SHELL-06 Một ngôn ngữ thống nhất cho giao diện admin

Priority: Should · Phạm vi: Cấu hình · Effort: M · Ảnh: `shell-01-home-vi.jpg`

- Expected: Người dùng VIGO đọc toàn bộ nhãn bằng tiếng Việt, thuật ngữ nghiệp vụ (Phòng ban, Bài học, Bài kiểm tra).
- Actual:
  - Giao diện lẫn tiếng Anh và Việt (ảnh trang chủ bản Việt và Anh)
  - Nhiều chuỗi dịch sai đã ghi ở file review trước
- Đề xuất: Chốt ngôn ngữ admin, dùng Language customisation cho thuật ngữ VIGO.
- Việc cần làm:
  - Chốt dùng tiếng Việt hay tiếng Anh cho admin
  - Sửa 23 chuỗi dịch sai (file VIGO-LMS-Diem-can-cai-thien, sheet Chuỗi dịch sai)
  - Đổi Cohort = Phòng ban, Activity = Bài học, Quiz = Bài kiểm tra
- Cách làm trong Moodle: Site administration > Language > Language customisation.
- Tham chiếu: -
- Notes: Điểm chưa chốt: ngôn ngữ mặc định của admin.

### SHELL-07 Đầu trang thống nhất: tiêu đề + nút chính

Priority: Should · Phạm vi: Theme · Effort: M · Ảnh: `user-01-browse.jpg`

- Expected: Mỗi trang có tiêu đề rõ, breadcrumb, và nút hành động chính luôn ở góc phải (Tạo khóa, Thêm người, Lưu).
- Actual:
  - Nút chính nằm lung tung: giữa khung (Create new category), dưới cùng (Add method), góc phải (Add a new user)
  - Một số trang lặp tên site 'VIGO Learning Management System' làm tiêu đề
- Đề xuất: Chuẩn hóa page header: breadcrumb, tiêu đề trang, mô tả ngắn, nút chính bên phải.
- Việc cần làm:
  - Override template page header
  - SCSS cho nút primary ở header
  - Áp dụng cho trang quản trị trong scope
- Cách làm trong Moodle: Child theme: override core/full_header.mustache + SCSS.
- Tham chiếu: Docebo, TalentLMS: header trang có nút chính bên phải

## HOME - Trang chủ site

Route Moodle: `/?redirect=0`  
Người dùng: Admin, ít khi (learner dùng NextJS)  
Ưu tiên màn: Should

Vấn đề lớn nhất:
- Khối Welcome tiếng Anh chiếm trọn màn đầu
- Danh sách khóa sổ dọc, mỗi khóa một khối to, ảnh lệch cỡ, chỉ có 'Teacher: ...'
- Cây danh mục và thông báo nằm cuối, thông báo hiện toàn văn rất dài
- Tab Settings, Participants, Question banks của trang chủ dễ nhầm với khóa học

Hướng cải tiến chính:
- Đặt Tổng quan làm trang mặc định sau đăng nhập
- Khóa dạng lưới thẻ, thông báo dạng thẻ rút gọn

Ảnh: `home-00-home-en.jpg`, `home-02-courses.jpg`, `home-03-categories-news.jpg`

### HOME-01 Trang đầu sau đăng nhập là Tổng quan

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `home-00-home-en.jpg`

- Expected: Người quản trị đăng nhập vào thẳng màn làm việc, không phải qua trang giới thiệu.
- Actual:
  - Trang chủ là trang chào mừng tiếng Anh, khối Welcome chiếm hết màn đầu
  - Phải bấm 'Go to Dashboard' mới vào việc
- Đề xuất: Đặt Start page for users = Dashboard. Trang chủ chỉ còn vai trò danh mục khóa.
- Việc cần làm:
  - Đổi cài đặt Start page for users
  - Ẩn Home khỏi menu nếu không cần
- Cách làm trong Moodle: Site administration > Appearance > Navigation > Start page for users.
- Tham chiếu: TalentLMS: admin vào thẳng Dashboard

### HOME-02 Danh sách khóa dạng lưới thẻ

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `home-02-courses.jpg`

- Expected: Nhìn một màn thấy được nhiều khóa: ảnh bìa cùng tỉ lệ, tên, danh mục, giảng viên.
- Actual:
  - Mỗi khóa là một khối to xếp dọc, ảnh lệch cỡ (dọc, ngang, không ảnh)
  - 12 khóa phải cuộn khoảng 4 màn
- Đề xuất: Chuyển course listing trên trang chủ và trang danh mục sang dạng thẻ, ảnh tỉ lệ 16:9.
- Việc cần làm:
  - Bật course listing dạng card trong Boost Union
  - SCSS: ảnh object-fit cover 16:9
  - Hiện danh mục trên thẻ
- Cách làm trong Moodle: Boost Union: setting Course listing presentation = Card (kiểm tên mục trên bản đang cài). SCSS.
- Tham chiếu: Learner mockup /courses

### HOME-03 Thông báo dạng thẻ rút gọn

Priority: Could · Phạm vi: Cấu hình · Effort: S · Ảnh: `home-03-categories-news.jpg`

- Expected: Thấy 3 thông báo mới nhất: tiêu đề, ngày, 2 dòng trích đoạn, bấm để đọc tiếp.
- Actual:
  - Site announcements hiện toàn văn kèm bảng lịch đào tạo dài
- Đề xuất: Giới hạn số tin, chỉ hiện tóm tắt. Banner tin quan trọng dùng Info banner.
- Việc cần làm:
  - Đặt Number of announcements = 3, hiện dạng tóm tắt
  - SCSS: thẻ tin có ngày và trích đoạn
  - Dùng Info banner cho tin có thời hạn
- Cách làm trong Moodle: Site administration > Front page settings; Boost Union > Content > Info banners.
- Tham chiếu: Learner mockup: Thông báo chung

### HOME-04 Ẩn tab quản trị của trang chủ

Priority: Could · Phạm vi: Theme · Effort: S · Ảnh: `home-00-home-en.jpg`

- Expected: Trang chủ không trông như một khóa học có tab Settings, Participants, Question banks.
- Actual:
  - Trang chủ có tab Home, Settings, Participants, Reports, Question banks, More
- Đề xuất: Ẩn tab phụ của trang chủ với người dùng không phải site admin.
- Việc cần làm:
  - SCSS ẩn secondary nav khi pagetype site-index cho role không phải admin
  - Kiểm admin vẫn vào được Front page settings qua Site administration
- Cách làm trong Moodle: SCSS theo body class pagelayout-frontpage.
- Tham chiếu: -

## DASH - Tổng quan (Dashboard)

Route Moodle: `/my/`  
Người dùng: Phòng Đào tạo, người soạn bài: mỗi ngày  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- Đang là Dashboard của người học: Upcoming events, Timeline, Calendar
- Không có số liệu quản trị: số khóa, học viên, tỉ lệ hoàn thành, bài chờ chấm
- Không có lối tắt tạo khóa, thêm người, ghi danh
- Một cột hẹp, lịch tháng chiếm nhiều chỗ

Hướng cải tiến chính:
- Số liệu tổng + lối tắt + việc cần xử lý + khóa tôi phụ trách
- Bố cục 2 cột

Ảnh: `dash-02-dashboard.jpg`

### DASH-01 Số liệu tổng quan

Priority: Must · Phạm vi: Ngoài theme · Effort: M · Ảnh: `dash-02-dashboard.jpg`

- Expected: Mở Tổng quan biết ngay: số khóa đang mở, học viên hoạt động 30 ngày, tỉ lệ hoàn thành, số bài chờ chấm.
- Actual:
  - Dashboard chỉ có Upcoming events, Timeline, Calendar của người học
  - Không có số liệu nào về khóa và học viên
- Đề xuất: Block 4 thẻ số liệu, mỗi thẻ bấm vào ra báo cáo chi tiết.
- Việc cần làm:
  - Viết block nhỏ đọc dữ liệu core: khóa visible, user lastaccess 30 ngày, course_completions, bài nộp chưa chấm
  - Giao diện thẻ theo token SHELL-02
  - Mỗi thẻ link tới báo cáo RPT-01
- Cách làm trong Moodle: Block custom (vd block_vigo_overview) dùng API core, không đổi luồng.
- Tham chiếu: TalentLMS Overview widget: active users, completion rate, training time
- Notes: Owner gợi ý: Đạt Trần. Cần chốt 4 chỉ số với Vi.

### DASH-02 Lối tắt thao tác nhanh

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `dash-02-dashboard.jpg`

- Expected: Một hàng nút cho việc hay làm: Tạo khóa, Thêm người dùng, Ghi danh phòng ban, Nhập câu hỏi Excel, Đăng thông báo.
- Actual:
  - Không có lối tắt, tạo khóa phải vào My courses hoặc Site administration
- Đề xuất: Block Text chứa nút link tới URL core, đặt làm Dashboard mặc định cho mọi Manager.
- Việc cần làm:
  - Tạo block Text với 5 nút
  - SCSS style nút
  - Đặt vào Default Dashboard, Reset Dashboard for all users
- Cách làm trong Moodle: Site administration > Appearance > Default Dashboard page + block Text.
- Tham chiếu: TalentLMS Quick Actions widget (tối đa 5 lối tắt)

### DASH-03 Việc cần xử lý

Priority: Should · Phạm vi: Ngoài theme · Effort: M · Ảnh: `dash-02-dashboard.jpg`

- Expected: Danh sách việc đang chờ mình: bài nộp chờ chấm, khóa chưa có học viên, quiz chưa có câu hỏi, khóa sắp tới hạn đóng.
- Actual:
  - Timeline chỉ hiện việc của người học, với admin báo 'No activities require action'
- Đề xuất: Block 'Việc cần xử lý' gom cảnh báo từ dữ liệu core.
- Việc cần làm:
  - Định nghĩa 4 loại cảnh báo
  - Viết chung block với DASH-01
  - Mỗi dòng có nút đi tới đúng trang xử lý
- Cách làm trong Moodle: Block custom dùng API core.
- Tham chiếu: TalentLMS Timeline widget; Canvas To Do của giảng viên

### DASH-04 Bố cục 2 cột

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `dash-01-dashboard-edit.jpg`

- Expected: Cột trái việc chính (số liệu, việc cần xử lý, khóa), cột phải lịch thu nhỏ và thông báo.
- Actual:
  - Một cột hẹp 830px, lịch tháng to chiếm phần lớn
- Đề xuất: Dùng block region phụ của Boost Union cho cột phải, lịch dạng mini.
- Việc cần làm:
  - Bật thêm block region cho layout mydashboard
  - Chuyển Calendar sang region phải
  - SCSS grid 2 cột, về 1 cột dưới 768px
- Cách làm trong Moodle: Boost Union: Blocks and regions (thêm block region cho Dashboard, kiểm tên mục trên bản đang cài). SCSS.
- Tham chiếu: Learner mockup /dashboard

## MYC - Khóa học của tôi

Route Moodle: `/my/courses.php`  
Người dùng: Người soạn bài: mỗi ngày  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- Thẻ khóa hiện % hoàn thành của chính admin, không có ý nghĩa với người soạn
- Không thấy trạng thái ẩn/hiện, số học viên, ngày cập nhật
- Muốn vào Soạn nội dung, Học viên, Báo cáo phải mở khóa rồi tìm tab
- Không lọc theo nhóm chương trình

Hướng cải tiến chính:
- Thẻ khóa cho người soạn: trạng thái + hành động nhanh
- Lọc theo nhóm chương trình

Ảnh: `myc-01-my-courses.jpg`

### MYC-01 Thẻ khóa dành cho người soạn

Priority: Must · Phạm vi: Theme · Effort: M · Ảnh: `myc-01-my-courses.jpg`

- Expected: Thẻ khóa cho biết khóa đang hiển thị hay ẩn, thuộc nhóm nào, không hiện % học của chính mình.
- Actual:
  - Thẻ hiện '44% complete' là tiến độ học của tài khoản admin
  - Không phân biệt khóa đang ẩn với khóa đang mở
- Đề xuất: Với người có quyền sửa khóa: thay thanh % bằng nhãn trạng thái (Đang hiển thị, Đang ẩn) và danh mục.
- Việc cần làm:
  - Override template thẻ khóa của block myoverview
  - Lấy trạng thái visible có sẵn trong dữ liệu khóa
  - Giữ nguyên thẻ cho học viên (nếu có)
- Cách làm trong Moodle: Child theme: override block_myoverview/view-cards.mustache và core_course/coursecard.
- Tham chiếu: Thinkific, TalentLMS: danh sách khóa có trạng thái Published/Draft

### MYC-02 Hành động nhanh trên thẻ khóa

Priority: Must · Phạm vi: Theme · Effort: S · Ảnh: `myc-01-my-courses.jpg`

- Expected: Từ thẻ khóa đi thẳng: Soạn nội dung, Cài đặt, Học viên, Báo cáo tiến độ.
- Actual:
  - Menu 3 chấm chỉ có Star, Remove from view
  - Muốn vào Học viên phải mở khóa rồi bấm tab Participants
- Đề xuất: Thêm 4 link vào menu 3 chấm, trỏ URL core theo course id.
- Việc cần làm:
  - Override template menu thẻ
  - Link: course/view.php?id=&edit=on, course/edit.php, user/index.php, report/progress
  - Chỉ hiện khi có quyền
- Cách làm trong Moodle: Child theme: override block_myoverview course action menu.
- Tham chiếu: Docebo: hành động trên dòng khóa

### MYC-03 Lọc theo nhóm chương trình

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `myc-01-my-courses.jpg`

- Expected: Lọc nhanh khóa theo nhóm Foundational, Brands, Integrated như mindmap đào tạo VIGO.
- Actual:
  - Bộ lọc chỉ theo trạng thái học (All, In progress...) của chính người xem
- Đề xuất: Tạo custom field khóa 'Nhóm chương trình', bật lọc theo custom field của block myoverview.
- Việc cần làm:
  - Tạo course custom field dạng menu
  - Bật Custom field filter trong cài đặt block myoverview
  - Điền giá trị cho khóa hiện có
- Cách làm trong Moodle: Site administration > Courses > Course custom fields; Plugins > Blocks > Course overview.
- Tham chiếu: Docebo: lọc khóa theo category và field

### MYC-04 Số học viên và tiến độ trung bình trên thẻ

Priority: Could · Phạm vi: Ngoài theme · Effort: M · Ảnh: `myc-01-my-courses.jpg`

- Expected: Thấy khóa nào đông học viên, khóa nào tiến độ thấp ngay ở danh sách.
- Actual:
  - Thẻ không có số liệu học viên
- Đề xuất: Thêm số học viên và % hoàn thành trung bình vào thẻ khóa cho người soạn.
- Việc cần làm:
  - Cần web service nhỏ trả số liệu theo danh sách khóa
  - Gắn vào template MYC-01
- Cách làm trong Moodle: Template override + web service custom nhỏ.
- Tham chiếu: TalentLMS Courses' progress status

## CAT - Quản lý danh mục và khóa

Route Moodle: `/course/management.php`  
Người dùng: Phòng Đào tạo: hàng tuần  
Ưu tiên màn: Should

Vấn đề lớn nhất:
- Hai khung hẹp, chữ nhỏ, khung khóa chỉ hiện tên
- Icon hành động không có nhãn (mắt, mũi tên, 3 chấm, mũ)
- Sắp xếp, di chuyển bằng dropdown và nút xám ở cuối khung
- Nút Create new course xám, không nổi bật

Hướng cải tiến chính:
- Cây danh mục làm bộ lọc, bảng khóa full width có cột trạng thái, học viên
- Nhãn chữ cho hành động, nút tạo khóa primary

Ảnh: `cat-01-management.jpg`, `cat-02-category-index.jpg`

### CAT-01 Nhãn chữ cho hành động, nút tạo khóa nổi bật

Priority: Should · Phạm vi: Theme · Effort: S · Ảnh: `cat-01-management.jpg`

- Expected: Hiểu mỗi nút làm gì mà không phải rê chuột thử. Nút Tạo khóa mới dễ thấy nhất.
- Actual:
  - Icon mắt, mũi tên, 3 chấm, mũ tốt nghiệp không có nhãn
  - Create new category, Create new course là nút xám
- Đề xuất: Thêm tooltip/nhãn chữ, đổi số khóa thành '6 khóa', nút tạo là primary.
- Việc cần làm:
  - SCSS cho nút tạo
  - Override renderer management để thêm nhãn
  - Đổi chuỗi bằng Language customisation
- Cách làm trong Moodle: Child theme: override core_course_management_renderer (PHP) + SCSS.
- Tham chiếu: Docebo course list

### CAT-02 Bố cục: cây danh mục trái, bảng khóa phải

Priority: Should · Phạm vi: Theme · Effort: L · Ảnh: `cat-01-management.jpg`

- Expected: Bấm danh mục bên trái để lọc, bên phải là bảng khóa đủ thông tin: ảnh, tên, mã, trạng thái, học viên, cập nhật, hành động.
- Actual:
  - Hai khung bằng nhau, khung khóa chỉ hiện tên
  - Sắp xếp và di chuyển bằng dropdown ở cuối khung
- Đề xuất: Đổi tỉ lệ 30/70, bảng khóa thêm cột, thao tác di chuyển gom vào thanh 'Với khóa đã chọn'.
- Việc cần làm:
  - Override renderer management
  - Thêm cột trạng thái, số học viên
  - Giữ nguyên URL và hành động core
- Cách làm trong Moodle: Child theme: override core_course_management_renderer.
- Tham chiếu: Docebo, TalentLMS: danh sách khóa dạng bảng có lọc

### CAT-03 Sửa tên danh mục sai chính tả

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `cat-02-category-index.jpg`

- Expected: Tên danh mục chuẩn, đồng bộ với learner portal.
- Actual:
  - 'External Tranning', 'Internal Tranning', 'Rejuran Internal Trainning'
- Đề xuất: Sửa dữ liệu, không cần dev.
- Việc cần làm:
  - Đổi thành Training
  - Báo Duy nếu learner có map theo tên
- Cách làm trong Moodle: Sửa trực tiếp trong Manage courses and categories.
- Tham chiếu: -
- Notes: Dữ liệu, không phải UI. Phòng Đào tạo tự sửa.

## CSET - Tạo và cài đặt khóa

Route Moodle: `/course/edit.php`  
Người dùng: Phòng Đào tạo: khi mở khóa mới  
Ưu tiên màn: Should

Vấn đề lớn nhất:
- Form 1 cột, 9 nhóm, trường kỹ thuật lẫn trường cần điền
- Nhóm ít dùng (Tags, AI tools, Groups, Files) hiện ngang hàng
- Không biết ảnh và mô tả sẽ hiện thế nào trên learner portal
- Mỗi khóa mới phải chỉnh lại các mặc định (completion, format)

Hướng cải tiến chính:
- Mặc định khóa theo chuẩn VIGO, form chia Thông tin chính và Nâng cao
- Xem trước thẻ khóa

Ảnh: `cset-01-settings-top.jpg`, `cset-02-settings-bottom.jpg`

### CSET-01 Mặc định khóa mới theo chuẩn VIGO

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `cset-02-settings-bottom.jpg`

- Expected: Tạo khóa mới chỉ cần điền tên, danh mục, ảnh, mô tả. Các cài đặt kỹ thuật đã đúng sẵn.
- Actual:
  - Mỗi khóa phải tự bật Completion tracking, chọn format, số phần
  - Dễ quên, khóa tạo ra không đồng nhất
- Đề xuất: Đặt Course default settings: format, số section, completion tracking bật, hiện điều kiện hoàn thành.
- Việc cần làm:
  - Chốt bộ mặc định với Vi
  - Nhập vào Course default settings
  - Ghi vào guide S1
- Cách làm trong Moodle: Site administration > Courses > Default settings > Course default settings.
- Tham chiếu: Thinkific: khóa mới có cấu trúc mặc định

### CSET-02 Form chia Thông tin chính và Nâng cao

Priority: Should · Phạm vi: Theme · Effort: M · Ảnh: `cset-01-settings-top.jpg`

- Expected: Phần đầu form chỉ có thứ cần điền: tên, tên ngắn, danh mục, ảnh, mô tả, ngày bắt đầu. Phần còn lại thu gọn.
- Actual:
  - 9 nhóm xếp dọc, Course format, Appearance, Files and uploads, Groups, Tags, AI tools ngang hàng
  - Ảnh khóa nằm giữa form, dưới editor mô tả
- Đề xuất: Gom thành 2 khối, khối Nâng cao thu gọn. Ẩn Tags, AI tools nếu không dùng.
- Việc cần làm:
  - Tắt Tags, AI placements ở site nếu VIGO không dùng
  - JS trong theme gom nhóm và đưa ảnh lên cạnh tên
  - Không đổi tên field, không đổi submit
- Cách làm trong Moodle: Tắt tính năng ở Advanced features; AMD JS trong child theme cho trang course-edit.
- Tham chiếu: Thinkific, LearnWorlds: tạo khóa chỉ hỏi tên rồi vào builder
- Notes: JS sắp xếp form có rủi ro khi nâng cấp Moodle. Cần Thiện duyệt.

### CSET-03 Xem trước thẻ khóa như học viên thấy

Priority: Could · Phạm vi: Theme · Effort: M · Ảnh: `cset-01-settings-top.jpg`

- Expected: Khi chọn ảnh và viết mô tả, thấy ngay thẻ khóa sẽ hiện thế nào trên learner portal.
- Actual:
  - Không có xem trước, phải mở learner portal để kiểm
- Đề xuất: Ô xem trước thẻ khóa bên phải form, cập nhật khi đổi tên, ảnh, mô tả.
- Việc cần làm:
  - AMD JS đọc giá trị field, render thẻ theo style learner
  - Cảnh báo khi thiếu ảnh hoặc mô tả
- Cách làm trong Moodle: AMD JS trong child theme.
- Tham chiếu: Thinkific: course card preview

## CED - Soạn nội dung khóa

Route Moodle: `/course/view.php (Edit mode)`  
Người dùng: Người soạn bài: mỗi ngày, màn quan trọng nhất  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- Mỗi dòng chỉ có icon và tên, không thấy loại bài, điều kiện hoàn thành, điểm đạt
- Điều kiện truy cập hiện thành hộp xám dài, đẩy vỡ nhịp danh sách
- Nút Mark as done/Done của chính admin nằm cạnh bài, dễ hiểu nhầm là cấu hình
- Nút + thêm nội dung nhỏ, phải qua 2 bước mới mở bảng chọn
- Không có tóm tắt phần (số bài, số quiz), không có nút Xem như học viên

Hướng cải tiến chính:
- Dòng bài có nhãn loại + chip hoàn thành, chip điều kiện
- Nút Thêm nội dung rõ ràng, kéo thả file tạo bài
- Thanh công cụ khóa: Xem như học viên, Học viên, Báo cáo

Ảnh: `ced-02-section.jpg`, `ced-03-restriction.jpg`

### CED-01 Dòng bài học có nhãn loại và chip hoàn thành

Priority: Must · Phạm vi: Theme · Effort: M · Ảnh: `ced-02-section.jpg`

- Expected: Nhìn danh sách bài biết ngay: bài nào là video, tài liệu, bài kiểm tra; điều kiện hoàn thành là gì; điểm đạt bao nhiêu.
- Actual:
  - Mỗi dòng chỉ có icon nhỏ và tên
  - Điều kiện hoàn thành chỉ thấy khi mở form
  - Video Drive là Page, trông giống bài đọc
- Đề xuất: Thêm nhãn loại bằng chữ và chip: 'Xem bài', 'Đạt 80%', 'Tự đánh dấu'.
- Việc cần làm:
  - Override template dòng activity của course format
  - Dữ liệu completion có sẵn trong cm info
  - Nhãn Video dựa trên quy ước ở ACT-02
- Cách làm trong Moodle: Child theme: override core_courseformat/local/content/cm*.mustache.
- Tham chiếu: TalentLMS, Thinkific: outline có loại unit và rule hoàn thành

### CED-02 Điều kiện truy cập dạng chip gọn

Priority: Must · Phạm vi: Theme · Effort: S · Ảnh: `ced-03-restriction.jpg`

- Expected: Thấy bài bị khóa bởi điều kiện gì trong một dòng ngắn, không làm vỡ danh sách.
- Actual:
  - Hộp xám to 'Not available unless: The activity ... is marked complete' + Edit restrictions chiếm 2 dòng
- Đề xuất: Chip ổ khóa 'Mở sau: Bài 1 - Video Drive', bấm để xem chi tiết và sửa.
- Việc cần làm:
  - Override template availability info trong chế độ soạn
  - Giữ link Edit restrictions
- Cách làm trong Moodle: Child theme: override core_courseformat availability template + SCSS.
- Tham chiếu: Canvas Modules: prerequisites hiện gọn ở đầu module

### CED-03 Ẩn nút Mark as done của admin khi soạn

Priority: Must · Phạm vi: Theme · Effort: S · Ảnh: `ced-02-section.jpg`

- Expected: Ở chế độ soạn, mọi thứ trên dòng là cấu hình bài, không lẫn trạng thái học của chính mình.
- Actual:
  - Nút 'Mark as done', 'Done', 'To do' của tài khoản admin nằm cạnh bài
  - Người soạn dễ tưởng đó là cài đặt hoàn thành cho học viên
- Đề xuất: Ẩn nút trạng thái cá nhân khi Edit mode bật, thay bằng chip điều kiện ở CED-01.
- Việc cần làm:
  - SCSS: body.editing ẩn activity-completion của người xem
- Cách làm trong Moodle: SCSS trong Boost Union.
- Tham chiếu: -

### CED-04 Nút Thêm nội dung rõ ràng

Priority: Must · Phạm vi: Theme · Effort: S · Ảnh: `ced-02-section.jpg`

- Expected: Cuối mỗi phần có nút 'Thêm bài học' to, một lần bấm mở bảng chọn.
- Actual:
  - Nút + nhỏ nằm giữa đường kẻ đứt
  - Bấm ra menu 2 dòng (Activity or resource, Subsection) rồi mới mở bảng chọn
- Đề xuất: Nút outline full width 'Thêm bài học' mở thẳng bảng chọn, 'Thêm phần con' là link nhỏ bên cạnh.
- Việc cần làm:
  - Override template add activity control
  - SCSS nút
- Cách làm trong Moodle: Child theme: override core_courseformat/local/content/divider + SCSS.
- Tham chiếu: TalentLMS: nút Add nổi bật trong outline

### CED-05 Kéo thả file để tạo nhiều bài tài liệu

Priority: Should · Phạm vi: Theme · Effort: S · Ảnh: `ced-02-section.jpg`

- Expected: Kéo 5 file PDF/PPTX vào một phần là có 5 bài tài liệu, đặt tên theo file.
- Actual:
  - Moodle đã hỗ trợ kéo thả file vào trang khóa, nhưng không có gợi ý nào nên người soạn không biết
  - Đang tạo từng File một qua form
- Đề xuất: Hiện vùng gợi ý 'Kéo thả file vào đây để tạo bài' ở mỗi phần khi Edit mode.
- Việc cần làm:
  - SCSS/template thêm vùng gợi ý
  - Kiểm giới hạn dung lượng upload
  - Ghi vào guide S3
- Cách làm trong Moodle: Tính năng core (drag and drop upload) + template/SCSS gợi ý.
- Tham chiếu: Thinkific Bulk uploader: mỗi file thành 1 bài; TalentLMS kéo thả nhiều file

### CED-06 Tóm tắt ở đầu mỗi phần

Priority: Should · Phạm vi: Theme · Effort: M · Ảnh: `ced-02-section.jpg`

- Expected: Đầu mỗi phần có: số bài, số bài kiểm tra, có điều kiện mở hay không, đang ẩn hay hiện.
- Actual:
  - Đầu phần chỉ có tên và menu 3 chấm
- Đề xuất: Dòng tóm tắt dưới tên phần.
- Việc cần làm:
  - Override template section header
  - Đếm từ danh sách cm trong section
- Cách làm trong Moodle: Child theme: override core_courseformat section templates.
- Tham chiếu: Thinkific chapter: số lesson

### CED-07 Thanh công cụ khóa: Xem như học viên

Priority: Should · Phạm vi: Theme · Effort: S · Ảnh: `ced-01-course-top.jpg`

- Expected: Một nút 'Xem như học viên' ngay đầu trang khóa, cạnh Cài đặt, Học viên, Báo cáo.
- Actual:
  - Switch role to... nằm trong menu tài khoản góc phải
  - Bulk actions là chữ nhỏ góc phải
- Đề xuất: Hàng nút đầu trang khóa: Xem như học viên, Sửa hàng loạt, Cài đặt hoàn thành.
- Việc cần làm:
  - Override header khóa
  - Link course/switchrole.php với role Student
  - Giữ Bulk actions core
- Cách làm trong Moodle: Child theme: override course header template.
- Tham chiếu: Canvas Student View; Thinkific Preview

## ACT - Thêm và sửa bài học

Route Moodle: `/course/modedit.php`  
Người dùng: Người soạn bài: mỗi ngày  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- Bảng chọn có 20 loại, tên tiếng Anh, không có loại 'Video Drive'
- Form dài: Page 9 nhóm, 48 dòng cài đặt, cao 1.800px
- Hoàn thành và Điều kiện truy cập nằm cuối, thu gọn
- Nhóm không dùng (Tags, Competencies, AI tools) vẫn hiện
- Nút Lưu ở đáy trang dài

Hướng cải tiến chính:
- Bảng chọn theo nghiệp vụ VIGO
- Form: Nội dung, Hoàn thành, Điều kiện lên trước, phần còn lại thu gọn
- Thanh lưu cố định

Ảnh: `act-02-chooser-all.jpg`, `act-03-page-form.jpg`, `act-04-restrict-completion.jpg`

### ACT-01 Bảng chọn loại bài theo nghiệp vụ VIGO

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `act-02-chooser-all.jpg`

- Expected: Bảng chọn chỉ có các loại VIGO dùng, tên tiếng Việt dễ hiểu: Bài video, Tài liệu, Bài đọc, Bài kiểm tra, Bài nộp, Khảo sát, Thông báo.
- Actual:
  - Tab All có 20 loại tên tiếng Anh (Wiki, Workshop, Database, IMS content package...)
  - Starred có 8 loại, chưa có mô tả khi nào dùng
- Đề xuất: Tắt module không dùng, đặt Starred mặc định, đổi tên và mô tả 1 dòng.
- Việc cần làm:
  - Tắt Wiki, Workshop, Database, IMS, SCORM, Choice nếu VIGO không dùng
  - Đổi tên module bằng Language customisation
  - Đặt tab mặc định của bảng chọn
- Cách làm trong Moodle: Site administration > Plugins > Activity modules > Manage activities; Language customisation; Course > Activity chooser settings.
- Tham chiếu: TalentLMS: Add > Content, Video, Presentation, Test, Survey
- Notes: Danh sách module dùng theo catalog Must/Should trong Project instructions.

### ACT-02 Loại bài 'Video Drive' rõ ràng

Priority: Should · Phạm vi: Ngoài theme · Effort: L · Ảnh: `act-03-page-form.jpg`

- Expected: Người soạn chọn 'Bài video', dán link Drive, thấy xem trước video. Trên danh sách bài hiện nhãn Video.
- Actual:
  - Không có loại Video: phải tạo Page rồi bấm nút VideoShow trong editor
  - Editor hiện khung Drive, người soạn khó kiểm link đúng chưa
  - Learner backlog đang giả định module drivevideo riêng
- Đề xuất: Chọn 1 trong 2 hướng: (A) module mod_drivevideo riêng có trường link + xem trước; (B) giữ Page, thêm preset 'Bài video' trong chooser và đánh dấu bằng ID number/custom field.
- Việc cần làm:
  - Chốt hướng với Thiện, Đạt Trần, Duy
  - Nếu A: form 3 trường (tên, link Drive, thời lượng)
  - Nếu B: quy ước đặt và cách learner nhận diện
- Cách làm trong Moodle: A: plugin activity custom. B: cấu hình + quy ước.
- Tham chiếu: TalentLMS Video unit: dán URL hoặc upload
- Notes: Điểm chưa chốt: video Drive là module riêng hay Page + VideoShow. Ảnh hưởng learner (LEARN) và completion.

### ACT-03 Tắt tính năng không dùng để form gọn

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `act-03-page-form.jpg`

- Expected: Form bài học không có nhóm VIGO không dùng.
- Actual:
  - Form Page có Tags, Competencies, AI tools, Set reminder in Timeline
  - Form Page 9 nhóm, 48 dòng cài đặt
- Đề xuất: Tắt Competencies, Tags, AI placements ở site nếu không dùng, các nhóm tự biến mất.
- Việc cần làm:
  - Chốt danh sách tính năng tắt
  - Tắt ở Advanced features, Competencies settings, AI placements
  - Kiểm lại form Page, Quiz, File
- Cách làm trong Moodle: Site administration > Advanced features; Competencies; AI > AI placements.
- Tham chiếu: -

### ACT-04 Sắp lại form: Hoàn thành và Điều kiện lên trước

Priority: Should · Phạm vi: Theme · Effort: M · Ảnh: `act-04-restrict-completion.jpg`

- Expected: Sau phần Nội dung là ngay phần 'Khi nào bài được tính là xong' và 'Ai được mở bài', đang mở sẵn.
- Actual:
  - Restrict access và Completion conditions nằm cuối form, thu gọn
  - Người soạn hay quên thiết lập
- Đề xuất: Đưa 2 nhóm lên sau Content, mở sẵn; Appearance, Common module settings thu gọn cuối.
- Việc cần làm:
  - AMD JS di chuyển fieldset trên trang modedit
  - Không đổi tên field, không đổi submit
  - Áp cho Page, File, Quiz, Assignment
- Cách làm trong Moodle: AMD JS trong child theme cho pagetype mod-*-mod.
- Tham chiếu: TalentLMS: Unit options cạnh nội dung
- Notes: JS sửa DOM form có rủi ro khi nâng cấp. Cần Thiện duyệt.

### ACT-05 Thanh Lưu cố định đáy màn hình

Priority: Must · Phạm vi: Theme · Effort: S · Ảnh: `act-04-restrict-completion.jpg`

- Expected: Đang ở giữa form dài vẫn bấm được Lưu và Hủy.
- Actual:
  - Save and return to course, Save and display, Cancel nằm cuối form cao 1.800px (Quiz cao hơn)
- Đề xuất: Thanh nút sticky đáy cho mọi form chỉnh sửa.
- Việc cần làm:
  - SCSS position sticky cho nhóm nút form
  - Kiểm mobile
- Cách làm trong Moodle: SCSS trong Boost Union.
- Tham chiếu: Docebo, TalentLMS: nút Save cố định

### ACT-06 Mặc định hoàn thành theo loại bài

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `act-04-restrict-completion.jpg`

- Expected: Tạo bài là đã có điều kiện hoàn thành đúng: Video và Bài đọc = xem bài, Bài kiểm tra = đạt điểm, Tài liệu = xem.
- Actual:
  - Mỗi bài phải tự chọn Add requirements và tick
  - Chọn sai làm tiến độ học viên lệch
- Đề xuất: Đặt Default activity completion ở cấp site cho từng loại.
- Việc cần làm:
  - Chốt rule với Vi (gắn với điểm chưa chốt rule pass)
  - Cấu hình cho Page, File, URL, Quiz, Assignment
  - Dùng Bulk edit completion cho khóa cũ
- Cách làm trong Moodle: Site administration > Courses > Default activity completion; Course > Course completion > Bulk edit activity completion.
- Tham chiếu: TalentLMS: completion method theo unit

### ACT-07 Điều kiện truy cập nhanh 'Mở sau bài trước'

Priority: Could · Phạm vi: Theme · Effort: M · Ảnh: `act-04-restrict-completion.jpg`

- Expected: Một nút để khóa bài này cho tới khi học xong bài liền trước, không phải chọn qua nhiều bước.
- Actual:
  - Add restriction mở hộp chọn 6 loại, chọn Activity completion, chọn bài, chọn trạng thái
- Đề xuất: Thêm nút preset 'Mở sau bài trước' tự điền điều kiện core.
- Việc cần làm:
  - AMD JS gọi lại form availability core với giá trị điền sẵn
  - Lưu đúng JSON availability chuẩn
- Cách làm trong Moodle: AMD JS trong child theme.
- Tham chiếu: Canvas: module prerequisites; TalentLMS: sequential order
- Notes: Phụ thuộc điểm chưa chốt: có khóa bài tiếp theo không.

## QUIZ - Bài kiểm tra và câu hỏi

Route Moodle: `/course/modedit.php (quiz), /mod/quiz/edit.php, /local/quizexcel/import.php`  
Người dùng: Người soạn bài: mỗi tuần  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- Form cài đặt quiz 16 nhóm, 185 dòng cài đặt. 6 thông số cần chỉnh nằm rải ở 4 nhóm
- Trang câu hỏi: Maximum grade 10 và Total marks 3 đặt cạnh nhau dễ nhầm
- Không thấy loại câu hỏi bằng chữ, nút Import Excel lẫn với Repaginate
- Trang import: không hướng dẫn cột, nút quay lại nằm dưới chữ Required
- Kết quả: khung lọc to đứng trước bảng, không có tóm tắt

Hướng cải tiến chính:
- Mặc định quiz theo rule VIGO, trường ít dùng vào Show more
- Trang câu hỏi rõ loại, rõ điểm, import Excel là nút chính
- Import 3 bước có xem trước lỗi

Ảnh: `quiz-01-settings.jpg`, `quiz-02-questions.jpg`, `quiz-03-import-excel.jpg`, `quiz-05-results.jpg`

### QUIZ-01 Mặc định quiz theo rule VIGO, trường ít dùng vào Show more

Priority: Must · Phạm vi: Cấu hình · Effort: S · Ảnh: `quiz-01-settings.jpg`

- Expected: Form quiz chỉ hiện các trường cần chỉnh: mở/đóng, thời gian làm, điểm đạt, số lần làm, cách tính điểm, xem lại đáp án.
- Actual:
  - 16 nhóm, 185 dòng cài đặt, có Safe Exam Browser, Extra restrictions, Overall feedback
  - 6 trường cần dùng nằm ở Timing, Grade, Review options
- Đề xuất: Đặt giá trị mặc định và đánh dấu Advanced cho trường ít dùng để vào 'Show more'.
- Việc cần làm:
  - Chốt mặc định: số lần làm, điểm đạt, cách tính điểm, review options
  - Đặt ở Quiz settings, tick Advanced cho trường ít dùng
  - Tắt Safe Exam Browser nếu không dùng
- Cách làm trong Moodle: Site administration > Plugins > Activity modules > Quiz > Quiz settings (mỗi setting có ô Advanced).
- Tham chiếu: TalentLMS Test options: ít trường, nhóm rõ
- Notes: Phụ thuộc điểm chưa chốt rule pass, số lần làm lại.

### QUIZ-02 Trang câu hỏi: rõ loại, nút import là nút chính

Priority: Must · Phạm vi: Theme · Effort: M · Ảnh: `quiz-02-questions.jpg`

- Expected: Danh sách câu hỏi cho thấy loại câu (Chọn một, Chọn nhiều, Đúng/Sai) và điểm. Nút 'Thêm câu hỏi từ Excel' dễ thấy.
- Actual:
  - Loại câu chỉ là icon nhỏ
  - Import Excel, Download Excel Template nằm cùng hàng nút xám với Repaginate, Select multiple items
  - Cột 'Always latest' mang tính kỹ thuật
- Đề xuất: Chip loại câu hỏi, cụm nút import thành nút primary cạnh Add.
- Việc cần làm:
  - Override template trang edit quiz
  - Đổi nhãn 'Always latest' bằng Language customisation hoặc ẩn cho role soạn bài
  - Nút import thuộc local_quizexcel: đổi style
- Cách làm trong Moodle: Child theme: override mod_quiz edit templates; local_quizexcel (team tự sở hữu).
- Tham chiếu: TalentLMS Test unit: list câu có loại và điểm

### QUIZ-03 Làm rõ thang điểm quiz và tổng điểm câu hỏi

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `quiz-02-questions.jpg`

- Expected: Hiểu ngay bài kiểm tra chấm thang 10, tổng điểm câu là 3 sẽ được quy đổi.
- Actual:
  - 'Maximum grade 10.00' và 'Total of marks: 3.00' đặt cạnh nhau, không giải thích
- Đề xuất: Đổi nhãn 'Thang điểm bài kiểm tra' và thêm dòng giải thích quy đổi.
- Việc cần làm:
  - Language customisation cho 2 chuỗi
  - Thêm help text ngắn
- Cách làm trong Moodle: Language customisation.
- Tham chiếu: -

### QUIZ-04 Import Excel 3 bước có xem trước lỗi

Priority: Must · Phạm vi: Ngoài theme · Effort: M · Ảnh: `quiz-03-import-excel.jpg`

- Expected: Tải file mẫu, chọn file, xem trước từng câu và lỗi theo dòng, rồi mới xác nhận.
- Actual:
  - Trang chỉ có ô chọn file và Validate / Preview
  - Không mô tả cột bắt buộc ngay trên trang
  - Lỗi chung chung (đã ghi S4-03 ở file review trước)
  - Nút 'Quay lại Quiz Questions' xám nằm dưới chữ Required
- Đề xuất: Stepper 3 bước, mô tả cột và link tải mẫu ở bước 1, bảng xem trước có cột lỗi.
- Việc cần làm:
  - Cập nhật giao diện plugin local_quizexcel
  - Thông báo lỗi theo dòng và cột
  - Nút quay lại thành link ở breadcrumb
- Cách làm trong Moodle: Plugin local_quizexcel (team tự làm).
- Tham chiếu: TalentLMS, Docebo import: template + preview + báo lỗi theo dòng
- Notes: Owner: Đạt Trần.

### QUIZ-05 Kết quả quiz có tóm tắt

Priority: Should · Phạm vi: Theme · Effort: M · Ảnh: `quiz-05-results.jpg`

- Expected: Mở kết quả thấy ngay: bao nhiêu người đã làm, bao nhiêu đạt, điểm trung bình, câu sai nhiều nhất.
- Actual:
  - Khung 'What to include in the report' to đứng trước bảng
  - Không có tóm tắt, câu sai nhiều nằm ở báo cáo Statistics riêng
- Đề xuất: Thẻ tóm tắt đầu trang, khung lọc thu gọn mặc định, link sang Statistics.
- Việc cần làm:
  - SCSS thu gọn khung lọc
  - Override template report overview, thêm thẻ tóm tắt
- Cách làm trong Moodle: Child theme: override quiz_overview renderer + SCSS.
- Tham chiếu: TalentLMS Test report: tóm tắt pass rate

### QUIZ-06 Ngân hàng câu hỏi dễ hiểu

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `quiz-04-question-banks.jpg`

- Expected: Biết câu hỏi đang nằm ở đâu, dùng lại cho quiz khác thế nào.
- Actual:
  - Moodle 5.x tách Question banks theo khóa và theo quiz
  - Khóa QA: 'This course doesn't have any question banks yet', câu hỏi nằm trong bank riêng của quiz, không dùng lại được
- Đề xuất: Hướng dẫn ngắn đầu trang, mỗi khóa tạo sẵn 1 bank dùng chung.
- Việc cần làm:
  - Chốt quy ước bank theo khóa hay theo chủ đề
  - Thêm hướng dẫn bằng Language customisation hoặc block
  - Ghi vào guide S4
- Cách làm trong Moodle: Cấu hình + nội dung hướng dẫn.
- Tham chiếu: -
- Notes: Điểm chưa chốt: tổ chức question bank.

## COMP - Điều kiện hoàn thành khóa

Route Moodle: `/course/completion.php`  
Người dùng: Phòng Đào tạo: khi mở khóa  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- 9 nhóm điều kiện thu gọn, tên kỹ thuật
- Không có câu tóm tắt 'Học viên hoàn thành khóa khi...'
- Điều kiện ít dùng (Unenrolment, Enrolment duration) ngang hàng điều kiện chính

Hướng cải tiến chính:
- Câu tóm tắt quy tắc ở đầu trang, điều kiện chính mở sẵn
- Link nhanh sang mặc định và sửa hàng loạt hoàn thành bài

Ảnh: `comp-01-course-completion.jpg`

### COMP-01 Câu tóm tắt quy tắc hoàn thành khóa

Priority: Must · Phạm vi: Theme · Effort: M · Ảnh: `comp-01-course-completion.jpg`

- Expected: Đầu trang có một câu: 'Học viên hoàn thành khóa khi: hoàn thành 12 bài, đạt Kiểm tra cuối khóa'.
- Actual:
  - 9 nhóm thu gọn, phải mở từng nhóm mới biết đã chọn gì
- Đề xuất: Khối tóm tắt đọc từ lựa chọn trên form, cập nhật khi tick. Nhóm đang có điều kiện mở sẵn.
- Việc cần làm:
  - AMD JS đọc checkbox và select trên form, dựng câu tóm tắt
  - Mở sẵn fieldset có giá trị
- Cách làm trong Moodle: AMD JS trong child theme cho trang course-completion.
- Tham chiếu: TalentLMS Rules and paths: rule viết thành câu

### COMP-02 Đưa điều kiện ít dùng vào Nâng cao

Priority: Should · Phạm vi: Theme · Effort: S · Ảnh: `comp-01-course-completion.jpg`

- Expected: Chỉ thấy điều kiện VIGO dùng: hoàn thành bài, điểm khóa. Phần khác để riêng.
- Actual:
  - Unenrolment, Enrolment duration, Completion of other courses, Manual completion by others ngang hàng
- Đề xuất: Gom 4 điều kiện ít dùng vào khối 'Điều kiện khác' thu gọn.
- Việc cần làm:
  - AMD JS/SCSS gom fieldset
- Cách làm trong Moodle: Child theme.
- Tham chiếu: -

### COMP-03 Lối vào nhanh cho mặc định và sửa hàng loạt

Priority: Should · Phạm vi: Theme · Effort: S · Ảnh: `comp-01-course-completion.jpg`

- Expected: Từ trang hoàn thành khóa vào được 'Mặc định hoàn thành bài' và 'Sửa hàng loạt' mà không phải tìm.
- Actual:
  - Trang Course completion settings có dropdown ẩn chứa Default activity completion, Bulk edit
- Đề xuất: Đổi dropdown thành tab ngang 3 mục.
- Việc cần làm:
  - SCSS/template hiện tertiary navigation dạng tab
- Cách làm trong Moodle: Child theme: override tertiary navigation template.
- Tham chiếu: -

## ENR - Học viên của khóa và ghi danh

Route Moodle: `/user/index.php, /enrol/instances.php`  
Người dùng: Phòng Đào tạo: hàng tuần  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- 2 hàng chữ cái A-Z chiếm chỗ, ít ai dùng
- Không có cột tiến độ, phòng ban, ngày ghi danh
- Hộp Enrol users có 'Select cohorts' (ghi danh 1 lần) dễ nhầm với đồng bộ phòng ban
- Trang Enrolment methods chỉ có icon, không nhãn

Hướng cải tiến chính:
- Bỏ thanh chữ cái, báo cáo học viên có tiến độ
- Giải thích rõ 2 cách ghi danh phòng ban

Ảnh: `enr-01-participants.jpg`, `enr-02-enrol-modal.jpg`, `enr-03-enrol-methods.jpg`

### ENR-01 Bỏ thanh chữ cái A-Z

Priority: Must · Phạm vi: Theme · Effort: S · Ảnh: `enr-01-participants.jpg`

- Expected: Tìm học viên bằng ô tìm kiếm, không phải 2 hàng chữ cái.
- Actual:
  - 2 hàng First name, Last name A-Z chiếm khoảng 100px trên cùng bảng
- Đề xuất: Ẩn initials bar, giữ ô tìm và bộ lọc.
- Việc cần làm:
  - SCSS ẩn .initialbar trên trang participants và báo cáo
- Cách làm trong Moodle: SCSS trong Boost Union.
- Tham chiếu: Docebo, TalentLMS: chỉ có search + filter

### ENR-02 Giải thích 2 cách ghi danh phòng ban

Priority: Must · Phạm vi: Theme · Effort: S · Ảnh: `enr-02-enrol-modal.jpg`

- Expected: Khi ghi danh theo phòng ban, biết rõ là ghi 1 lần hay tự động thêm người mới vào phòng ban sau này.
- Actual:
  - Hộp Enrol users có 'Select cohorts': chỉ ghi danh người đang có trong cohort, người mới vào sau không tự có
  - Cohort sync nằm ở Enrolment methods, không có liên kết từ hộp này
- Đề xuất: Thêm dòng giải thích dưới 'Select cohorts' và link 'Đồng bộ tự động theo phòng ban'.
- Việc cần làm:
  - Language customisation cho nhãn và help
  - Override template hộp enrol manual để thêm link
  - Ghi vào guide S6
- Cách làm trong Moodle: Language customisation + template override enrol_manual.
- Tham chiếu: Docebo: enroll by group/branch tự động
- Notes: Điểm chưa chốt: phân quyền phòng ban dùng Cohort sync, Group hay role Category.

### ENR-03 Báo cáo học viên của khóa có tiến độ

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `enr-01-participants.jpg`

- Expected: Danh sách học viên có: phòng ban, ngày ghi danh, % hoàn thành, trạng thái hoàn thành khóa, lần truy cập cuối. Xuất Excel được.
- Actual:
  - Participants chỉ có tên, email, vai trò, nhóm, lần truy cập, trạng thái
  - Vai trò hiện 'Student, Course creator' khó đọc
- Đề xuất: Tạo custom report từ nguồn Course participants, gắn link vào tab Học viên.
- Việc cần làm:
  - Dựng report trong Report builder
  - Cột: họ tên, phòng ban, ngày ghi danh, hoàn thành, ngày hoàn thành, truy cập cuối
  - Thêm link vào tab khóa (SHELL-05)
- Cách làm trong Moodle: Report builder (core) + link.
- Tham chiếu: Docebo enrollment list; TalentLMS course users

### ENR-04 Trang cách ghi danh có nhãn

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `enr-03-enrol-methods.jpg`

- Expected: Thấy rõ từng cách ghi danh đang bật hay tắt, sửa gì, xóa gì.
- Actual:
  - Bảng Enrolment methods chỉ có icon (thùng rác, mắt, người, bút)
  - Guest access, Self enrolment hiện dù VIGO không dùng
- Đề xuất: Tắt plugin ghi danh không dùng ở site, thêm nhãn chữ cho icon.
- Việc cần làm:
  - Tắt Guest access, Self enrolment ở Manage enrol plugins nếu không dùng
  - SCSS hiện title của icon
- Cách làm trong Moodle: Site administration > Plugins > Enrolments > Manage enrol plugins; SCSS.
- Tham chiếu: -

## USER - Người dùng

Route Moodle: `/admin/user.php, /user/editadvanced.php`  
Người dùng: Phòng Đào tạo: khi có nhân sự mới  
Ưu tiên màn: Should

Vấn đề lớn nhất:
- Nằm sâu trong Site administration > Users
- Danh sách không có phòng ban, vai trò
- Form thêm người cao 2.400px, 42 dòng cài đặt (MoodleNet, Interests, Additional names...)

Hướng cải tiến chính:
- Form thêm người rút gọn, danh sách có phòng ban
- Import CSV có file mẫu

Ảnh: `user-01-browse.jpg`, `user-02-add-user.jpg`

### USER-01 Form thêm người dùng rút gọn

Priority: Should · Phạm vi: Theme · Effort: S · Ảnh: `user-02-add-user.jpg`

- Expected: Thêm nhân viên mới chỉ cần: họ, tên, email, tên đăng nhập, phòng ban, cách tạo mật khẩu.
- Actual:
  - Form cao 2.400px, 42 dòng cài đặt: MoodleNet profile, Interests, Additional names, Optional...
- Đề xuất: Ẩn nhóm không dùng, đưa phòng ban (custom profile field) lên nhóm đầu.
- Việc cần làm:
  - Tắt MoodleNet nếu không dùng
  - Ẩn nhóm Additional names, Interests, Optional bằng SCSS theo pagetype
  - Tạo custom profile field Phòng ban nếu chốt hướng này
- Cách làm trong Moodle: Cấu hình site + SCSS.
- Tham chiếu: TalentLMS Add user: form ngắn

### USER-02 Danh sách người dùng có phòng ban, vai trò

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `user-01-browse.jpg`

- Expected: Lọc người dùng theo phòng ban, trạng thái; thấy phòng ban trên từng dòng.
- Actual:
  - Bảng chỉ có tên, email, lần truy cập
- Đề xuất: Thêm cột qua Show user identity (custom profile field) hoặc report riêng.
- Việc cần làm:
  - Thêm field vào Show user identity
  - Kiểm bộ lọc Filters của Browse list of users
- Cách làm trong Moodle: Site administration > Users > Permissions > User policies > Show user identity.
- Tham chiếu: Docebo users list theo branch
- Notes: Phụ thuộc cách lưu phòng ban (cohort hay profile field).

### USER-03 Import người dùng có file mẫu

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `user-01-browse.jpg`

- Expected: Tải file mẫu CSV có cột đúng, upload, xem trước, xác nhận.
- Actual:
  - Upload users có sẵn trong core nhưng không có file mẫu, phải đọc tài liệu
- Đề xuất: Thêm file mẫu và hướng dẫn cột trên trang upload, lối tắt trong menu.
- Việc cần làm:
  - Soạn file mẫu (username, firstname, lastname, email, cohort1)
  - Đặt link tải ở trang upload và guide S6
- Cách làm trong Moodle: Core tool_uploaduser + nội dung hướng dẫn.
- Tham chiếu: TalentLMS Import users

## COH - Phòng ban (Cohort)

Route Moodle: `/cohort/index.php`  
Người dùng: Phòng Đào tạo: hàng tháng  
Ưu tiên màn: Should

Vấn đề lớn nhất:
- Tên gọi 'Cohort' xa lạ với người dùng VIGO
- Cột Source, Cohort ID mang tính kỹ thuật
- Không biết phòng ban đang được ghi danh tự động vào khóa nào

Hướng cải tiến chính:
- Đổi tên thành Phòng ban, ẩn cột kỹ thuật
- Hiện khóa đang đồng bộ

Ảnh: `coh-01-cohorts.jpg`

### COH-01 Đổi tên Cohort thành Phòng ban, ẩn cột kỹ thuật

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `coh-01-cohorts.jpg`

- Expected: Thấy danh sách 'Phòng ban' với tên, mô tả, số người.
- Actual:
  - Tiêu đề 'System cohorts', cột Cohort ID, Source 'Created manually'
- Đề xuất: Language customisation và ẩn cột Source.
- Việc cần làm:
  - Đổi chuỗi cohort trong core_cohort
  - SCSS ẩn cột Source
- Cách làm trong Moodle: Language customisation + SCSS.
- Tham chiếu: Docebo Branches, TalentLMS Groups

### COH-02 Hiện khóa đang đồng bộ của phòng ban

Priority: Could · Phạm vi: Ngoài theme · Effort: M · Ảnh: `coh-01-cohorts.jpg`

- Expected: Mở một phòng ban biết đang được tự ghi danh vào khóa nào.
- Actual:
  - Không có thông tin, phải vào từng khóa xem Enrolment methods
- Đề xuất: Thêm cột 'Khóa đồng bộ' hoặc trang chi tiết phòng ban.
- Việc cần làm:
  - Truy vấn enrol cohort theo cohortid
  - Hiện trong bảng hoặc custom report
- Cách làm trong Moodle: Custom nhỏ (report hoặc local page).
- Tham chiếu: TalentLMS Group: tab Courses

## RPT - Báo cáo tiến độ và điểm

Route Moodle: `/report/progress, /grade/report/grader, /reportbuilder`  
Người dùng: Phòng Đào tạo, quản lý: hàng tuần  
Ưu tiên màn: Must

Vấn đề lớn nhất:
- Báo cáo hoàn thành: tên bài xoay dọc, ô tick nhỏ, cuộn ngang, không có % tổng
- Sổ điểm ở Edit mode hiện ô nhập điểm, dễ sửa nhầm
- Custom reports trống, chưa có báo cáo dựng sẵn
- Không có báo cáo theo phòng ban

Hướng cải tiến chính:
- Bộ báo cáo dựng sẵn bằng Report builder, gửi email định kỳ
- Trang Báo cáo tập trung theo câu hỏi nghiệp vụ

Ảnh: `rpt-01-activity-completion.jpg`, `rpt-02-grader.jpg`, `rpt-03-custom-reports.jpg`

### RPT-01 Bộ báo cáo dựng sẵn và gửi định kỳ

Priority: Must · Phạm vi: Cấu hình · Effort: M · Ảnh: `rpt-03-custom-reports.jpg`

- Expected: Có sẵn các báo cáo hay hỏi: tiến độ theo khóa, theo phòng ban, kết quả bài kiểm tra, học viên chưa hoàn thành. Quản lý nhận email hàng tuần.
- Actual:
  - Custom reports: 'Nothing to display'
  - Báo cáo core rải rác trong từng khóa
- Đề xuất: Dựng 4 custom report bằng Report builder, đặt lịch gửi.
- Việc cần làm:
  - Chốt 4 báo cáo và người nhận với Vi
  - Dựng report, chia quyền xem (audience)
  - Đặt schedule gửi email
- Cách làm trong Moodle: Site administration > Reports > Report builder > Custom reports (core).
- Tham chiếu: TalentLMS Custom reports, Training matrix

### RPT-02 Trang Báo cáo tập trung

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `rpt-03-custom-reports.jpg`

- Expected: Một trang liệt kê báo cáo theo câu hỏi: 'Ai chưa học xong?', 'Phòng nào chậm?', 'Bài kiểm tra nào khó?'.
- Actual:
  - Báo cáo nằm ở nhiều nơi: More > Reports của khóa, Site administration > Reports
- Đề xuất: Smart menu hoặc trang (Page) liệt kê link báo cáo theo nhóm câu hỏi.
- Việc cần làm:
  - Gom link RPT-01 và báo cáo core
  - Đặt vào menu SHELL-03
- Cách làm trong Moodle: Boost Union Smart menus / trang nội dung.
- Tham chiếu: TalentLMS Reports home

### RPT-03 Báo cáo hoàn thành dễ đọc

Priority: Should · Phạm vi: Theme · Effort: S · Ảnh: `rpt-01-activity-completion.jpg`

- Expected: Xem bảng học viên x bài không phải cuộn ngang, có % hoàn thành mỗi người.
- Actual:
  - Tên bài xoay dọc, cắt chữ, ô tick nhỏ
  - Bảng cuộn ngang trong khung 830px
  - Không có cột % tổng
- Đề xuất: Full width (SHELL-01), header gọn, màu trạng thái. Cột % dùng report RPT-01.
- Việc cần làm:
  - SCSS header, màu ô
  - Link sang report có cột %
- Cách làm trong Moodle: SCSS + Report builder.
- Tham chiếu: TalentLMS Training matrix

### RPT-04 Sổ điểm không sửa nhầm

Priority: Should · Phạm vi: Cấu hình · Effort: S · Ảnh: `rpt-02-grader.jpg`

- Expected: Mở sổ điểm để xem, chỉ nhập điểm khi chủ động bật.
- Actual:
  - Edit mode bật thì sổ điểm hiện ô nhập cho mọi bài kiểm tra
  - Không tô màu đạt/không đạt
- Đề xuất: Tắt quick grading mặc định. Tô màu đạt/không đạt nếu kiểm được trên sandbox.
- Việc cần làm:
  - Đặt mặc định Quick grading = No
  - Kiểm trên sandbox khả năng tô màu theo gradepass
- Cách làm trong Moodle: Site administration > Grades > Report settings > Grader report.
- Tham chiếu: -
- Notes: Phần tô màu chưa chắc làm được bằng theme, cần kiểm sandbox.

## NOTI - Thông báo và lịch

Route Moodle: `Site announcements, /calendar/view.php`  
Người dùng: Phòng Đào tạo: hàng tuần  
Ưu tiên màn: Could

Vấn đề lớn nhất:
- Thông báo trên trang chủ hiện toàn văn, kèm bảng dài
- Lịch tháng: tên sự kiện bị cắt 'Bài thực ...', không phân màu theo loại

Hướng cải tiến chính:
- Thông báo dạng thẻ có trích đoạn
- Lịch hiện đủ tên, màu theo loại sự kiện

Ảnh: `noti-01-calendar.jpg`, `home-03-categories-news.jpg`

### NOTI-01 Lịch hiện đủ tên, màu theo loại

Priority: Could · Phạm vi: Theme · Effort: S · Ảnh: `noti-01-calendar.jpg`

- Expected: Nhìn lịch tháng biết ngày nào có buổi đào tạo, hạn nộp bài, hạn kiểm tra.
- Actual:
  - Tên sự kiện bị cắt 'Bài thực ...'
  - Màu chưa phân theo loại
- Đề xuất: Cho tên xuống 2 dòng, chip màu theo loại sự kiện.
- Việc cần làm:
  - SCSS calendar month view
- Cách làm trong Moodle: SCSS.
- Tham chiếu: Learner mockup /calendar

### NOTI-02 Đăng thông báo nhanh

Priority: Could · Phạm vi: Theme · Effort: S · Ảnh: `home-03-categories-news.jpg`

- Expected: Đăng thông báo chỉ cần tiêu đề, nội dung, chọn gửi ngay hay hẹn giờ.
- Actual:
  - Đăng qua forum Site announcements, form có nhiều tùy chọn nâng cao
- Đề xuất: Lối tắt 'Đăng thông báo' trên Tổng quan (DASH-02) mở thẳng form forum, thu gọn nâng cao.
- Việc cần làm:
  - Link tới mod/forum/post.php?forum=<id>
  - SCSS thu gọn phần Advanced
- Cách làm trong Moodle: Link core + SCSS.
- Tham chiếu: TalentLMS Notifications

## CERT - Chứng nhận

Route Moodle: `/badges, chưa có plugin chứng nhận`  
Người dùng: Phòng Đào tạo: theo đợt  
Ưu tiên màn: Could

Vấn đề lớn nhất:
- Chưa cài plugin chứng nhận
- Badge duy nhất đang Archived, cảnh báo khóa không còn

Hướng cải tiến chính:
- Chốt plugin trước, sau đó mới thiết kế UI cấp chứng nhận

Ảnh: `cert-01-badges.jpg`

### CERT-01 Chốt plugin chứng nhận trước khi thiết kế

Priority: Could · Phạm vi: Ngoài theme · Effort: M · Ảnh: `cert-01-badges.jpg`

- Expected: Hoàn thành khóa là có chứng nhận PDF theo mẫu VIGO, admin xem danh sách đã cấp.
- Actual:
  - Chưa có plugin chứng nhận
  - Badge 'Hoàn thành khoá học' Archived, khóa gốc không còn
- Đề xuất: Chọn plugin (Custom certificate hoặc Course certificate của Moodle Workplace/tool_certificate) rồi mới làm UI.
- Việc cần làm:
  - Thiện đề xuất plugin
  - Vi lấy mẫu chứng nhận từ VIGO
  - Sau khi chốt mới thêm mục vào backlog
- Cách làm trong Moodle: Plugin bên thứ ba.
- Tham chiếu: Learner mockup /certificates
- Notes: Điểm chưa chốt: plugin chứng nhận, mẫu do ai cung cấp.

## Điểm chưa chốt

| # | Quyết định | Các hướng | BA đề xuất | Ảnh hưởng | Người chốt |
| --- | --- | --- | --- | --- | --- |
| 1 | Ngôn ngữ giao diện admin | Tiếng Việt toàn bộ / Tiếng Anh / Song song | Tiếng Việt, giữ thuật ngữ Moodle trong ngoặc ở guide | SHELL-06 | Vi |
| 2 | Video Drive là module riêng hay Page + VideoShow | A: mod_drivevideo riêng / B: Page + quy ước | A nếu learner cần track % video và nhận diện loại bài ổn định | ACT-02, CED-01 | Thiện, Đạt Trần, Duy |
| 3 | Phòng ban lưu ở đâu | Cohort / Custom profile field / Cả hai (field tự đẩy vào cohort) | Cohort làm chuẩn ghi danh, thêm profile field để hiện trên danh sách | ENR-02, USER-01, USER-02, COH-01 | Thiện |
| 4 | 4 chỉ số trên Tổng quan | Khóa đang mở, học viên hoạt động, tỉ lệ hoàn thành, bài chờ chấm / khác | Như đề xuất, chốt với VIGO | DASH-01 | Vi |
| 5 | Mặc định quiz và rule pass | Số lần làm, điểm đạt, cách tính điểm, xem đáp án | 3 lần, 80%, điểm cao nhất, xem đáp án sau khi đóng | QUIZ-01, ACT-06 | Vi, Thiện |
| 6 | Có dùng JS sắp xếp lại form không | Có (ACT-04, CSET-02, COMP-01) / Chỉ CSS, cấu hình | Có, nhưng gom trong 1 module JS, có test khi nâng cấp | ACT-04, CSET-02, COMP-01 | Thiện |
| 7 | Plugin chứng nhận | Custom certificate / tool_certificate | Thiện đề xuất | CERT-01 | Thiện, Vi |
| 8 | Tổ chức question bank | Bank theo khóa / theo chủ đề dùng chung | Bank theo khóa, đặt tên theo phần | QUIZ-06 | Vi |
