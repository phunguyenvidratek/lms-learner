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

## Admin portal (mockup theme Moodle)

Mockup giao diện quản trị sau khi đổi theme, để dev thấy trước. Admin thật vẫn là Moodle 5.1 + Boost Union,
chỉ đổi theme (cấu hình, child theme, vài block/plugin nhỏ). Vì vậy mockup giữ đúng luồng, URL, field của Moodle,
chỉ đổi cách trình bày (thứ tự, nhãn, gom nhóm) theo backlog.

### Nguồn sự thật

1. Backlog: `docs/admin/admin-backlog.md` (bản text của `VidratekLMS_Admin_UX_Backlog_v0.1.xlsx`). Mã dạng `CED-01`.
   Trùng tiền tố với learner (SHELL, DASH, QUIZ, NOTI, CERT, CAT) nên khi ghi comment dùng dạng `Admin CED-01`
   nếu dễ nhầm. Ưu tiên Must > Should > Could.
2. Ảnh hiện trạng Moodle: `docs/admin/reference/moodle-admin/<tên>.jpg`, tên khớp cột Ảnh trong backlog
   (backlog ghi `docs/reference/moodle-admin`, đường dẫn thật có thêm `admin/`).
3. Prompt từng phiên: `docs/admin/admin-mockup-prompts.md`.

### Ràng buộc

- Không thêm bước, field, luồng mà Moodle không có. Chỉ đổi trình bày, thứ tự, nhãn, gom nhóm, thu gọn.
  Field ít dùng thì thu gọn ("Hiện thêm", "Nâng cao"), không bỏ. Thấy cần thêm thì ghi vào "Câu hỏi cho BA (admin)".
- Đầu mỗi page admin ghi mã backlog và URL Moodle tương ứng, ví dụ
  `/** Admin CED-01..07. Moodle: /course/view.php?id={id}&edit=on */`.
- Mã backlog, tên API, "mock" chỉ nằm trong comment, không hiện trên giao diện. Text tiếng Việt, thuật ngữ VIGO:
  Cohort = Phòng ban, Activity = Bài học, Quiz = Bài kiểm tra, Participants = Học viên.
- Không đụng route và component learner. Admin nằm dưới `/admin`, layout riêng `src/app/admin/layout.tsx`,
  không qua màn đăng nhập (người dùng cố định: Đỗ Ngọc Lan, Quản lý, Phòng Đào tạo).
- Dùng chung token `globals.css` và `src/components/ui`; `src/components/common` dùng được.
  Không import `src/components/layout` của learner. Component admin ở `src/components/admin/<nhóm>`.
- Nội dung rộng tối đa 1200px, trang báo cáo và bảng lớn full width (SHELL-01).

### Dữ liệu

- Mock quản trị: `src/lib/mock/admin/*` (`courses.ts` danh mục + khóa + 2 khóa nháp ẩn, `users.ts` người dùng +
  phòng ban + vai trò, `enrolments.ts` cách ghi danh + lượt ghi danh, `learner-profiles.ts` tiến độ học viên khác).
  Type ở `src/types/moodle-admin.ts`, giữ tên field Moodle.
- Đọc phía server qua `src/lib/admin-data.ts` (hàm đặt tên theo Moodle WS). Component không import `src/lib/mock`.
- Logic tính ở `src/lib/admin.ts` (`courseRoster`, `courseStats`, `quizReport`, `siteOverview`...). Mọi % và trạng thái
  đi qua `buildAllCourses()`/`summarizeQuiz()` của `src/lib/learning.ts`, nên số liệu admin khớp learner:
  - Trần Minh Anh (2048) = người học trên learner portal, admin đọc state thật qua `useLearning()`.
  - Học viên khác: hồ sơ ngắn trong `learner-profiles.ts` dựng thành `LearnerState`, dùng helper chung
    `src/lib/mock/progress-helpers.ts` (cùng helper với `seed.ts`).
- Thay đổi admin tạo ra (thêm bài, sửa cài đặt, ghi danh, thêm người): store `src/lib/store/admin-store.tsx`
  (`useAdmin()`, localStorage `vigo-lms:admin:v1`, `?reset=1` xóa cùng learner). Hàm của `admin.ts` nhận `ds` từ
  `useAdmin()`. **Không đồng bộ sang learner** (learner đọc nội dung khóa ở server). Đã chốt với PO.
- Không ghi mật khẩu thật vào mock, trường mật khẩu dùng placeholder.

### Map màn hình admin

| Mã | Route mockup | URL Moodle | Trạng thái |
| --- | --- | --- | --- |
| SHELL-01..07 | `src/app/admin/layout.tsx` (header, sidebar, page header, tab khóa) | Mọi trang | Đã dựng |
| DASH-01..04, HOME-01 | /admin | /my/ | Đã dựng |
| MYC-01..04 | /admin/my-courses | /my/courses.php | Đã dựng |
| CAT-01..03 | /admin/courses?categoryid= | /course/management.php?categoryid= | Chưa dựng |
| CSET-01..03 | /admin/courses/new?category=, /admin/courses/[id]/settings | /course/edit.php?category=, /course/edit.php?id= | Chưa dựng |
| CED-01..07 | /admin/courses/[id]/edit | /course/view.php?id=&edit=on | Đã dựng |
| CED-07 | Nút Xem như học viên | /course/switchrole.php?id=&switchrole=5 (mockup mở learner /courses/[id]) | Đã dựng |
| ACT-01..07, QUIZ-01 | /admin/courses/[id]/modedit?add=&section=, ?update= | /course/modedit.php?add=&course=&section=, ?update= | Đã dựng ACT (quiz ở QUIZ-01) |
| QUIZ-02, 03 | /admin/quiz/[cmId]/edit | /mod/quiz/edit.php?cmid= | Chưa dựng |
| QUIZ-04 | /admin/quiz/[cmId]/import | /local/quizexcel/import.php?cmid= | Chưa dựng |
| QUIZ-05 | /admin/quiz/[cmId]/results | /mod/quiz/report.php?id=&mode=overview | Chưa dựng |
| QUIZ-06 | /admin/courses/[id]/question-banks, /admin/question-banks | /question/banks.php?courseid= | Chưa dựng |
| COMP-01..03 | /admin/courses/[id]/completion (+ /default, /bulk) | /course/completion.php?id=, /course/defaultcompletion.php?id=, /course/bulkcompletion.php?id= | Chưa dựng |
| ENR-01..03 | /admin/courses/[id]/participants | /user/index.php?id= | Chưa dựng |
| ENR-04 | /admin/courses/[id]/enrolments | /enrol/instances.php?id= | Chưa dựng |
| RPT-04 | /admin/courses/[id]/grades | /grade/report/grader/index.php?id= | Chưa dựng |
| RPT-03 | /admin/courses/[id]/reports/progress | /report/progress/index.php?course= | Chưa dựng |
| SHELL-05 | /admin/courses/[id]/reports | /report/view.php?courseid= | Chưa dựng |
| SHELL-05 (Thêm) | /admin/courses/[id]/reuse, /admin/courses/[id]/recyclebin | /backup/import.php?id=, /admin/tool/recyclebin/index.php?contextid= | Chưa dựng |
| USER-01..03 | /admin/users, /admin/users/new, /admin/users/[id]/edit, /admin/users/upload | /admin/user.php, /user/editadvanced.php?id=-1, ?id=, /admin/tool/uploaduser/index.php | Chưa dựng |
| COH-01, 02 | /admin/cohorts | /cohort/index.php | Chưa dựng |
| RPT-01, 02 | /admin/reports, /admin/reports/[reportId] | /reportbuilder/index.php, /reportbuilder/view.php?id= | Chưa dựng |
| NOTI-01 | /admin/calendar | /calendar/view.php?view=month | Chưa dựng |
| NOTI-02, HOME-03 | /admin/announcements, /admin/announcements/new | /mod/forum/view.php?f=, /mod/forum/post.php?forum= | Chưa dựng |
| CERT-01 | - | /badges, chưa có plugin | Không dựng (chờ chốt plugin) |
| HOME-02, HOME-04 | - | /?redirect=0 | Không dựng (HOME-01 đặt Tổng quan làm trang đầu) |

## Câu hỏi cho BA (admin)

1. Ngân hàng câu hỏi trên sidebar (SHELL-03): Moodle 5.1 chỉ có bank theo từng khóa (`/question/banks.php?courseid=`),
   không có trang cấp site. Mockup đề xuất trang chọn khóa rồi vào bank của khóa. Có chấp nhận không?
2. Bài kiểm tra, bài học admin thêm trong mockup không hiện bên learner (đã chốt: chỉ lưu store admin).
   Khi trình bày cần nói rõ đây là giới hạn của mockup, không phải của Moodle.
3. Bài chờ chấm (DASH-01, DASH-03): nội dung mẫu chỉ có 1 bài nộp (Bài thu hoạch, Rejuran Internal Training Phần 4,
   không tính hoàn thành), mock 2 bài nộp, 1 chờ chấm (`src/lib/mock/admin/submissions.ts`). VIGO có dùng bài nộp
   rộng rãi không (liên quan câu 3 phía learner), hay thay chỉ số này bằng "học viên hết lượt chưa đạt"?
4. Video Drive (ACT-02, CED-01): mockup dựng theo hướng A (module `mod_drivevideo` riêng: tên, link Drive, thời lượng,
   xem trước) cho khớp learner. Chưa chốt (Điểm chưa chốt số 2, người chốt: Thiện, Đạt Trần, Duy).
5. Phòng ban (ENR-02, USER-01, USER-02, COH-01): mockup theo đề xuất BA, cohort là chuẩn ghi danh và có thêm
   profile field `phongban` để hiện trên danh sách. Chưa chốt (Điểm chưa chốt số 3, người chốt: Thiện).
6. Field core "Department" của Moodle đang dùng làm chức danh ("Nhân viên chuyên môn", khớp hồ sơ learner),
   phòng ban nằm ở cohort và profile field. Xác nhận cách dùng này.
7. Các điểm chưa chốt còn lại trong backlog: ngôn ngữ admin (SHELL-06), 4 chỉ số Tổng quan (DASH-01),
   mặc định quiz và rule pass (QUIZ-01, ACT-06; mockup dùng 3 lượt, đạt 8/10, điểm cao nhất như learner),
   JS sắp xếp form (ACT-04, CSET-02, COMP-01), plugin chứng nhận (CERT-01), tổ chức question bank (QUIZ-06).
8. Tổng quan (DASH-01): "Học viên hoạt động 30 ngày" lấy lần truy cập cuối (user.lastaccess) hoặc hoạt động học gần nhất;
   "Tỉ lệ hoàn thành" = số lượt ghi danh (học viên x khóa đang hiển thị) đã hoàn thành khóa. Cần chốt công thức với Vi.
   Thẻ "Học viên hoạt động" trỏ tới báo cáo thứ 5 "Học viên hoạt động" (ngoài 4 báo cáo RPT-01).
9. Khóa học của tôi (MYC): Moodle chỉ hiện khóa người xem được ghi danh. Mockup ghi danh tài khoản Phòng Đào tạo vai trò
   Giảng viên ở mọi khóa. Thực tế Manager có muốn tự ghi danh vào mọi khóa không, hay xem khóa qua Quản lý khóa?
10. Bảng chọn loại bài (ACT-01): "Thông báo" trong 7 loại đang hiểu là mod_forum loại Thông báo. Đúng ý VIGO không,
    hay là Văn bản và hình ảnh (mod_label)? "Liên kết" (mod_url) đang có trong nội dung mẫu nhưng nằm ở tab Tất cả.
11. Mặc định hoàn thành (ACT-06): mockup đặt Tài liệu = Xem bài theo backlog, trong khi nội dung learner hiện tại
    để Tài liệu là học viên tự đánh dấu (LEARN-09). Chốt một quy tắc.
12. Xem như học viên (CED-07): mockup mở learner portal, khóa đang ẩn thì nút bị tắt vì learner không có khóa ẩn.
    Moodle thật dùng Switch role, xem được cả khóa ẩn.
