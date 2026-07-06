"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import RouteGuard from "@/features/auth/guards/RouteGuard";
import { useResearch } from "@/features/workspace";
import type { ResearchProject } from "@/features/workspace";
import { ResearchDashboard } from "@/features/dashboard";
import { MemoryProvider } from "@/features/memory";

/* ── Animation ── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ── Status badge ── */

function StatusBadge({ status }: { status: ResearchProject["status"] }) {
  const colors: Record<string, string> = {
    planning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] ?? colors.planning}`}
    >
      {status}
    </span>
  );
}

/* ── Page content ── */

function ProjectContent() {
  const params = useParams();
  const router = useRouter();
  const { getProject } = useResearch();

  const projectId = params.projectId as string;
  const project = getProject(projectId);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel glow-ring rounded-2xl p-10 text-center"
        >
          <div className="mb-6 flex justify-center">
            <Logo size={28} />
          </div>
          <h1 className="mb-2 text-xl font-bold text-white">
            Project not found
          </h1>
          <p className="mb-6 text-sm text-[--text-secondary]">
            This research project doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/workspace"
            className="
              inline-flex items-center gap-2 rounded-xl bg-airos-600 px-5 py-2.5
              text-sm font-semibold text-white transition-all duration-200
              hover:bg-airos-500 hover:shadow-lg hover:shadow-airos-600/20
            "
          >
            ← Back to Workspace
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-primary overflow-hidden relative research-os-grid">
      {/* Ambient background particles glow */}
      <div className="ambient-aurora-glow" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/[0.04] bg-[#0a0a0f]/60 backdrop-blur-xl">
        <div className="flex items-center gap-4 px-6 py-2.5">
          <Link
            href="/workspace"
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-mono tracking-wide text-[--text-muted] transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            WORKSPACE
          </Link>
          <div className="h-3 w-px bg-white/[0.08]" />
          <span className="truncate text-xs font-mono text-[--text-muted]">
            PROJECTS
          </span>
          <span className="text-xs text-white/20">/</span>
          <span className="truncate text-xs font-bold text-white font-mono tracking-wide">
            {project.title.toUpperCase()}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] font-mono text-[--text-muted] hidden md:inline">Topic: {project.topic}</span>
            <StatusBadge status={project.status} />
          </div>
        </div>
      </header>

      {/* Content wrapper filling the screen */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full overflow-hidden p-4 relative z-10"
      >
        {/* Dashboard root view with Memory Provider scope */}
        <motion.div variants={itemVariants} className="h-full w-full">
          <MemoryProvider projectId={project.id}>
            <ResearchDashboard project={project} />
          </MemoryProvider>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <RouteGuard requireAuth>
      <ProjectContent />
    </RouteGuard>
  );
}
