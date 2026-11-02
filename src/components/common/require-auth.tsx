"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FORCE_CHANGE_USERNAME, useLearning } from "@/lib/store/learning-store";

/**
 * AUTH-01, AUTH-04, AUTH-05: chưa đăng nhập hoặc hết phiên thì về /login?from=...,
 * tài khoản bị bắt đổi mật khẩu thì về /change-password trước khi học.
 */
export function RequireAuth({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const { ready, state } = useLearning();
  const router = useRouter();
  const pathname = usePathname();
  const session = state?.session;
  const mustChange = !!session && session.username === FORCE_CHANGE_USERNAME && !state?.passwordChanged.includes(session.username);

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      const from = pathname + window.location.search;
      router.replace(`/login?from=${encodeURIComponent(from)}`);
    } else if (mustChange) router.replace("/change-password");
  }, [ready, session, mustChange, pathname, router]);

  if (!ready || !session || mustChange) return <>{fallback}</>;
  return <>{children}</>;
}
