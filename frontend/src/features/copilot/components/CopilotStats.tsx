"use client";

import type { CopilotStats } from "../types";

interface CopilotStatsProps {
  stats: CopilotStats;
}

export default function CopilotStats({ stats }: CopilotStatsProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-2 border-b border-white/[0.04] scrollbar-none px-4 text-[9px] font-mono shrink-0">
      <span className="text-[--text-muted] uppercase tracking-wider shrink-0">Session Stats:</span>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[--text-muted]">Q:</span>
        <span className="text-white font-bold">{stats.questionsAsked}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[--text-muted]">A:</span>
        <span className="text-white font-bold">{stats.answersGenerated}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[--text-muted]">Conf:</span>
        <span className="text-indigo-400 font-bold">{stats.avgConfidence}%</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[--text-muted]">Refs:</span>
        <span className="text-emerald-400 font-bold">{stats.evidenceReferenced + stats.papersReferenced}</span>
      </div>
    </div>
  );
}
