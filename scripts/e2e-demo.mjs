/**
 * Chạy trọn luồng trình bày qua giao diện, không sửa tay dữ liệu:
 * 1. Đăng nhập, vào Tổng quan, bấm Học tiếp.
 * 2. Xem video (tới 90%), đọc bài, đánh dấu tài liệu, mở liên kết.
 * 3. Làm bài kiểm tra trượt, xem lại đáp án, làm lại và đạt.
 * 4. Phần 2 mở khóa, có thông báo.
 * 5. Tiến độ ở Tổng quan, Khóa học của tôi và Điểm cùng cập nhật.
 * Thêm: tài khoản nhanvienmoi bị bắt đổi mật khẩu.
 * Chạy: node scripts/e2e-demo.mjs [baseUrl] [outDir]
 */
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { quizQuestions } from "../src/lib/mock/questions.ts";

const [base = "http://localhost:3000", out = "screenshots"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const shot = (n) => page.screenshot({ path: join(out, `demo-${n}.png`), fullPage: true });
const step = (s) => console.log("•", s);

// 1. Đăng nhập
await page.goto(`${base}/dashboard?reset=1`, { waitUntil: "networkidle" });
await page.waitForURL(/\/login/);
await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
assert.ok(await page.getByText("Nhập tên đăng nhập và mật khẩu.").isVisible());
await page.getByLabel("Tên đăng nhập").fill("minhanh.tran");
await page.getByLabel("Mật khẩu", { exact: true }).fill("Vigo@2026");
await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
await page.waitForURL(/\/dashboard$/);
step("Đăng nhập xong, về lại trang trước (Tổng quan)");
await page.getByRole("link", { name: /Học tiếp/ }).first().click();
await page.waitForURL(/\/learn\/11\/1112/);
step("Học tiếp mở đúng bài 1112");

// 2. Xem video tới 90%
await page.waitForSelector("video");
await page.evaluate(async () => {
  const v = document.querySelector("video");
  if (!v.duration) await new Promise((r) => v.addEventListener("loadedmetadata", r, { once: true }));
  v.muted = true;
  v.currentTime = v.duration * 0.92;
  await v.play();
  await new Promise((r) => setTimeout(r, 800));
});
await page.getByText("Đã hoàn thành").first().waitFor();
await shot("1-video-done");
step("Video tự hoàn thành khi xem tới 90%");
await page.getByRole("link", { name: /Tiếp theo: Bài đọc/ }).last().click();
await page.waitForURL(/\/learn\/11\/1113/);
await page.getByText("Đã hoàn thành").first().waitFor();
step("Bài đọc tự hoàn thành khi mở");
await page.getByRole("link", { name: /Tiếp theo:/ }).last().click();
await page.waitForURL(/\/learn\/11\/1114/);
await page.getByRole("button", { name: "Đánh dấu hoàn thành" }).click();
step("Tài liệu PDF đánh dấu hoàn thành thủ công");
await page.getByRole("link", { name: /Tiếp theo:/ }).last().click();
await page.waitForURL(/\/learn\/11\/1115/);
const [popup] = await Promise.all([ctx.waitForEvent("page"), page.getByRole("link", { name: /Mở liên kết/ }).click()]);
await popup.close();
await page.getByText("Đã hoàn thành").first().waitFor();
step("Liên kết ngoài mở tab mới và hoàn thành");
await page.getByRole("link", { name: /Tiếp theo:/ }).last().click();
await page.waitForURL(/\/quiz\/1116/);

// 3. Bài kiểm tra: trượt, xem lại, làm lại và đạt
const qs = quizQuestions[1116];
async function answer(correct) {
  for (const q of qs) {
    const pick = correct ? q.correct : [q.options.find((o) => !q.correct.includes(o.value)).value];
    for (const v of pick) {
      await page.getByRole(q.type === "multichoiceset" ? "checkbox" : "radio", { name: q.options.find((o) => o.value === v).label, exact: true }).click();
    }
    if (q.slot < qs.length) await page.getByRole("button", { name: "Câu tiếp" }).click();
  }
  await page.getByRole("button", { name: "Xem lại và nộp bài" }).click();
  await page.getByRole("button", { name: "Nộp bài" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Nộp bài" }).click();
}
await page.getByRole("button", { name: "Bắt đầu làm bài" }).click();
await answer(false);
await page.getByText("Chưa đạt, hãy ôn lại và làm lại nhé").waitFor();
assert.ok(await page.getByText("Làm lại (còn 2 lượt)").isVisible());
await shot("2-quiz-fail");
step("Làm bài trượt, còn 2 lượt");
await page.getByRole("button", { name: "Xem lại đáp án" }).click();
await page.getByText("Đáp án đúng").first().waitFor();
await shot("3-quiz-review");
step("Xem lại đáp án");
await page.getByRole("button", { name: /Kết quả lần làm/ }).click();
await page.getByRole("button", { name: /Làm lại/ }).click();
await answer(true);
await page.getByText("Chúc mừng, bạn đã đạt!").waitFor();
await shot("4-quiz-pass");
step("Làm lại và đạt 10/10");

// 4. Phần 2 mở khóa, có thông báo
assert.ok(await page.getByText("Phần 2: Dòng sản phẩm và chỉ định đã được mở", { exact: false }).isVisible());
await page.getByRole("link", { name: "Học Phần 2" }).click();
await page.waitForURL(/\/learn\/11\/1121/);
assert.ok(!(await page.getByText("Bài học chưa mở").isVisible()));
step("Phần 2 mở khóa, vào được bài đầu Phần 2");
await page.goto(`${base}/notifications`, { waitUntil: "networkidle" });
await page.getByText("Bạn đã đạt Kiểm tra Phần 1").first().waitFor();
const badge = await page.getByRole("link", { name: /Thông báo, \d+ chưa đọc/ }).getAttribute("aria-label");
assert.match(badge, /4 chưa đọc/);
await shot("5-notifications");
step(`Có thông báo mới (${badge})`);

// 5. Tiến độ đồng bộ ở mọi màn: 6/21 hoạt động = 29%
await page.goto(`${base}/dashboard`, { waitUntil: "networkidle" });
assert.ok(await page.getByText("29% hoàn thành • 6/21 hoạt động").isVisible());
await shot("6-dashboard");
await page.goto(`${base}/courses`, { waitUntil: "networkidle" });
const card = page.locator("article", { hasText: "Rejuran Internal Training" });
assert.ok(await card.getByText("29%").isVisible());
await page.goto(`${base}/grades`, { waitUntil: "networkidle" });
assert.ok(await page.getByText("1/4 bài kiểm tra đạt • Tiến độ 29%").isVisible());
await shot("7-grades");
step("Tổng quan, Khóa học của tôi và Điểm cùng hiện 29%");

// AUTH-05
await page.getByRole("button", { name: /Trần Minh Anh/ }).click();
await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
await page.waitForURL(/\/login/);
await page.getByLabel("Tên đăng nhập").fill("nhanvienmoi");
await page.getByLabel("Mật khẩu", { exact: true }).fill("123456");
await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
await page.waitForURL(/\/change-password/);
await page.goto(`${base}/dashboard`);
await page.waitForURL(/\/change-password/);
step("nhanvienmoi bị chuyển sang đổi mật khẩu, không vào được Tổng quan");

assert.deepEqual(errors, [], "Lỗi JavaScript trên trang: " + errors.join("\n"));
console.log("Luồng trình bày chạy trọn vẹn.");
await browser.close();
