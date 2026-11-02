import type { NextConfig } from "next";

// Mockup chạy hoàn toàn bằng mock data, nên tắt Cache Components cho đơn giản.
// Khi nối Moodle thật, cân nhắc bật lại theo docs trong node_modules/next/dist/docs.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
