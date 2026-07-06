"use client";

import type { PerformanceState } from "../types";

interface PerformanceStatsProps {
  performance: PerformanceState;
}

export default function PerformanceStats({ performance }: PerformanceStatsProps) {
  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full font-mono text-[10px]">
      <span className="text-[--text-muted] uppercase tracking-widest block border-b border-white/[0.04] pb-2 mb-1">
        // LATENCY_PERFORMANCE_DIAGNOSTICS
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pt-1">
        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Planner Runtime</span>
          <span className="text-white text-xs font-bold mt-1">
            {performance.plannerRuntime}
          </span>
        </div>

        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Retrieval Ingestion</span>
          <span className="text-white text-xs font-bold mt-1">
            {performance.retrievalRuntime}
          </span>
        </div>

        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Evidence Extraction</span>
          <span className="text-white text-xs font-bold mt-1">
            {performance.evidenceRuntime}
          </span>
        </div>

        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Graph Compilation</span>
          <span className="text-white text-xs font-bold mt-1">
            {performance.kgRuntime}
          </span>
        </div>

        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Avg query time</span>
          <span className="text-white text-xs font-bold mt-1">
            {performance.avgQueryTime}
          </span>
        </div>

        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Memory cache Access</span>
          <span className="text-indigo-400 text-xs font-bold mt-1">
            {performance.memoryAccessTime}
          </span>
        </div>

        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01] col-span-2">
          <span className="text-[8px] text-[--text-muted] uppercase">Total execution time</span>
          <span className="text-gradient-airos text-sm font-extrabold mt-1">
            {performance.totalExecutionTime}
          </span>
        </div>
      </div>
    </div>
  );
}
