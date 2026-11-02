import type { Metadata } from "next";
// Font tự host qua npm để build được cả khi mạng chặn Google Fonts
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LearningProvider } from "@/lib/store/learning-store";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "VIGO Learning", template: "%s | VIGO Learning" },
  description: "Cổng học tập nội bộ VIGO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-dvh font-sans">
        <LearningProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </LearningProvider>
      </body>
    </html>
  );
}
