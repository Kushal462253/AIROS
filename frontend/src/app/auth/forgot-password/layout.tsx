import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — AIROS",
  description: "Reset your AIROS account password.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
