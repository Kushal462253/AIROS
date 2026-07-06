"use client";

import { motion } from "framer-motion";
import type { ExecutionPlan } from "../types";
import AgentSelectionView from "./AgentSelectionView";

interface ExecutionPlanViewProps {
  plan: ExecutionPlan;
}

export default function ExecutionPlanView({ plan }: ExecutionPlanViewProps) {
  // Complexity colors
  const complexityColors = {
    Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    Medium: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    High: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    Extreme: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-8"
    >
      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Metric: Complexity */}
        <div className="glass-panel glow-ring flex items-center justify-between rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[--text-muted] uppercase tracking-wider">Complexity</span>
            <h4 className="text-xl font-bold text-white tracking-tight">Research Level</h4>
          </div>
          <span className={`rounded-xl border px-3 py-1.5 font-mono text-sm font-bold uppercase ${complexityColors[plan.researchComplexity]}`}>
            {plan.researchComplexity}
          </span>
        </div>

        {/* Metric: Runtime */}
        <div className="glass-panel glow-ring flex items-center justify-between rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[--text-muted] uppercase tracking-wider">Estimated Runtime</span>
            <h4 className="text-xl font-bold text-white tracking-tight">{plan.estimatedRuntime}</h4>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        {/* Metric: Confidence Score */}
        <div className="glass-panel glow-ring flex flex-col justify-between rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[--text-muted] uppercase tracking-wider">Confidence Score</span>
              <h4 className="text-xl font-bold text-white tracking-tight">{plan.confidenceScore}%</h4>
            </div>
            
            {/* Radial visual indicator */}
            <div className="relative flex items-center justify-center h-12 w-12">
              <svg className="h-full w-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  className="stroke-white/[0.04]"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  className="stroke-airos-500"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - plan.confidenceScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-[10px] font-bold text-white">
                {plan.confidenceScore}
              </span>
            </div>
          </div>
          <p className="text-[9px] text-[--text-muted] leading-normal mt-3 pt-2.5 border-t border-white/[0.03] italic">
            {plan.confidenceScore >= 90
              ? "Excellent baseline consensus with dense domain publication metrics."
              : plan.confidenceScore >= 80
              ? "Strong source representation and high alignment mapping."
              : "Sufficient citation coverage, minor domain variance checks required."}
          </p>
        </div>
      </div>

      {/* Main content sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Research Summary & Objectives (Left columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="glass-panel glow-ring rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-airos-500 to-indigo-500" />
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[--text-muted]">
              Research Summary
            </h3>
            <p className="text-sm leading-relaxed text-white">
              {plan.summary}
            </p>
          </div>

          {/* Objectives */}
          <div className="glass-panel glow-ring rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[--text-muted]">
              Objectives
            </h3>
            <ul className="space-y-3.5">
              {plan.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 font-mono text-xs font-semibold mt-0.5 border border-indigo-500/20">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-[--text-secondary]">
                    {obj}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Questions & Strategy (Right column) */}
        <div className="space-y-6">
          {/* Research Questions */}
          <div className="glass-panel glow-ring rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[--text-muted]">
              Research Questions
            </h3>
            <div className="space-y-4">
              {plan.researchQuestions.map((q, i) => (
                <div key={i} className="space-y-1.5 border-b border-white/[0.04] pb-4 last:border-b-0 last:pb-0">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-airos-400">
                    RQ{i + 1}
                  </span>
                  <p className="text-xs font-medium leading-relaxed text-white">
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Search Strategy */}
          <div className="glass-panel glow-ring rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[--text-muted]">
                  Search Strategy
                </h3>
              </div>
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                plan.searchStrategy.searchPriority === "High"
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : plan.searchStrategy.searchPriority === "Medium"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
              }`}>
                {plan.searchStrategy.searchPriority} priority
              </span>
            </div>

            <div className="space-y-3 pt-1 text-[11px] leading-relaxed">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider block">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {plan.searchStrategy.keywords.map((k) => (
                    <span key={k} className="rounded bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 font-mono text-[9px] text-indigo-300">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider block">
                  Suggested Sources
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {plan.searchStrategy.suggestedSources.map((s) => (
                    <span key={s} className="rounded bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 font-mono text-[9px] text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 border-t border-white/[0.03] pt-2.5">
                <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider block">
                  Expected Evidence
                </span>
                <p className="text-xs text-[--text-secondary] italic pl-2.5 border-l border-airos-500/30">
                  {plan.searchStrategy.expectedEvidence}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Agents View (Bottom row) */}
      <div className="pt-2 border-t border-white/[0.04]">
        <AgentSelectionView />
      </div>
    </motion.div>
  );
}
