/**
 * Chụp màn hình các route để rà giao diện (1280px và 375px).
 * Chạy: node scripts/screenshot.mjs [baseUrl] [outDir] [route1 route2 ...]
 * Tự đăng nhập bằng tài khoản mẫu và khôi phục dữ liệu ban đầu trước khi chụp.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const [base = "http://localhost:3000", out = "screenshots", ...routes] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
for (const width of [1280, 375]) {
  const ctx = await browser.newContext({ viewport: { width, height: width > 500 ? 800 : 812 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}/login?reset=1`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const key = "vigo-lms:state:v1";
    const s = JSON.parse(localStorage.getItem(key));
    s.session = { username: "minhanh.tran", via: "password", at: Math.floor(Date.now() / 1000) };
    localStorage.setItem(key, JSON.stringify(s));
  });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const name = `${route.replace(/[/?=&]+/g, "_").replace(/^_/, "") || "root"}-${width}.png`;
    await page.screenshot({ path: join(out, name), fullPage: true });
    console.log(name);
  }
  await ctx.close();
}
await browser.close();
