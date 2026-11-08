import { PageSkeleton } from "@/components/common/skeletons";

/** Admin SHELL: skeleton khi chuyển trang */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageSkeleton />
    </div>
  );
}
