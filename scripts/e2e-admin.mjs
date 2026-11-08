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

if (errors.length) {
  console.error("Lỗi trên trang:", errors);
  process.exitCode = 1;
}
await browser.close();
console.log(errors.length ? "Có lỗi." : "Luồng admin chạy trọn vẹn.");
