"use client";

import type { QualityMetricsState } from "../types";

interface QualityMetricsProps {
  quality: QualityMetricsState;
}

export default function QualityMetrics({ quality }: QualityMetricsProps) {
  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full font-mono text-[10px]">
      <span className="text-[--text-muted] uppercase tracking-widest block border-b border-white/[0.04] pb-2 mb-1">
        // INFORMATION_QUALITY_METRICS
      </span>

      <div className="space-y-3.5 pt-1">
        {/* Evidence Coverage */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-[--text-secondary]">Evidence Coverage</span>
            <span className="text-white font-bold">{quality.evidenceCoverage}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${quality.evidenceCoverage}%` }} />
          </div>
        </div>

        {/* Paper Coverage */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-[--text-secondary]">Literature Coverage</span>
            <span className="text-white font-bold">{quality.paperCoverage}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${quality.paperCoverage}%` }} />
          </div>
        </div>

        {/* Memory Coverage */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-[--text-secondary]">Memory Coverage</span>
            <span className="text-white font-bold">{quality.memoryCoverage}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-violet-400 rounded-full" style={{ width: `${quality.memoryCoverage}%` }} />
          </div>
        </div>

        {/* Knowledge Connectivity */}
        <div className="flex items-center justify-between border-t border-white/[0.03] pt-3 text-[11px]">
          <span className="text-[--text-secondary]">Graph Concept Connectivity</span>
          <span className="text-cyan-400 font-bold">{quality.knowledgeConnectivity} edges/node</span>
        </div>

        {/* Average Retrieval Score */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[--text-secondary]">Avg Ingestion Relevance</span>
          <span className="text-white font-bold">{quality.avgRetrievalScore}%</span>
        </div>
      </div>
    </div>
  );
}
