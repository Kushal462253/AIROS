"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function RouteGuard({
  children,
  requireAuth = true,
  redirectTo,
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo ?? "/auth/sign-in");
    }

    if (!requireAuth && isAuthenticated) {
      router.replace(redirectTo ?? "/workspace");
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-primary" role="status" aria-label="Loading">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-airos-500/20 border-t-airos-500" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}
