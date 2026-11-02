import { RequireAuth } from "@/components/common/require-auth";
import { PlayerSkeleton } from "@/components/common/skeletons";

/** Layout màn học bài và làm bài kiểm tra (LEARN-01): không có sidebar app, thanh trên do PlayerShell dựng. */
export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth fallback={<PlayerSkeleton />}>{children}</RequireAuth>;
}
