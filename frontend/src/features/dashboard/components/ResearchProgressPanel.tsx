"use client";

import { motion } from "framer-motion";
import { useMemory } from "@/features/memory";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

interface ResearchProgressPanelProps {
  isPlanningComplete: boolean;
  hasPapers: boolean;
  hasPdfs: boolean;
  searchState: "idle" | "searching" | "retrieving" | "ranking" | "deduplicating" | "preparing" | "complete";
  evidenceItems?: EvidenceItem[];
  isEvidenceExtracting?: boolean;
  knowledgeGraph?: KnowledgeGraph | null;
  isGraphGenerating?: boolean;
}

export default function ResearchProgressPanel({
  isPlanningComplete,
  hasPapers,
  hasPdfs,
  searchState,
  evidenceItems = [],
  isEvidenceExtracting = false,
  knowledgeGraph = null,
  isGraphGenerating = false,
}: ResearchProgressPanelProps) {
  const { memoryStatus } = useMemory();

  const isRetrievalComplete = searchState === "complete" || hasPapers;
  const isEvidenceComplete = evidenceItems.length > 0;
  const isGraphComplete = knowledgeGraph !== null && knowledgeGraph.nodes.length > 0;

  // Compute live weighted progress values sequentially based on module completion
  let overallProgress = 0;
  if (isPlanningComplete) overallProgress += 20; // Phase 1: Planning
  
  if (isRetrievalComplete) {
    overallProgress += 20; // Phase 2: Ingestion & Retrieval
  } else if (searchState !== "idle") {
    overallProgress += 5;
  }

  if (isEvidenceComplete) {
    overallProgress += 20; // Phase 3: Evidence Agent Ingestion
  } else if (isEvidenceExtracting) {
    overallProgress += 5;
  }

  if (isGraphComplete) {
    overallProgress += 20; // Phase 4: Knowledge Graph Ingest
  } else if (isGraphGenerating) {
    overallProgress += 5;
  }

  if (isGraphComplete) {
    overallProgress += 20; // Phase 5: Copilot initialized / Ready
  }

  // Set active stage label dynamically
  let activeStage = "Initializing Pipeline";
  if (!isPlanningComplete) {
    activeStage = "Research Planning";
  } else if (searchState !== "idle" && searchState !== "complete") {
    activeStage = "Scanning Repositories";
  } else if (isEvidenceExtracting) {
    activeStage = "Extracting Evidence";
  } else if (isGraphGenerating) {
    activeStage = "Compiling Graph Map";
  } else if (isGraphComplete) {
    activeStage = "Research Copilot Ready";
  } else if (isEvidenceComplete) {
    activeStage = "Evidence Ledger Synced";
  } else if (isRetrievalComplete) {
    activeStage = "RAG Context Vectorized";
  } else {
    activeStage = "Waiting for Ingestion";
  }

  return (
    <div className="space-y-3 p-0 bg-transparent flex flex-col justify-between h-full">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-mono text-[8px] text-[--text-muted] uppercase tracking-widest block">
              // Engine Status
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Research Progress
            </h3>
          </div>

          <div className="font-mono text-[8px] text-[--text-muted] uppercase">
            STAGE: <span className="text-white font-bold">{activeStage}</span>
          </div>
        </div>

        {/* Progress Value Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider">
              Total Ingestion Value
            </span>
            <span className="font-mono font-bold text-gradient-airos">
              {overallProgress}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-airos-600 to-airos-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-2">
        {/* Planner */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-[--text-secondary]">Planner</span>
          <span className="font-mono text-[8px] font-bold text-emerald-400">Complete</span>
        </div>

        {/* Retrieval */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-[--text-secondary]">Retrieval</span>
          <span className={`font-mono text-[8px] font-bold ${
            isRetrievalComplete
              ? "text-emerald-400"
              : searchState !== "idle"
              ? "text-indigo-400 animate-pulse"
              : "text-[--text-muted]"
          }`}>
            {isRetrievalComplete ? "Complete" : searchState !== "idle" ? "Running" : "Waiting"}
          </span>
        </div>

        {/* Memory */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-[--text-secondary]">Memory</span>
          <span className={`font-mono text-[8px] font-bold ${
            memoryStatus.status === "synced"
              ? "text-emerald-400"
              : memoryStatus.status === "active"
              ? "text-indigo-400 animate-pulse"
              : "text-[--text-muted]"
          }`}>
            {memoryStatus.status === "synced" ? "Complete" : memoryStatus.status === "active" ? "Running" : "Waiting"}
          </span>
        </div>

        {/* Evidence */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-[--text-secondary]">Evidence</span>
          <span className={`font-mono text-[8px] font-bold ${
            isEvidenceComplete
              ? "text-emerald-400"
              : isEvidenceExtracting || isRetrievalComplete
              ? "text-indigo-400 animate-pulse"
              : "text-[--text-muted]"
          }`}>
            {isEvidenceComplete ? "Complete" : isEvidenceExtracting || isRetrievalComplete ? "Running" : "Waiting"}
          </span>
        </div>

        {/* Knowledge Graph */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-[--text-secondary]">Knowledge Graph</span>
          <span className={`font-mono text-[8px] font-bold ${
            isGraphComplete
              ? "text-emerald-400"
              : isGraphGenerating
              ? "text-indigo-400 animate-pulse"
              : isEvidenceComplete
              ? "text-[--text-secondary]"
              : "text-white/20"
          }`}>
            {isGraphComplete ? "Complete" : isGraphGenerating ? "Running" : isEvidenceComplete ? "Waiting" : "Locked"}
          </span>
        </div>

        {/* Research Copilot */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-[--text-secondary]">Research Copilot</span>
          <span className={`font-mono text-[8px] font-bold ${
            isGraphComplete ? "text-indigo-400 font-bold" : "text-white/20"
          }`}>
            {isGraphComplete ? "Ready" : "Locked"}
          </span>
        </div>
      </div>
    </div>
  );
}
