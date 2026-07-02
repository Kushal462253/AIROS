import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Project — AIROS",
  description: "View and manage your AIROS research project.",
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
