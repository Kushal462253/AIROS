import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace — AIROS",
  description: "Your AIROS research workspace.",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
