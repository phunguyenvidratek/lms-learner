/**
 * Kiểm tra luồng chính của admin portal qua giao diện:
 * 1. Mọi route admin mở được, không lỗi, không cuộn ngang ở 375px.
 * 2. Soạn nội dung: mở bảng chọn, thêm Bài video Drive, bài mới hiện ở trang khóa; kéo thả file tạo bài Tài liệu.
 * 3. Bài kiểm tra: sửa cài đặt, nhập câu hỏi Excel 3 bước.
 * 4. Hoàn thành khóa: câu tóm tắt đổi khi tick.
 * 5. Ghi danh phòng ban vào khóa nháp: số học viên đổi, cảnh báo "chưa có học viên" mất.
 * 6. Số liệu admin khớp learner: học viên học xong một bài bên learner, % ở báo cáo admin đổi theo.
 * Chạy: node scripts/e2e-admin.mjs [baseUrl] [outDir]
 */
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const [base = "http://localhost:3000", out = "screenshots"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !/Download the React DevTools|favicon/.test(m.text()) && errors.push(m.text()));
const step = (s) => console.log("•", s);

async function open(path) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
}

// Dữ liệu sạch
await open("/admin?reset=1");
await page.getByRole("heading", { name: "Tổng quan" }).waitFor();

// ---------- 2. Soạn nội dung ----------
await open("/admin/courses/11/edit");
await page.getByRole("button", { name: "Thêm bài học" }).nth(2).click();
await page.getByRole("dialog").getByRole("button", { name: /Bài video/ }).click();
await page.waitForURL(/modedit\?add=drivevideo&section=2/);
await page.getByRole("button", { name: "Lưu và quay lại khóa" }).click();
assert.ok(await page.getByText("Nhập tên bài học.").isVisible(), "Báo lỗi khi thiếu tên");
await page.getByLabel("Tên").fill("Video mới: Phác đồ Rejuran HB");
await page.getByLabel("Link Google Drive").fill("https://drive.google.com/file/d/1AbCdEf123/view");
assert.ok(await page.locator('iframe[title="Xem trước video"]').isVisible(), "Có xem trước video Drive");
await page.getByRole("button", { name: "Mở sau bài trước" }).click();
await page.getByRole("button", { name: "Lưu và quay lại khóa" }).click();
await page.waitForURL(/\/admin\/courses\/11\/edit/);
const row = page.locator("li[id^=cm-]", { hasText: "Video mới: Phác đồ Rejuran HB" });
await row.waitFor();
assert.ok(await row.getByText("Xem 90% video").isVisible(), "Bài mới có chip hoàn thành mặc định");
assert.ok(await row.getByText(/Mở sau: Kiểm tra Phần 2/).isVisible(), "Bài mới có chip điều kiện mở");
step("Thêm Bài video Drive, bài hiện ở trang khóa với chip hoàn thành và điều kiện mở");

await page.locator('input[type="file"]').first().setInputFiles([
  { name: "Quy-trinh-tu-van.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") },
  { name: "Slide-buoi-2.pptx", mimeType: "application/vnd.ms-powerpoint", buffer: Buffer.from("pptx") },
]);
await page.getByText("Đã tạo 2 bài Tài liệu từ file.").waitFor();
assert.ok(await page.locator("li[id^=cm-]").getByText("Quy-trinh-tu-van", { exact: true }).isVisible());
step("Chọn 2 file tạo 2 bài Tài liệu");

await page.screenshot({ path: join(out, "admin-e2e-editor.png") });

// ---------- 3. Bài kiểm tra ----------
await open("/admin/courses/17/modedit?update=1712");
await page.getByRole("spinbutton", { name: "Điểm đạt" }).fill("7");
await page.getByLabel("Số lần làm").selectOption("2");
await page.getByRole("button", { name: "Lưu và xem" }).click();
await page.waitForURL(/\/admin\/quiz\/1712\/edit/);
await page.getByText("Bài kiểm tra chưa có câu hỏi").waitFor();
assert.ok(await page.getByText(/2 lượt làm · Đạt từ 7\/10/).isVisible(), "Cài đặt quiz đã lưu");
step("Sửa cài đặt bài kiểm tra (điểm đạt, số lần làm)");

await page.getByRole("link", { name: "Thêm câu hỏi từ Excel" }).first().click();
await page.getByRole("button", { name: "Tiếp tục" }).click();
await page.getByLabel("Chọn file câu hỏi").setInputFiles({ name: "cau-hoi.xlsx", mimeType: "application/octet-stream", buffer: Buffer.from("x") });
await page.getByText("6 câu hợp lệ").waitFor();
assert.ok(await page.getByText("2 dòng lỗi").isVisible());
assert.ok(await page.getByText("Thiếu nội dung câu hỏi.").isVisible(), "Lỗi theo dòng và cột");
await page.getByRole("button", { name: "Nhập 6 câu" }).click();
await page.waitForURL(/\/admin\/quiz\/1712\/edit/);
await page.getByText("6 câu ·").waitFor();
step("Nhập Excel 3 bước: 6 câu hợp lệ, 2 dòng lỗi được báo theo cột, nhập 6 câu");

await open("/admin");
assert.equal(await page.getByText("Bài kiểm tra chưa có câu hỏi: Kiểm tra Phần 1").count(), 0, "Cảnh báo quiz chưa có câu hỏi đã mất");
step("Tổng quan bỏ cảnh báo quiz chưa có câu hỏi");

// ---------- 4. Hoàn thành khóa ----------
await open("/admin/courses/12/completion");
const sentence = page.locator('[aria-live="polite"]');
assert.match(await sentence.innerText(), /hoàn thành 13 bài học và đạt 3 bài kiểm tra/);
await page.getByText("Kiểm tra Phần 3", { exact: true }).click();
assert.match(await sentence.innerText(), /hoàn thành 13 bài học và đạt 2 bài kiểm tra/, "Câu tóm tắt đổi khi bỏ tick");
await page.getByRole("button", { name: "Hủy thay đổi" }).click();
step("Câu tóm tắt quy tắc hoàn thành đổi ngay khi tick");

// ---------- 5. Ghi danh phòng ban, đồng bộ tự động ----------
await open("/admin/courses/17/participants");
await page.getByText("Khóa chưa có học viên").waitFor();
await open("/admin/courses/17/enrolments");
await page.getByRole("button", { name: "Thêm đồng bộ phòng ban" }).click();
await page.getByRole("dialog").getByRole("combobox").first().selectOption({ label: "Marketing (3 người)" });
await page.getByRole("dialog").getByRole("button", { name: "Thêm" }).click();
await page.getByText("Đồng bộ phòng ban: Marketing").waitFor();
await open("/admin/courses/17/participants");
await page.getByText("3 học viên, 2 giảng viên").waitFor();
step("Đồng bộ phòng ban Marketing vào khóa nháp: 3 học viên");

await open("/admin/users/new");
await page.locator("#u-lastname").fill("Đào");
await page.locator("#u-firstname").fill("Minh Tú");
await page.locator("#u-email").fill("minhtu.dao@vigo.vn");
await page.locator("#u-username").fill("minhtu.dao");
await page.locator("#u-cohort").selectOption({ label: "Marketing" });
await page.getByRole("button", { name: "Tạo người dùng" }).click();
await page.waitForURL(/\/admin\/users$/);
await page.getByText("minhtu.dao@vigo.vn").waitFor();
await open("/admin/courses/17/participants");
await page.getByText("4 học viên, 2 giảng viên").waitFor();
assert.ok(await page.getByText("Đào Minh Tú").isVisible(), "Người mới vào phòng ban tự có trong khóa đồng bộ");
step("Thêm người dùng mới vào Marketing: tự vào khóa đồng bộ (4 học viên)");

await open("/admin");
assert.equal(await page.getByText("Khóa chưa có học viên: Chăm sóc da tại nhà sau điều trị").count(), 0);
step("Tổng quan bỏ cảnh báo khóa chưa có học viên");

// ---------- 6. Số liệu admin khớp learner ----------
const learnerPct = async () => {
  await open("/admin/courses/11/participants");
  await page.getByLabel("Tìm theo tên hoặc email").fill("Trần Minh Anh");
  return page.locator("tr", { hasText: "Trần Minh Anh" }).locator("span.tabular-nums").innerText();
};
const before = await learnerPct();
await page.evaluate(() => {
  const key = "vigo-lms:state:v1";
  const s = JSON.parse(localStorage.getItem(key));
  s.session = { username: "minhanh.tran", via: "password", at: Math.floor(Date.now() / 1000) };
  localStorage.setItem(key, JSON.stringify(s));
});
await open("/learn/11/1113");
await page.waitForTimeout(800);
const after = await learnerPct();
assert.notEqual(after, before, `% của Trần Minh Anh phải đổi (trước ${before}, sau ${after})`);
step(`Học viên mở bài đọc bên learner, % ở admin đổi theo: ${before} -> ${after}`);

if (errors.length) {
  console.error("Lỗi trên trang:", errors);
  process.exitCode = 1;
}
await browser.close();
console.log(errors.length ? "Có lỗi." : "Luồng admin chạy trọn vẹn.");
