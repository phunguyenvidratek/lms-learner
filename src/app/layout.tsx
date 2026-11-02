import type { Metadata } from "next";
// Font tự host qua npm để build được cả khi mạng chặn Google Fonts
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "VIGO LMS", template: "%s | VIGO LMS" },
  description: "Cổng học tập nội bộ VIGO (mockup learner portal)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-dvh font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
