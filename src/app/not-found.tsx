import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

/** SHELL-04: trang 404 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <Logo className="mb-10" />
      <p className="text-7xl font-extrabold text-brand-100">404</p>
      <h1 className="mt-2 text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Trang bạn tìm không tồn tại hoặc đã được chuyển. Kiểm tra lại đường dẫn hoặc quay về trang Tổng quan.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/dashboard">Về Tổng quan</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/courses">Khóa học của tôi</Link>
        </Button>
      </div>
    </div>
  );
}
