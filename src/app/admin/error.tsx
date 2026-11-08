"use client";

/** Admin SHELL: lỗi tải trang, có nút thử lại */
import { WifiOff } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState
      icon={WifiOff}
      title="Không tải được trang"
      description="Kết nối tới hệ thống đang gián đoạn. Kiểm tra mạng và thử lại."
      action={<Button onClick={reset}>Thử lại</Button>}
      className="mx-auto mt-10 max-w-[1200px]"
    />
  );
}
