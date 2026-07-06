"use client";

import { motion } from "framer-motion";
import type { GraphNode } from "../types";

interface GraphNodeCardProps {
  node: GraphNode;
}

export default function GraphNodeCard({ node }: GraphNodeCardProps) {
  const isPending = node.status === "pending";
  const isRunning = node.status === "running";
  const isCompleted = node.status === "completed";

  // Visual classes based on status
  const cardStyles = isPending
    ? "bg-transparent opacity-40 text-[--text-muted]"
    : isRunning
    ? "bg-indigo-500/5 text-white border-l-2 border-indigo-500 shadow-[inset_1px_0_0_rgba(99,102,241,0.05)] scale-[1.005]"
    : "bg-transparent text-white border-l-2 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.06)]";

  const statusBadgeStyles = isPending
    ? "bg-white/[0.02] text-[--text-muted] border-white/[0.04]"
    : isRunning
    ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.15)] animate-pulse"
    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.12)] animate-pulse";

  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`flex items-center justify-between p-2.5 transition-all duration-300 ${cardStyles}`}
    >
      {/* Node Info & Icon */}
      <div className="flex items-center gap-3">
        {/* Execution Order Circle */}
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[9px] font-bold border transition-colors duration-300 ${
            isPending
              ? "border-white/[0.06] bg-white/[0.02] text-[--text-muted]"
              : isRunning
              ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {node.executionOrder}
        </div>

        {/* Node Identification details */}
        <div className="flex items-center gap-3">
          <h4 className="text-xs font-bold tracking-wide text-white">
            {node.name}
          </h4>
          {isRunning && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-airos-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-airos-400" />
            </span>
          )}
          
          {/* Dependencies text */}
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[--text-muted] hidden sm:flex">
            <span>DEP:</span>
            {node.dependencies.length > 0 ? (
              <span className="text-[--text-secondary] uppercase bg-white/[0.02] px-1 py-0.2 rounded border border-white/[0.03]">
                {node.dependencies.join(", ")}
              </span>
            ) : (
              <span className="text-[--text-muted] italic">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Node runtime and state indicators */}
      <div className="flex items-center gap-4">
        {/* Runtime metric */}
        <div className="flex items-center gap-1.5 text-[9px] font-mono">
          <span className="text-[--text-muted]">EST:</span>
          <span className="text-[--text-secondary] font-semibold">
            {node.estimatedRuntime}
          </span>
        </div>

        {/* Status indicator */}
        <div className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider transition-colors duration-300 ${statusBadgeStyles}`}>
          {isRunning && (
            <svg className="animate-spin h-2.5 w-2.5 text-indigo-300" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {isCompleted && (
            <svg className="h-2.5 w-2.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          <span>{node.statusText || node.status}</span>
        </div>
      </div>
    </motion.div>
  );
}
