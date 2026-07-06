"use client";

import { motion } from "framer-motion";
import type { FutureAgent } from "../types";

const FUTURE_AGENTS: FutureAgent[] = [
  {
    name: "Evidence",
    purpose: "Extracts empirical data arrays, validates experimental claims, and structures citation metrics.",
    status: "Waiting for Execution",
    estimatedRuntime: "0m 45s",
    dependencies: ["Retrieval"],
    priority: "High",
  },
  {
    name: "Contradiction",
    purpose: "Cross-checks study limitations, exposes logical conflicts, and highlights data variances.",
    status: "Waiting for Execution",
    estimatedRuntime: "1m 15s",
    dependencies: ["Evidence"],
    priority: "Medium",
  },
  {
    name: "Knowledge Graph",
    purpose: "Builds entity-relationship maps, maps concept links, and visualizes network paths.",
    status: "Waiting for Execution",
    estimatedRuntime: "2m 00s",
    dependencies: ["Retrieval", "Evidence"],
    priority: "Medium",
  },
  {
    name: "Research Gap",
    purpose: "Flags literature blindspots, points to undeveloped variables, and isolates study boundaries.",
    status: "Waiting for Execution",
    estimatedRuntime: "1m 00s",
    dependencies: ["Knowledge Graph"],
    priority: "High",
  },
  {
    name: "Hypothesis",
    purpose: "Synthesizes prior findings to construct testable causal premises and logic frameworks.",
    status: "Waiting for Execution",
    estimatedRuntime: "0m 30s",
    dependencies: ["Research Gap"],
    priority: "High",
  },
  {
    name: "Experiment",
    purpose: "Drafts verification setup specifications, outlines protocol codes, and defines runs.",
    status: "Waiting for Execution",
    estimatedRuntime: "1m 30s",
    dependencies: ["Hypothesis"],
    priority: "Medium",
  },
  {
    name: "Reviewer",
    purpose: "Performs peer critiques, audits data pipelines for bias, and checks math constraints.",
    status: "Waiting for Execution",
    estimatedRuntime: "1m 40s",
    dependencies: ["Experiment"],
    priority: "High",
  },
  {
    name: "Copilot",
    purpose: "Maintains human-in-the-loop interfaces, assists drafting papers, and resolves query alerts.",
    status: "Waiting for Execution",
    estimatedRuntime: "0m 30s",
    dependencies: ["Reviewer"],
    priority: "Low",
  },
];

export default function FutureWorkflowPanel() {
  return (
    <div className="space-y-3 p-0 bg-transparent">
      {/* Header */}
      <div>
        <span className="font-mono text-[8px] text-[--text-muted] uppercase tracking-widest block">
          // Downstream Agents
        </span>
        <h3 className="text-sm font-bold text-white tracking-tight">
          Future Workflow
        </h3>
      </div>

      {/* Agents cards list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
        {FUTURE_AGENTS.map((agent, idx) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            className="border-b border-white/[0.03] last:border-b-0 pb-2 flex flex-col gap-1"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {agent.name}
                </h4>
                
                {/* Status Badge */}
                <span className="inline-flex items-center rounded bg-amber-500/5 px-1.5 py-0.2 border border-amber-500/10 font-mono text-[8px] font-bold text-amber-500 uppercase tracking-wider">
                  Waiting
                </span>
              </div>
              <p className="text-[10px] text-[--text-muted] leading-relaxed mt-0.5">
                {agent.purpose}
              </p>
              
              {/* Metadata tags */}
              <div className="mt-1 flex flex-wrap gap-2 text-[8px] font-mono text-[--text-muted]">
                <span>EST: {agent.estimatedRuntime}</span>
                <span>·</span>
                <span className="truncate max-w-[120px]">DEP: {agent.dependencies.join(", ")}</span>
                <span>·</span>
                <span className={`font-bold ${
                  agent.priority === "High"
                    ? "text-rose-400"
                    : agent.priority === "Medium"
                    ? "text-amber-400"
                    : "text-zinc-400"
                }`}>PRIORITY: {agent.priority}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
