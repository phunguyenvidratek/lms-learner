/** Tìm phần tử tràn ngang ở màn hình 375px. Chạy: node scripts/find-overflow.mjs [baseUrl] route... */
import { chromium } from "playwright";
const [base, ...routes] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto(`${base}/login?reset=1`, { waitUntil: "networkidle" });
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("vigo-lms:state:v1"));
  s.session = { username: "minhanh.tran", via: "password", at: 0 };
  localStorage.setItem("vigo-lms:state:v1", JSON.stringify(s));
});
for (const r of routes) {
  await page.goto(base + r, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const res = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("body *").forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.right > 376 && b.width > 0) out.push(`${el.tagName}.${String(el.className).slice(0, 80)} right=${Math.round(b.right)}`);
    });
    return { sw: document.documentElement.scrollWidth, items: out.slice(0, 8) };
  });
  console.log(r, res.sw, "\n  " + res.items.join("\n  "));
}
await browser.close();
