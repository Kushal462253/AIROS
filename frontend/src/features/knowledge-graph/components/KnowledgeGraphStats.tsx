"use client";

import type { GraphStats } from "../types";

interface KnowledgeGraphStatsProps {
  stats: GraphStats;
}

export default function KnowledgeGraphStats({ stats }: KnowledgeGraphStatsProps) {
  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Nodes */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl flex flex-col justify-between min-h-[80px]">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider">Total Nodes</span>
          <span className="font-mono text-xl font-bold text-white mt-1">{stats.totalNodes}</span>
        </div>

        {/* Total Relationships */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl flex flex-col justify-between min-h-[80px]">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider">Total Relations</span>
          <span className="font-mono text-xl font-bold text-white mt-1">{stats.totalRelationships}</span>
        </div>

        {/* Connected Components */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl flex flex-col justify-between min-h-[80px]">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider">Components</span>
          <span className="font-mono text-xl font-bold text-violet-400 mt-1">{stats.connectedComponents ?? 1}</span>
        </div>

        {/* Graph Density */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl flex flex-col justify-between min-h-[80px]">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider">Density</span>
          <span className="font-mono text-xl font-bold text-cyan-400 mt-1">{stats.graphDensity ?? 0.04}</span>
        </div>

        {/* Most Connected Concept */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl flex flex-col justify-between min-h-[80px]">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider">Key Concept</span>
          <span className="text-[11px] font-bold text-indigo-400 mt-1 truncate max-w-full" title={stats.mostConnectedConcept}>
            {stats.mostConnectedConcept}
          </span>
        </div>

        {/* Average Connectivity */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl flex flex-col justify-between min-h-[80px]">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider">Avg Connections</span>
          <span className="font-mono text-xl font-bold text-emerald-400 mt-1">{stats.avgConnectivity}</span>
        </div>
      </div>

      {/* Tags Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Research Domains */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl space-y-2">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider block">
            Identified Research Domains
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stats.researchDomains.map((domain) => (
              <span
                key={domain}
                className="inline-flex items-center rounded bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 font-mono text-[8px] font-bold text-indigo-400 uppercase tracking-wide"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* Concept Clusters */}
        <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-4 rounded-xl space-y-2">
          <span className="text-[9px] font-mono text-[--text-muted] uppercase tracking-wider block">
            Ontology Node Clusters
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stats.conceptClusters.map((cluster) => (
              <span
                key={cluster}
                className="inline-flex items-center rounded bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 font-mono text-[8px] font-bold text-emerald-400 uppercase tracking-wide"
              >
                {cluster}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
