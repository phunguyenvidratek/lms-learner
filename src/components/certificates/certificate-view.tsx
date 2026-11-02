"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Award, Download } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { courseGrade } from "@/lib/learning";
import { formatGrade, useLearning } from "@/lib/store/learning-store";
import { formatDate, formatDuration } from "@/lib/utils";
import type { SiteInfo } from "@/types/moodle";
import { certificateCode } from "./certificate-code";

/** CERT-01: bản chứng nhận A4 ngang mang thương hiệu VIGO. Tải xuống = in ra PDF (window.print). */
export function CertificateView({ courseId, user, autoPrint }: { courseId: number; user: SiteInfo; autoPrint?: boolean }) {
  const { course, quizzes } = useLearning();
  const view = course(courseId)!;
  const issued = view.completedAt;
  const grade = courseGrade(quizzes.filter((q) => q.course.info.id === courseId));

  useEffect(() => {
    if (!autoPrint || !issued) return;
    const t = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(t);
  }, [autoPrint, issued]);

  if (view.status !== "completed" || !issued) {
    return (
      <EmptyState
        icon={Award}
        title="Chưa có chứng nhận cho khóa này"
        description={`Hoàn thành khóa ${view.info.fullname} và đạt các bài kiểm tra để nhận chứng nhận.`}
        action={
          <Button asChild>
            <Link href={`/courses/${courseId}`}>Đến khóa học</Link>
          </Button>
        }
      />
    );
  }

  const code = certificateCode(courseId, user.userid, issued);

  return (
    <div className="space-y-5 print:space-y-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" className="-ml-3">
          <Link href="/certificates">
            <ArrowLeft /> Tất cả chứng nhận
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Download /> Tải xuống PDF
        </Button>
      </div>

      <div className="@container mx-auto w-full max-w-5xl print:m-0 print:w-[297mm] print:max-w-none">
        <div className="relative aspect-[297/210] w-full overflow-hidden bg-white text-foreground shadow-lg print:h-[210mm] print:w-[297mm] print:shadow-none">
          <div className="absolute -top-[14cqw] -right-[14cqw] size-[34cqw] rounded-full bg-brand-50" />
          <div className="absolute -bottom-[16cqw] -left-[12cqw] size-[32cqw] rounded-full bg-brand-50" />
          <div className="absolute inset-[2.2cqw] border-[0.35cqw] border-primary" />
          <div className="absolute inset-[3.2cqw] border-[0.12cqw] border-brand-300" />

          <div className="relative flex h-full flex-col items-center px-[9cqw] pt-[6.5cqw] pb-[5.5cqw] text-center">
            <div className="leading-none">
              <p className="text-[4.2cqw] font-extrabold tracking-tight text-primary">VIGO</p>
              <p className="mt-[0.5cqw] text-[1cqw] font-semibold tracking-[0.3em] text-primary">SCIENCE FOR CARE</p>
            </div>
            <p className="mt-[3cqw] text-[1.25cqw] font-semibold tracking-[0.35em] text-brand-700">CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC</p>
            <p className="mt-[2.4cqw] text-[1.5cqw] text-muted-foreground">Chứng nhận</p>
            <p className="mt-[0.6cqw] font-serif text-[4.6cqw] leading-tight text-brand-950 italic">{user.fullname}</p>
            <div className="mt-[0.8cqw] h-[0.12cqw] w-[30cqw] bg-brand-200" />
            <p className="mt-[1.6cqw] text-[1.5cqw] text-muted-foreground">
              {user.department} • {user.institution}
            </p>
            <p className="mt-[1.6cqw] text-[1.5cqw]">đã hoàn thành chương trình đào tạo nội bộ</p>
            <p className="mt-[0.8cqw] max-w-[70cqw] text-[2.6cqw] leading-tight font-bold text-primary">{view.info.fullname}</p>
            <p className="mt-[1.2cqw] text-[1.3cqw] text-muted-foreground">
              Thời lượng {formatDuration(view.counts.duration)} • {view.counts.quizzes} bài kiểm tra
              {grade !== null && ` • Điểm trung bình ${formatGrade(grade)}/10`}
            </p>

            <div className="mt-auto grid w-full grid-cols-3 items-end text-[1.2cqw]">
              <div className="text-left">
                <p className="text-muted-foreground">Ngày cấp</p>
                <p className="font-semibold">{formatDate(issued)}</p>
              </div>
              <div className="flex justify-center">
                <div className="flex size-[9cqw] flex-col items-center justify-center rounded-full border-[0.3cqw] border-primary text-primary">
                  <Award className="size-[3cqw]" />
                  <span className="mt-[0.2cqw] text-[0.85cqw] font-bold tracking-wider">VIGO</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif text-[2cqw] text-brand-800 italic">Phòng Đào tạo</p>
                <div className="ml-auto mt-[0.3cqw] h-[0.1cqw] w-[18cqw] bg-foreground/40" />
                <p className="mt-[0.4cqw] font-semibold">Phòng Đào tạo VIGO</p>
                <p className="text-muted-foreground">Mã chứng nhận: {code}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground print:hidden">
        Bấm Tải xuống PDF, chọn &quot;Lưu dưới dạng PDF&quot; trong hộp thoại in. Khổ giấy A4 ngang.
      </p>
    </div>
  );
}
