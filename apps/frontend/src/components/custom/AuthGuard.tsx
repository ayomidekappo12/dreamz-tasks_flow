"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import useAuth from "@/lib/auth/auth"; // Consistent import

const PUBLIC_ROUTES = ["/auth"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    // UNAUTHENTICATED: Redirect to auth WITH returnTo parameter
    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      const safePath = pathname === "/" ? "/features/dashboard" : pathname;
      router.replace(`/auth?returnTo=${encodeURIComponent(safePath)}`);
      return;
    }

    // AUTHENTICATED ON AUTH PAGE: Redirect to returnTo or dashboard
    if (user && pathname === "/auth") {
      const returnTo = searchParams.get("returnTo") || "/features/dashboard";
      // Sanitize redirect target (prevent open redirect vulnerability)
      const safeReturn =
        returnTo.startsWith("/") && !returnTo.startsWith("//")
          ? returnTo
          : "/features/dashboard";
      router.replace(safeReturn);
      return;
    }

    // AUTHENTICATED ON ROOT: Redirect to dashboard
    if (user && pathname === "/") {
      router.replace("/features/dashboard");
    }
  }, [user, loading, pathname, router, searchParams]);

  if (loading) {
    return (
      <Suspense fallback={<div className="h-12" />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Suspense>
    );
  }

  return <>{children}</>;
}
