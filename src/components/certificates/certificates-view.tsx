"use client";

import Link from "next/link";
import { Award, Download, Eye } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLearning } from "@/lib/store/learning-store";
import { formatDate } from "@/lib/utils";
import type { SiteInfo } from "@/types/moodle";
import { certificateCode } from "./certificate-code";

/** CERT-01: danh sách chứng nhận của khóa đã hoàn thành */
export function CertificatesView({ user }: { user: SiteInfo }) {
  const { courses } = useLearning();
  const earned = courses.filter((c) => c.status === "completed" && c.completedAt).sort((a, b) => b.completedAt! - a.completedAt!);
  const pending = courses.filter((c) => c.status === "inprogress");

  return (
    <div className="space-y-8">
      {earned.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {earned.map((c) => (
            <article key={c.info.id} className="overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md">
              <Link href={`/certificates/${c.info.id}`} className="block bg-brand-50 p-5">
                <div className="flex aspect-[297/210] flex-col items-center justify-center rounded-md border-4 border-double border-brand-300 bg-white px-4 text-center shadow-sm">
                  <span className="text-sm font-extrabold tracking-tight text-brand-600">VIGO</span>
                  <span className="mt-2 text-[9px] font-semibold tracking-[0.25em] text-brand-700">CHỨNG NHẬN HOÀN THÀNH</span>
                  <span className="mt-2 font-serif text-base text-foreground italic">{user.fullname}</span>
                  <span className="mt-1 line-clamp-2 text-[11px] font-semibold text-brand-800">{c.info.fullname}</span>
                </div>
              </Link>
              <div className="space-y-3 p-4">
                <div>
                  <p className="font-semibold">{c.info.fullname}</p>
                  <p className="text-sm text-muted-foreground">Ngày cấp {formatDate(c.completedAt!)}</p>
                  <p className="text-xs text-muted-foreground">Mã chứng nhận {certificateCode(c.info.id, user.userid, c.completedAt!)}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/certificates/${c.info.id}`}>
                      <Eye /> Xem
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href={`/certificates/${c.info.id}?download=1`}>
                      <Download /> Tải xuống
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState icon={Award} title="Chưa có chứng nhận" description="Hoàn thành khóa học và đạt các bài kiểm tra để nhận chứng nhận." action={<Button asChild><Link href="/courses">Đến khóa học của tôi</Link></Button>} />
      )}

      {pending.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Sắp đạt</h2>
          <ul className="divide-y rounded-xl border bg-card">
            {pending.map((c) => (
              <li key={c.info.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.info.fullname}</p>
                  <p className="text-sm text-muted-foreground">
                    Còn {c.total - c.done} hoạt động, {c.counts.quizzes - c.quizzesPassed} bài kiểm tra cần đạt
                  </p>
                </div>
                <div className="w-full space-y-1 sm:w-48">
                  <Progress value={c.progress} />
                  <p className="text-xs text-muted-foreground">{c.progress}% hoàn thành</p>
                </div>
                <Button asChild variant="outline-primary" size="sm">
                  <Link href={`/courses/${c.info.id}`}>Học tiếp</Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
