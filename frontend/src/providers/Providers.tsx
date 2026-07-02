"use client";

import { AuthProvider } from "@/features/auth";
import { ResearchProvider } from "@/features/workspace";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ResearchProvider>{children}</ResearchProvider>
    </AuthProvider>
  );
}
