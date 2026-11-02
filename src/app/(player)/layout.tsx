import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";

/**
 * Layout riêng cho màn học bài và làm quiz (LEARN-01): thanh trên tối, không có sidebar app,
 * tham chiếu docs/reference/udemy/02-player.jpg.
 */
export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-card">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-player px-4 text-player-foreground">
        <Link href="/courses" className="flex items-center gap-1 text-sm text-white/80 hover:text-white">
          <ChevronLeft className="size-4" /> Khóa học
        </Link>
        <span className="h-6 w-px bg-white/20" />
        <Logo inverted className="scale-75 origin-left" />
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
