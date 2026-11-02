"use client";

import { WifiOff } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

/** SHELL-04: lỗi tải dữ liệu, có nút thử lại */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState
      icon={WifiOff}
      title="Không tải được dữ liệu"
      description="Kết nối tới hệ thống học tập đang gián đoạn. Kiểm tra mạng và thử lại."
      action={<Button onClick={reset}>Thử lại</Button>}
      className="mt-10"
    />
  );
}
