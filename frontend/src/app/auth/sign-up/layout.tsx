import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — AIROS",
  description: "Create your AIROS account to start researching.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
