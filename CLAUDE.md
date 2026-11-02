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
3. Dữ liệu:
   - Nội dung phía Moodle (khóa, phần, bài, quiz, forum, lịch): `src/lib/mock/*`, đọc qua `src/lib/data.ts`
     (hàm đặt tên theo Moodle web service). Ngày tháng tính tương đối theo hôm nay (`src/lib/mock/time.ts`).
   - Tiến độ của người học (hoàn thành bài, lượt làm quiz, yêu thích, thông báo, phiên đăng nhập):
     store phía client `src/lib/store/learning-store.tsx` (React context + localStorage), dữ liệu ban đầu ở
     `src/lib/store/seed.ts`. Khôi phục dữ liệu ban đầu: thêm `?reset=1` vào URL bất kỳ.
   - Logic tính (INT-03): `src/lib/learning.ts` trả dữ liệu đúng hình dạng Moodle (completiondata, uservisible,
     availabilityinfo). Mọi màn đọc cùng `useLearning()` nên số liệu không lệch.
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

- Page (`src/app/**/page.tsx`) là server component, lấy nội dung tĩnh qua `src/lib/data.ts`.
- Phần tương tác và mọi thứ phụ thuộc tiến độ người học là client component trong `src/components/<nhóm>/`,
  đọc store qua `useLearning()`. Component không import trực tiếp `src/lib/mock`.
- Không gọi `Date.now()` khi render (lint react-hooks/purity), dùng `useNow()` trong `src/lib/use-now.ts`.
- Màn mẫu để bắt chước: `/courses` (`src/components/course/*`), `/courses/[courseId]`.
- Đầu mỗi component ghi mã backlog nó phục vụ, ví dụ `/** COURSE-01, COURSE-04 */`.
- Nội dung HTML từ Moodle (Page, summary, label) render trong `<div className="moodle-content">`.
  Chỗ chỉ cần text thì dùng `stripHtml()` (lỗi hiện `&amp;` ở bản FE cũ là vì thiếu bước này).
- Logic dùng chung đặt trong `src/lib/learning.ts`: dựng khóa theo người học (`buildAllCourses`: trạng thái,
  %, khóa phần, khóa theo lộ trình, bài tiếp theo), lọc module (`learnerModules`, CDET-05), chấm quiz
  (`gradeAnswers`, chọn nhiều tính điểm từng phần), tóm tắt quiz (`summarizeQuiz`).
- Không tạo state tiến độ riêng ở từng màn. Mọi màn đọc cùng một nguồn để số liệu không lệch.
- Giao diện không hiển thị mã backlog, chữ Must/Should, tên API, "mock", "demo". Mã backlog chỉ nằm trong comment.

## Map màn hình

| Mã | Route | Layout | Trạng thái |
| --- | --- | --- | --- |
| AUTH | /login, /forgot-password, /change-password | (auth) | Đã dựng (AUTH-01..05) |
| DASH | /dashboard | (app) | Đã dựng (DASH-01..05) |
| COURSE | /courses | (app) | Đã dựng (COURSE-01..06) |
| CDET | /courses/[courseId] | (app) | Đã dựng (CDET-01..06, 08) |
| LEARN | /learn/[courseId]/[cmId] | (player) | Đã dựng (LEARN-01..06, 08..15) |
| QUIZ | /quiz/[cmId] | (player) | Đã dựng (QUIZ-01..06) |
| TEST | /tests | (app) | Đã dựng (TEST-01..03) |
| GRADE | /grades | (app) | Đã dựng (GRADE-01..02) |
| CAL | /calendar | (app) | Đã dựng (CAL-01..02) |
| NOTI | /notifications | (app) | Đã dựng (NOTI-01..04) |
| LP | /learning-path | (app) | Đã dựng theo phương án tạm: chuỗi khóa, khóa sau mở khi xong khóa trước |
| CERT | /certificates, /certificates/[courseId] | (app) | Đã dựng CERT-01, mẫu chứng nhận tạm |
| PROF | /profile | (app) | Đã dựng (PROF-01, 03) |
| CAT | /catalog | - | Không dựng (Could), không có trên menu |
| SHELL | 404, lỗi, loading | - | not-found.tsx, error.tsx, loading.tsx |

Thứ tự dựng gợi ý: CDET > LEARN > QUIZ > DASH > TEST > NOTI > GRADE > CAL > PROF.

## Lưu ý nghiệp vụ Moodle quan trọng khi dựng

- Trạng thái module bị khóa: `uservisible=false` + `availabilityinfo` (HTML lý do). Hiển thị ổ khóa và lý do (CDET-04).
- Completion: `completiondata.state` 0 chưa xong, 1 xong, 2 xong và đạt, 3 xong nhưng không đạt.
  `tracking` 1 = người học tự bấm Mark as done, 2 = tự động theo điều kiện.
- Module `qbank` không bao giờ hiện với người học. `label` hiện nội dung inline, không phải 1 bài.
- Video là module custom `drivevideo`. Component `VideoPlayer` (`src/components/player/video-player.tsx`) phát
  thẻ `<video>` HTML5 khung 16:9 với file mp4 trong `public/videos` (clip Pexels, poster cùng tên .jpg), nhớ vị trí
  xem trong localStorage và tự đánh dấu hoàn thành khi xem tới 90%. Nguồn video chỉ đổi ở một chỗ:
  `resolveVideoSource()` trong `src/lib/video.ts`. Khi `videourl` là link Google Drive, hàm trả link `/preview`
  để nhúng iframe; khi đó không đọc được % đã xem nên bài video chuyển sang hoàn thành thủ công.
- Quiz: câu hỏi dùng type `QuizQuestion` đã chuẩn hóa (chọn một, chọn nhiều, đúng/sai). Điểm đạt là `gradepass`.

## Không làm

- Không gọi Moodle thật, không thêm biến môi trường chứa token, tài khoản, mật khẩu.
- Không thêm thư viện state management hay data fetching khi chưa cần.
- Không dựng tính năng ngoài backlog.

## Tài sản tĩnh

- Ảnh bìa khóa: `public/images/courses` (Pexels, miễn phí bản quyền). Video: `public/videos` (Pexels).
- PDF tài liệu: `public/files`, sinh từ nội dung bài đọc bằng `node scripts/generate-pdfs.mjs` (cần Google Chrome).
- Kiểm tra: `node scripts/e2e-demo.mjs http://localhost:3000` chạy trọn luồng trình bày;
  `node scripts/screenshot.mjs <url> <thư mục> <route...>` chụp 1280px và 375px.

## Câu hỏi cho BA

1. Thời lượng video: clip mẫu dài 11-28 giây, trong khi đề cương hiển thị thời lượng 5-18 phút (custom field).
   Khi có video thật trên Drive, thời lượng lấy từ đâu (custom field do admin nhập hay đọc từ Drive)?
2. Lộ trình (LP-01): đang dựng theo hướng "chuỗi khóa, khóa sau mở khi xong khóa trước" (gần phương án 1:
   Course completion điều kiện khóa trước). Khóa "An toàn và xử lý biến chứng" đang để ngoài lộ trình, bắt buộc
   riêng. BA xác nhận khóa nào thuộc lộ trình và thứ tự.
3. Điều kiện hoàn thành khóa (CDET-06, INT-03): đang tính "hoàn thành mọi bài + đạt mọi bài kiểm tra cuối phần".
   Có cần thêm khảo sát cuối khóa hay bài thu hoạch không?
4. Xem lại đáp án (QUIZ-05): đang cho xem đáp án đúng ngay cả khi chưa đạt và còn lượt. VIGO có muốn chỉ hiện
   đúng/sai mà ẩn đáp án đúng cho tới khi đạt hoặc hết lượt (Review options của Moodle) không?
5. Hết 3 lượt mà chưa đạt: đang hiện "liên hệ Phòng Đào tạo để mở thêm lượt". Quy trình mở thêm lượt (user override)?
6. LEARN-08: nút "Mở trên LMS" trỏ tới `NEXT_PUBLIC_LMS_URL` (mặc định https://lms.vigo.vn, chưa tồn tại).
   Cần địa chỉ Moodle thật và chốt dùng tool_mobile_get_autologin_key.
7. Chứng nhận (CERT-01): mẫu đang tự thiết kế theo nhận diện VIGO, ký tên "Phòng Đào tạo VIGO". Cần mẫu chính thức,
   người ký và plugin (Custom certificate) để sinh PDF phía server.
8. Hạn nộp bài kiểm tra: đang đặt hạn cho từng bài (timeclose). Quá hạn chưa đạt thì xử lý thế nào?
