# Vidratek LMS - Learner Portal Mockup

Mockup giao diện người học cho Vidratek LMS (Moodle 5.1), khách hàng VIGO. Dữ liệu giả, không nối Moodle.

## Chạy thử

Cần Node.js 20.9 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000 (tự chuyển sang /dashboard). Màn đã dựng mẫu: `/courses`, `/login`.
Các màn còn lại là placeholder liệt kê backlog cần dựng.

## Cấu trúc

```
CLAUDE.md                  Hướng dẫn cho Claude Code (đọc trước khi dựng màn)
docs/backlog.md            Backlog theo màn hình (bản text của file Excel)
docs/udemy-reference.md    Map ảnh Udemy sang mã backlog
docs/reference/udemy/      Ảnh chụp tham chiếu
src/app/(auth)/            Đăng nhập
src/app/(app)/             Các màn có sidebar
src/app/(player)/          Màn học bài và quiz (nền tối)
src/components/ui/         Component shadcn
src/components/layout/     Sidebar, header, page header
src/components/course/     Card khóa học, màn Khóa học của tôi (màn mẫu)
src/lib/data.ts            Hàm lấy dữ liệu, đặt tên theo Moodle web service
src/lib/mock/data.ts       Mock data
src/lib/backlog.ts         Backlog dạng code (sinh từ Excel)
src/types/moodle.ts        Type theo response Moodle
```

## Dựng tiếp bằng Claude Code

Mở thư mục repo bằng Claude Code rồi giao từng màn, ví dụ:

> Đọc CLAUDE.md, docs/backlog.md mục "5. Chi tiết khóa học" và ảnh docs/reference/udemy/11, 12, 13.
> Dựng màn /courses/[courseId] cho các tính năng Must và Should của CDET, theo pattern của màn /courses.

Mỗi lần một màn, review xong mới sang màn tiếp theo.
