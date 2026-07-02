"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import RouteGuard from "@/features/auth/guards/RouteGuard";
import {
  useResearch,
  RESEARCH_DEPTH_LABELS,
  RESEARCH_TYPE_LABELS,
} from "@/features/workspace";
import type { ResearchProject } from "@/features/workspace";

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

/* ── Detail card ── */

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wider text-[--text-muted]">
        {label}
      </p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

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
    <div className="min-h-screen bg-surface-primary">
      {/* Top bar */}
      <header className="border-b border-white/[0.04] bg-surface-secondary/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4 lg:px-8">
          <Link
            href="/workspace"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[--text-muted] transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Workspace
          </Link>
          <div className="h-4 w-px bg-white/[0.06]" />
          <span className="truncate text-sm font-medium text-white">
            {project.title}
          </span>
          <div className="ml-auto">
            <StatusBadge status={project.status} />
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-6 py-8 lg:px-8"
      >
        {/* Title section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
            {project.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[--text-secondary]">
            {project.topic}
          </p>
        </motion.div>

        {/* Details grid */}
        <motion.div
          variants={itemVariants}
          className="glass-panel glow-ring mb-8 grid grid-cols-2 gap-6 rounded-2xl p-6 sm:grid-cols-4"
        >
          <DetailItem
            label="Research Depth"
            value={RESEARCH_DEPTH_LABELS[project.researchDepth]}
          />
          <DetailItem
            label="Research Type"
            value={RESEARCH_TYPE_LABELS[project.researchType]}
          />
          <DetailItem
            label="Created"
            value={new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          />
          <DetailItem
            label="Papers"
            value={String(project.paperCount)}
          />
        </motion.div>

        {/* Description */}
        {project.description && (
          <motion.div variants={itemVariants} className="glass-panel glow-ring mb-8 rounded-2xl p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[--text-muted]">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-[--text-secondary]">
              {project.description}
            </p>
          </motion.div>
        )}

        {/* PDF */}
        {project.uploadedPdfName && (
          <motion.div variants={itemVariants} className="glass-panel glow-ring mb-8 rounded-2xl p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[--text-muted]">
              Uploaded Document
            </h2>
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              </svg>
              <span className="text-sm text-white">
                {project.uploadedPdfName}
              </span>
            </div>
          </motion.div>
        )}

        {/* Placeholder for future research workflow */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center py-12 text-center"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-airos-500/10">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white">
            Research workflow coming soon
          </p>
          <p className="mt-1 max-w-xs text-xs text-[--text-muted]">
            AI-powered research agents will process your project here.
          </p>
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
