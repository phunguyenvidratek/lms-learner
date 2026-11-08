/** Admin SHELL: trang không tồn tại trong khu quản trị */
import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Không tìm thấy trang"
      description="Đường dẫn không đúng hoặc nội dung đã bị xóa."
      action={
        <Button asChild>
          <Link href="/admin">Về Tổng quan</Link>
        </Button>
      }
      className="mx-auto mt-10 max-w-[1200px]"
    />
  );
}
