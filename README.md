# Vidratek LMS - Learner Portal (VIGO)

Giao diện người học của Vidratek LMS cho khách hàng VIGO (đào tạo nội bộ). Backend thật là Moodle 5.1.
Repo này chạy độc lập, chưa nối Moodle: nội dung khóa nằm trong `src/lib/mock`, tiến độ người học
lưu trong trình duyệt (localStorage).

## Chạy thử

Cần Node.js 20.9 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000/login?reset=1 để bắt đầu từ dữ liệu ban đầu.

- Đăng nhập bằng tên đăng nhập và mật khẩu bất kỳ (không để trống), hoặc bấm "Đăng nhập bằng Google".
- Tài khoản `nhanvienmoi` (mật khẩu bất kỳ) bị bắt đổi mật khẩu trước khi vào học.
- Thêm `?reset=1` vào URL bất kỳ để khôi phục dữ liệu ban đầu (đăng xuất, xóa tiến độ đã làm).

## Kịch bản trình bày (10 phút)

Chuẩn bị: mở Chrome, vào http://localhost:3000/login?reset=1. Nên dùng cửa sổ rộng từ 1280px.

| Phút | Bước | Thao tác | Điểm cần nói |
| --- | --- | --- | --- |
| 0:00 | Đăng nhập | Bấm Đăng nhập khi để trống để thấy báo lỗi. Nhập `minhanh.tran` / mật khẩu bất kỳ, bấm Đăng nhập | Có ẩn/hiện mật khẩu, Quên mật khẩu, đăng nhập Google |
| 0:45 | Tổng quan | Chỉ lời chào, thẻ Học tiếp (5%), bài kiểm tra sắp đến hạn, thống kê 2/2/2, thông báo chung (bấm Xem chi tiết) | Số liệu tính từ một nguồn, khớp với mọi màn |
| 1:45 | Khóa học của tôi | Mở menu Khóa học của tôi: tab trạng thái có số đếm, tìm kiếm, sắp xếp, tim yêu thích. Chỉ 2 khóa có ổ khóa | Khóa sau mở khi xong khóa trước trong lộ trình |
| 2:30 | Chi tiết khóa | Bấm vào Rejuran Internal Training: hero, card bên phải, đề cương. Phần 2-4 có ổ khóa và lý do "Cần đạt 8/10 bài kiểm tra Phần 1". Mở tab Hỏi đáp | Cuối mỗi phần có bài kiểm tra 10 câu, đạt 8/10 mới mở phần sau |
| 3:30 | Học video | Bấm Học tiếp. Chỉ thanh trên (Tiến độ của bạn), sidebar Nội dung khóa học, nút Tài liệu. Tua video tới gần cuối | Xem tới 90% thì ô tick ở sidebar tự bật, video nhớ vị trí đang xem |
| 4:30 | Đọc bài | Bấm Tiếp theo: bài đọc tự hoàn thành. Tiếp theo: PDF xem ngay trong trang, bấm Đánh dấu hoàn thành. Tiếp theo: liên kết ngoài mở tab mới | Ba kiểu hoàn thành: tự động khi xem, thủ công, khi mở liên kết |
| 5:30 | Bài kiểm tra trượt | Tới Kiểm tra Phần 1, bấm Bắt đầu làm bài. Chọn bừa vài câu, bấm Xem lại và nộp bài, Nộp bài | Đồng hồ 15 phút, tự lưu, màn tóm tắt câu chưa trả lời, hộp xác nhận |
| 6:30 | Xem lại, làm lại | Ở màn Chưa đạt: chỉ "còn 2 lượt", bấm Xem lại đáp án. Bấm Kết quả lần làm, Làm lại, trả lời đúng (đáp án ở màn xem lại), nộp | Tối đa 3 lần, tính lần cao nhất, câu chọn nhiều tính điểm từng phần |
| 7:30 | Mở khóa Phần 2 | Màn Chúc mừng: "Phần 2 đã được mở", sidebar mất ổ khóa. Chuông thông báo tăng thêm 1, mở Thông báo thấy "Bạn đã đạt Kiểm tra Phần 1" | Mở khóa ngay sau khi nộp, không cần tải lại |
| 8:15 | Tiến độ đồng bộ | Mở lần lượt Tổng quan, Khóa học của tôi, Điểm: khóa Rejuran cùng hiện 29% | Một nguồn tính tiến độ (INT-03) |
| 8:45 | Các màn còn lại | Bài kiểm tra (lọc trạng thái, khóa), Lịch (bấm ngày có chấm, xem chi tiết), Lộ trình học (41%), Chứng nhận (bấm Tải xuống, in ra PDF A4 ngang), Hồ sơ (đổi mật khẩu) | |
| 9:30 | Điện thoại | Mở DevTools, chế độ iPhone: menu thành drawer, màn học có tab Nội dung | Nhân viên học được trên điện thoại |
| 9:50 | Đổi mật khẩu lần đầu | Đăng xuất, đăng nhập `nhanvienmoi`: bị chuyển sang Đổi mật khẩu lần đầu | |

Trình bày lại từ đầu: mở http://localhost:3000/login?reset=1.

## Kiểm tra tự động

```bash
npm run lint
npm run build
node scripts/e2e-demo.mjs http://localhost:3000          # chạy trọn luồng trình bày (cần Google Chrome)
node scripts/screenshot.mjs http://localhost:3000 screenshots /dashboard /courses   # chụp 1280px và 375px
node scripts/generate-pdfs.mjs                             # sinh lại PDF tài liệu từ nội dung bài đọc
```

## Cấu trúc

```
CLAUDE.md                     Quy ước dựng màn, map màn hình, câu hỏi cho BA
docs/backlog.md               Backlog theo màn hình (bản text của file Excel)
docs/udemy-reference.md       Map ảnh Udemy sang mã backlog
src/app/(auth)/               Đăng nhập, quên mật khẩu, đổi mật khẩu lần đầu
src/app/(app)/                Các màn có sidebar
src/app/(player)/             Màn học bài và làm bài kiểm tra (nền tối)
src/components/               Component theo nhóm màn hình, shadcn trong ui/
src/lib/data.ts               Hàm lấy nội dung, đặt tên theo Moodle web service
src/lib/learning.ts           Tính tiến độ, khóa phần, khóa theo lộ trình, chấm điểm (INT-03)
src/lib/store/                Store tiến độ người học (React context + localStorage) và dữ liệu ban đầu
src/lib/video.ts              Nguồn video (đổi sang Google Drive ở đây)
src/lib/mock/                 Nội dung 6 khóa, bài đọc, câu hỏi, lịch, thông báo
public/images, videos, files  Ảnh bìa, video (Pexels), PDF tài liệu
scripts/                      Sinh PDF, chụp màn hình, kiểm tra luồng trình bày
```

Ảnh và video lấy từ Pexels (giấy phép Pexels, miễn phí sử dụng). Nội dung chuyên môn chỉ để trình bày giao diện,
không thay thế tài liệu đào tạo chính thức của VIGO.
