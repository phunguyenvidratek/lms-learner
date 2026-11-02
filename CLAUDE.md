# CLAUDE.md - Vidratek LMS Learner Portal (mockup)

@AGENTS.md

## Mục đích repo

Mockup giao diện người học (learner portal) cho Vidratek LMS, khách hàng đầu tiên là VIGO (đào tạo nội bộ).
Backend thật là Moodle 5.1. Repo này chỉ dùng mock data, KHÔNG gọi API thật. Mục tiêu là dựng màn hình
theo backlog để BA, FE (Duy) và khách thống nhất giao diện trước khi code thật.

## Nguồn sự thật

1. Backlog: `docs/backlog.md` (bản text của file Excel `VidratekLMS_Learner_Backlog_v0.1.xlsx`).
   Mỗi tính năng có mã như `COURSE-01`. Chỉ dựng tính năng có trong backlog. Ưu tiên Must, rồi Should.
   Không dựng tính năng Won't. Thấy thiếu thì ghi vào phần "Câu hỏi cho BA" cuối file này, không tự thêm.
2. Tham chiếu UX: ảnh chụp Udemy trong `docs/reference/udemy/` và mô tả trong `docs/udemy-reference.md`.
   Học bố cục và hành vi, KHÔNG copy logo, tên, màu tím hay nội dung của Udemy.
3. Dữ liệu: `src/lib/data.ts` (hàm đặt tên theo Moodle web service) và `src/lib/mock/data.ts`.
   Type trong `src/types/moodle.ts` giữ đúng tên field của Moodle.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (token trong `src/app/globals.css`), shadcn/ui style new-york (component trong `src/components/ui`)
- Icon: lucide-react. Font: Be Vietnam Pro.
- Thêm component shadcn: `npx shadcn@latest add <tên>` (components.json đã cấu hình), giữ token màu brand.

## Design rules

- Màu chủ đạo `#0033a0` = `primary` = `brand-600`. Dùng thang `brand-50..950` cho nền nhạt, hover.
  Không hard-code mã màu trong component, dùng token (`bg-primary`, `text-brand-700`, `bg-success-soft`...).
- Trạng thái: hoàn thành = `success`, đang học = `brand`, chưa bắt đầu = `muted`, cảnh báo = `warning`, lỗi = `destructive`.
- Màn học bài và quiz dùng layout `(player)` nền tối `bg-player` như Udemy. Các màn còn lại dùng layout `(app)` có sidebar.
- Bo góc `rounded-xl` cho card, `rounded-md` cho input/button. Shadow nhẹ (`shadow-xs`, hover `shadow-md`).
- Toàn bộ text giao diện tiếng Việt, có dấu. Không dùng emoji.
- Responsive bắt buộc (SHELL-03): kiểm ở 375px, 768px, 1280px.
- Mọi danh sách có empty state, mọi màn có trạng thái loading (SHELL-04).

## Quy ước code

- Page (`src/app/**/page.tsx`) là server component, lấy data qua `src/lib/data.ts`.
- Phần tương tác (tab, filter, toggle, form) tách ra client component trong `src/components/<nhóm>/`.
- Màn mẫu đã dựng xong để bắt chước: `/courses` (`src/components/course/*`).
- Đầu mỗi component ghi mã backlog nó phục vụ, ví dụ `/** COURSE-01, COURSE-04 */`.
- Nội dung HTML từ Moodle (Page, summary, label) render trong `<div className="moodle-content">`.
  Chỗ chỉ cần text thì dùng `stripHtml()` (lỗi hiện `&amp;` ở bản FE cũ là vì thiếu bước này).
- Logic dùng chung đặt trong `src/lib/data.ts`: trạng thái khóa (`getCourseStatus`, INT-03),
  lọc module cho người học (`learnerModules`, CDET-05), bài tiếp theo (`nextModuleToLearn`).
- Không tạo state tiến độ riêng ở từng màn. Mọi màn đọc cùng một nguồn để số liệu không lệch.
- Khi dựng xong một màn, xóa `ScreenPlaceholder` của màn đó.

## Map màn hình

| Mã | Route | Layout | Trạng thái |
| --- | --- | --- | --- |
| AUTH | /login | (auth) | Đã dựng bản đơn giản |
| DASH | /dashboard | (app) | Placeholder |
| COURSE | /courses | (app) | Đã dựng (màn mẫu) |
| CDET | /courses/[courseId] | (app) | Placeholder |
| LEARN | /learn/[courseId]/[cmId] | (player) | Placeholder |
| QUIZ | /quiz/[cmId] | (player) | Placeholder |
| TEST | /tests | (app) | Placeholder |
| GRADE | /grades | (app) | Placeholder |
| CAL | /calendar | (app) | Placeholder |
| NOTI | /notifications | (app) | Placeholder |
| LP | /learning-path | (app) | Placeholder, chờ BA chốt định nghĩa |
| CERT | /certificates | (app) | Placeholder, chờ chốt plugin |
| PROF | /profile | (app) | Placeholder |
| CAT | /catalog | (app) | Placeholder, Could |

Thứ tự dựng gợi ý: CDET > LEARN > QUIZ > DASH > TEST > NOTI > GRADE > CAL > PROF.

## Lưu ý nghiệp vụ Moodle quan trọng khi dựng

- Trạng thái module bị khóa: `uservisible=false` + `availabilityinfo` (HTML lý do). Hiển thị ổ khóa và lý do (CDET-04).
- Completion: `completiondata.state` 0 chưa xong, 1 xong, 2 xong và đạt, 3 xong nhưng không đạt.
  `tracking` 1 = người học tự bấm Mark as done, 2 = tự động theo điều kiện.
- Module `qbank` không bao giờ hiện với người học. `label` hiện nội dung inline, không phải 1 bài.
- Video là module custom `drivevideo` (link Google Drive). Mockup nhúng khung 16:9 giả lập, không nhúng Drive thật.
- Quiz: câu hỏi dùng type `QuizQuestion` đã chuẩn hóa (chọn một, chọn nhiều, đúng/sai). Điểm đạt là `gradepass`.

## Không làm

- Không gọi Moodle thật, không thêm biến môi trường chứa token, tài khoản, mật khẩu.
- Không thêm thư viện state management hay data fetching khi chưa cần.
- Không dựng tính năng ngoài backlog.

## Câu hỏi cho BA

(Ghi ở đây khi gặp chỗ backlog chưa rõ.)
