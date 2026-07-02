import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — AIROS",
  description: "Sign in to your AIROS account.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
