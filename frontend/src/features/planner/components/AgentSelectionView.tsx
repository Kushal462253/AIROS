"use client";

import { motion } from "framer-motion";

const PIPELINE_STAGES = [
  {
    name: "Planner",
    purpose: "Formulates a structural research plan, defining objectives and core inquiries.",
    iconPath: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    stage: "Stage 1",
  },
  {
    name: "Retrieval",
    purpose: "Queries semantic databases, parses seed PDFs, and structures vector context chunks.",
    iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    stage: "Stage 2",
  },
  {
    name: "Evidence",
    purpose: "Extracts verified scientific claims and supporting context dynamically.",
    iconPath: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    stage: "Stage 3",
  },
  {
    name: "Knowledge Graph",
    purpose: "Connects semantic relations, concepts, and dependencies into an interactive network.",
    iconPath: "M18 3a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3zM6 15a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3zm12 0a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3zM18 9v6M9.5 16.5l5-4.5M6 9v6",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    stage: "Stage 4",
  },
  {
    name: "Research Copilot",
    purpose: "A unified system navigation console offering grounded chat interactions.",
    iconPath: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
    stage: "Stage 5",
  },
];

export default function AgentSelectionView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-airos-500/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Execution Pipeline</h3>
          <p className="text-xs text-[--text-secondary]">
            Sequential processing framework driving workspace operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PIPELINE_STAGES.map((stage) => {
          return (
            <motion.div
              key={stage.name}
              whileHover={{
                y: -4,
                borderColor: "rgba(99, 102, 241, 0.25)",
                backgroundColor: "rgba(26, 26, 46, 0.4)",
              }}
              transition={{ duration: 0.2 }}
              className="glass-panel flex flex-col justify-between rounded-xl border border-white/[0.04] p-4 relative overflow-hidden bg-surface-secondary/20"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stage.bg} ${stage.text}`}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={stage.iconPath} />
                    </svg>
                  </div>
                  
                  <span className="font-mono text-[8px] font-bold text-[--text-muted] uppercase tracking-wider">
                    {stage.stage}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white tracking-wide">
                  {stage.name}
                </h4>
                <p className="mt-1.5 text-[10px] leading-relaxed text-[--text-secondary]">
                  {stage.purpose}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
