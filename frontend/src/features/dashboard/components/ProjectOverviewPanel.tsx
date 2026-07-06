"use client";

import { motion } from "framer-motion";
import type { ResearchProject } from "@/features/workspace";
import {
  RESEARCH_DEPTH_LABELS,
} from "@/features/workspace";
import { formatDate } from "@/utils";

interface ProjectOverviewPanelProps {
  project: ResearchProject;
  isPlanningComplete: boolean;
  hasPapers: boolean;
  hasPdfs: boolean;
  searchState: string;
  estimatedRuntime?: string;
  actualRuntime?: string;
}

function ProjectOverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-mono uppercase tracking-wider text-[--text-muted]">
        {label}
      </p>
      <p className="text-xs font-semibold text-white">{value}</p>
    </div>
  );
}

export default function ProjectOverviewPanel({
  project,
  isPlanningComplete,
  hasPapers,
  hasPdfs,
  searchState,
  estimatedRuntime,
  actualRuntime,
}: ProjectOverviewPanelProps) {
  // Map and compute estimated completion times dynamically based on depth and status
  const getEstTime = () => {
    if (estimatedRuntime) return estimatedRuntime;
    
    let baseMins = 45;
    if (project.researchDepth === "quick") baseMins = 15;
    if (project.researchDepth === "comprehensive") baseMins = 120;

    if (isPlanningComplete) {
      baseMins = Math.round(baseMins * 0.6); // 40% reduction
      if (hasPapers || hasPdfs || searchState === "complete") {
        baseMins = Math.round(baseMins * 0.33); // drops to 15% of initial
      }
    }
    
    return baseMins > 5 ? `${baseMins} minutes` : "5 minutes";
  };

  const estTime = getEstTime();

  return (
    <div className="space-y-3 p-0 bg-transparent">
      {/* Header section */}
      <div>
        <span className="font-mono text-[8px] text-[--text-muted] uppercase tracking-widest block">
          // Project Context
        </span>
        <h3 className="text-sm font-bold text-white tracking-tight">
          Project Overview
        </h3>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs leading-relaxed text-[--text-secondary] max-w-xl">
          {project.description}
        </p>
      )}

      {/* Grid of parameters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 pt-1">
        <ProjectOverviewItem
          label="Research Depth"
          value={RESEARCH_DEPTH_LABELS[project.researchDepth]}
        />

        <ProjectOverviewItem
          label="Created Date"
          value={formatDate(project.createdAt)}
        />
        
        {actualRuntime ? (
          <ProjectOverviewItem
            label="Execution Time"
            value={actualRuntime}
          />
        ) : (
          <ProjectOverviewItem
            label="Est. Completion"
            value={estTime}
          />
        )}
      </div>
    </div>
  );
}
