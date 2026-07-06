"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ExecutionPlan } from "../../types";
import { useGraphSimulation } from "../useGraphSimulation";
import GraphNodeCard from "./GraphNodeCard";
import GraphEdgeLine from "./GraphEdgeLine";

import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";
interface ExecutionGraphProps {
  plan: ExecutionPlan;
  searchState?: string;
  hasPapers?: boolean;
  projectTitle?: string;
  projectTopic?: string;
  researchType?: string;
  plannerSummary?: string;
  evidenceItems?: EvidenceItem[];
  isEvidenceExtracting?: boolean;
  knowledgeGraph?: KnowledgeGraph | null;
  isGraphGenerating?: boolean;
  stageRuntimes?: Record<string, number>;
}

export default function ExecutionGraph({
  plan,
  searchState = "idle",
  hasPapers = false,
  projectTitle = "Default Title",
  projectTopic = "Default Topic",
  researchType = "general_research",
  plannerSummary = "",
  evidenceItems = [],
  isEvidenceExtracting = false,
  knowledgeGraph = null,
  isGraphGenerating = false,
  stageRuntimes,
}: ExecutionGraphProps) {
  const { nodes, edges, logs } = useGraphSimulation(
    plan,
    searchState,
    hasPapers,
    projectTitle,
    projectTopic,
    researchType,
    plannerSummary,
    evidenceItems,
    isEvidenceExtracting,
    knowledgeGraph,
    isGraphGenerating,
    stageRuntimes
  );
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs terminal to bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 border border-white/[0.04] rounded-xl overflow-hidden bg-[#0c0c14]/10 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.04]">
      {/* 1. Interactive Nodes DAG Pipeline */}
      <div className="lg:col-span-2 p-4 space-y-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-airos-400 animate-pulse" />
            <span className="font-mono text-[10px] font-semibold tracking-wider text-[--text-secondary] uppercase">
              Pipeline Topology DAG
            </span>
          </div>
          <span className="font-mono text-[9px] text-[--text-muted]">
            NODES: {nodes.length} · EDGES: {edges.length}
          </span>
        </div>

        <div className="space-y-1">
          {nodes.map((node, index) => {
            const edge = edges.find((e) => e.from === node.id);

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GraphNodeCard node={node} />
                {index < nodes.length - 1 && edge && (
                  <GraphEdgeLine edge={edge} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. System Log Diagnostics Terminal */}
      <div className="flex flex-col h-full bg-[#08080c]/25 p-4 justify-between min-h-[300px] lg:min-h-[420px] max-h-[500px]">
        <div className="flex items-center gap-2 mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span className="font-mono text-[10px] font-semibold tracking-wider text-[--text-secondary] uppercase">
            Diagnostics Console
          </span>
        </div>

        {/* Diagnostic Outputs */}
        <div className="overflow-y-auto flex-grow pr-1 space-y-2 font-mono text-[10px] leading-relaxed custom-scrollbar">
          {logs.map((log, index) => {
            let textClass = "text-[--text-secondary]";
            if (log.startsWith("[CRITICAL]")) textClass = "text-rose-400 font-semibold";
            else if (log.startsWith("[WARNING]")) textClass = "text-amber-400 font-semibold";
            else if (log.startsWith("[SUCCESS]")) textClass = "text-emerald-400";
            else if (log.startsWith("[RESOLVED]")) textClass = "text-indigo-300";
            else if (log.startsWith("[RUNNING]")) textClass = "text-airos-300";
            else if (log.startsWith("[SYSTEM]")) textClass = "text-white/60 font-medium";

            return (
              <div key={index} className={`border-l border-white/5 pl-2 py-0.5 ${textClass}`}>
                {log}
              </div>
            );
          })}
          <div ref={consoleEndRef} />
        </div>

        {/* Prompt line indicator */}
        <div className="mt-3 border-t border-white/[0.04] pt-2 flex items-center justify-between text-[9px] font-mono text-[--text-muted]">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>DIAG_OK</span>
          </div>
          <span>SECURE_SYS_LOG</span>
        </div>
      </div>
    </div>
  );
}
