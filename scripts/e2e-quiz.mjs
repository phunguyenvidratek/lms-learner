/**
 * Kiểm tra luồng bài kiểm tra: làm trượt, xem lại đáp án, làm lại và đạt, phần tiếp theo mở khóa.
 * Chạy: node scripts/e2e-quiz.mjs [baseUrl] [outDir]
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { quizQuestions } from "../src/lib/mock/questions.ts";

const [base = "http://localhost:3000", out = "screenshots"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const CM = 1116;
const questions = quizQuestions[CM];

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const shot = (n) => page.screenshot({ path: join(out, `quiz-${n}.png`), fullPage: true });

await page.goto(`${base}/login?reset=1`, { waitUntil: "networkidle" });
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("vigo-lms:state:v1"));
  s.session = { username: "minhanh.tran", via: "password", at: 0 };
  localStorage.setItem("vigo-lms:state:v1", JSON.stringify(s));
});

async function doAttempt(correct) {
  await page.getByRole("button", { name: /Bắt đầu làm bài|Làm lại/ }).first().click();
  for (const q of questions) {
    const pick = correct ? q.correct : [q.options.find((o) => !q.correct.includes(o.value)).value];
    for (const v of pick) {
      const label = q.options.find((o) => o.value === v).label;
      await page.getByRole(q.type === "multichoiceset" ? "checkbox" : "radio", { name: label, exact: true }).click();
    }
    if (q.slot === 2 && !correct) await shot("2-question");
    if (q.slot < questions.length) await page.getByRole("button", { name: "Câu tiếp" }).click();
  }
  await page.getByRole("button", { name: "Xem lại và nộp bài" }).click();
  await page.getByRole("button", { name: "Nộp bài" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Nộp bài" }).click();
  await page.waitForTimeout(400);
}

await page.goto(`${base}/quiz/${CM}`, { waitUntil: "networkidle" });
await shot("1-intro");
await doAttempt(false);
await shot("3-result-fail");
await page.getByRole("button", { name: "Xem lại đáp án" }).click();
await shot("4-review");
await page.getByRole("button", { name: /Kết quả lần làm/ }).click();
await page.getByRole("button", { name: /Làm lại/ }).click();
// đang ở chế độ làm bài, quay lại giới thiệu để dùng chung hàm
await page.goto(`${base}/quiz/${CM}`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Làm tiếp" }).click();
for (const q of questions) {
  for (const v of q.correct) {
    const label = q.options.find((o) => o.value === v).label;
    await page.getByRole(q.type === "multichoiceset" ? "checkbox" : "radio", { name: label, exact: true }).click();
  }
  if (q.slot < questions.length) await page.getByRole("button", { name: "Câu tiếp" }).click();
}
await page.getByRole("button", { name: "Xem lại và nộp bài" }).click();
await page.getByRole("button", { name: "Nộp bài" }).click();
await page.getByRole("dialog").getByRole("button", { name: "Nộp bài" }).click();
await page.waitForTimeout(400);
await shot("5-result-pass");
const unlocked = await page.getByText("Phần 2: Dòng sản phẩm và chỉ định").first().isVisible();
console.log("Phần 2 mở khóa:", unlocked);
await page.goto(`${base}/courses/11`, { waitUntil: "networkidle" });
await shot("6-course-after");
await browser.close();
