import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — AIROS",
  description: "Set a new password for your AIROS account.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
