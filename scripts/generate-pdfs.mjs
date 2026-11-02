/**
 * Sinh file PDF tài liệu học tập trong public/files từ nội dung bài đọc (src/lib/mock/pages.ts).
 * Chạy: node scripts/generate-pdfs.mjs (cần Node 22.18+ để import file .ts, và playwright).
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { pageContents } from "../src/lib/mock/pages.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public/files");
mkdirSync(out, { recursive: true });

const courses = {
  "vigo-ov": { id: 16, name: "Overview Brand VIGO", sections: 3 },
  "rjr-found": { id: 13, name: "Nền tảng Rejuran và đánh giá da", sections: 3 },
  "rjr-int": { id: 11, name: "Rejuran Internal Training", sections: 4 },
  "safe-01": { id: 12, name: "An toàn và xử lý biến chứng", sections: 3 },
  "rjr-tech": { id: 14, name: "Kỹ thuật tiêm Rejuran trong Y tế", sections: 3 },
  "rjr-adv": { id: 15, name: "Ứng dụng chuyên sâu và phối hợp", sections: 3 },
};

const font = (w, subset) =>
  pathToFileURL(join(root, `node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-${subset}-${w}-normal.woff2`)).href;
const fontFaces = [400, 600, 700]
  .flatMap((w) => ["latin", "vietnamese"].map((s) => `@font-face{font-family:BVP;font-weight:${w};src:url(${font(w, s)}) format("woff2");}`))
  .join("\n");

const html = (course, n, body) => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>
${fontFaces}
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: BVP, sans-serif; color: #101828; font-size: 12.5pt; line-height: 1.65; }
.top { background: #0033a0; color: #fff; padding: 28px 48px 26px; }
.brand { font-weight: 700; font-size: 22pt; letter-spacing: -0.5px; line-height: 1; }
.tag { font-size: 6.5pt; letter-spacing: 3px; font-weight: 600; opacity: .85; margin-top: 3px; }
.meta { margin-top: 22px; font-size: 9.5pt; opacity: .85; text-transform: uppercase; letter-spacing: 1.5px; }
.title { font-size: 19pt; font-weight: 700; margin-top: 4px; line-height: 1.3; }
main { padding: 26px 48px 90px; }
h2 { color: #0033a0; font-size: 15pt; margin: 18px 0 8px; }
h3 { color: #002a85; font-size: 12.5pt; margin: 16px 0 6px; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10.5pt; }
th { background: #eef3fc; color: #002a85; text-align: left; }
th, td { border: 1px solid #d0d5dd; padding: 7px 10px; vertical-align: top; }
ul, ol { padding-left: 22px; }
footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 14px 48px; font-size: 8.5pt; color: #667085; border-top: 1px solid #e4e7ec; display: flex; justify-content: space-between; }
</style></head><body>
<div class="top"><div class="brand">VIGO</div><div class="tag">SCIENCE FOR CARE</div>
<div class="meta">Tài liệu học tập • ${course.name}</div><div class="title">Phần ${n}</div></div>
<main>${body}</main>
<footer><span>Tài liệu nội bộ VIGO. Không phát hành ra bên ngoài.</span><span>Phòng Đào tạo VIGO</span></footer>
</body></html>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
for (const [short, course] of Object.entries(courses)) {
  for (let n = 1; n <= course.sections; n++) {
    const body = pageContents[course.id * 100 + n * 10 + 3];
    if (!body) continue;
    await page.setContent(html(course, n, body), { waitUntil: "networkidle" });
    await page.pdf({ path: join(out, `${short}-phan-${n}.pdf`), format: "A4", printBackground: true });
    console.log("Đã tạo", `${short}-phan-${n}.pdf`);
  }
}
await browser.close();
