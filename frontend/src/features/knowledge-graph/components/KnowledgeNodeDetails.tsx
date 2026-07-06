"use client";

import type { KnowledgeNode, KnowledgeEdge } from "../types";
import type { EvidenceItem } from "@/features/evidence";

interface KnowledgeNodeDetailsProps {
  node: KnowledgeNode;
  edges: KnowledgeEdge[];
  nodesList: KnowledgeNode[];
  evidenceItems: EvidenceItem[];
  onSelectNode: (node: KnowledgeNode | null) => void;
  onClose: () => void;
}

export default function KnowledgeNodeDetails({
  node,
  edges,
  nodesList,
  evidenceItems,
  onSelectNode,
  onClose,
}: KnowledgeNodeDetailsProps) {
  // 1. Identify adjacent/neighbor nodes
  const neighbors = edges
    .filter((edge) => edge.source === node.id || edge.target === node.id)
    .map((edge) => {
      const neighborId = edge.source === node.id ? edge.target : edge.source;
      const neighborNode = nodesList.find((n) => n.id === neighborId);
      return neighborNode ? { node: neighborNode, relation: edge.relationship } : null;
    })
    .filter(Boolean) as Array<{ node: KnowledgeNode; relation: string }>;

  // 2. Fetch connected evidence items
  const connectedEvidence = evidenceItems.filter((ev) =>
    node.evidenceReferences.includes(ev.id) ||
    neighbors.some((n) => n.node.evidenceReferences.includes(ev.id))
  );

  return (
    <div className="border border-white/[0.04] bg-[#0c0c14]/25 p-5 rounded-xl flex flex-col justify-between h-full relative overflow-y-auto space-y-4">
      
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
          <div className="space-y-1">
            <span className="inline-flex items-center rounded bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 font-mono text-[9px] font-bold text-indigo-400 uppercase tracking-wide">
              {node.type}
            </span>
            <h4 className="text-sm font-bold text-white tracking-wide" title={node.name}>
              {node.name}
            </h4>
          </div>

          <button
            onClick={onClose}
            className="text-[--text-muted] hover:text-white transition-colors p-1"
            title="Clear Selection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">Description</span>
          <p className="text-xs text-[--text-secondary] leading-relaxed">
            {node.description}
          </p>
        </div>

        {/* Importance & Connectivity Stats */}
        <div className="grid grid-cols-2 gap-4 border-y border-white/[0.03] py-3 text-xs">
          <div>
            <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">Importance</span>
            <span className="font-mono font-bold text-white">{node.importanceScore}%</span>
          </div>
          <div>
            <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">Relations</span>
            <span className="font-mono font-bold text-indigo-400">{neighbors.length} connected</span>
          </div>
        </div>

        {/* Neighbour/Adjacent Nodes */}
        {neighbors.length > 0 && (
          <div className="space-y-2">
            <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">
              Adjacent Relations ({neighbors.length})
            </span>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
              {neighbors.map(({ node: n, relation }) => (
                <div
                  key={n.id}
                  onClick={() => onSelectNode(n)}
                  className="flex items-center justify-between text-[10px] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] px-2.5 py-1.5 cursor-pointer transition-colors duration-150"
                >
                  <span className="truncate text-white font-medium max-w-[140px]">{n.name}</span>
                  <span className="font-mono text-[7px] text-slate-400 bg-white/[0.02] px-1 rounded uppercase">
                    {relation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Evidence Ledger claims */}
        {connectedEvidence.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">
              Supporting Evidence claims
            </span>
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {connectedEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-lg bg-indigo-500/[0.01] border border-indigo-500/10 p-2 text-[10px] space-y-1"
                >
                  <p className="font-semibold text-white leading-relaxed">{ev.extractedClaim}</p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-[--text-muted]">
                    <span>{ev.citation}</span>
                    <span className="text-indigo-400 uppercase">{ev.evidenceCategory}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project References tags */}
        {(node.plannerReferences.length > 0 || node.researchQuestionReferences.length > 0) && (
          <div className="space-y-2 border-t border-white/[0.03] pt-3 text-[9px] font-mono text-[--text-muted]">
            {node.plannerReferences.length > 0 && (
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-400 uppercase shrink-0">Objective:</span>
                <span className="text-[--text-secondary] truncate">{node.plannerReferences[0]}</span>
              </div>
            )}
            {node.researchQuestionReferences.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 uppercase">RQ Reference:</span>
                <span className="text-white font-bold bg-white/[0.02] border border-white/[0.04] px-1.5 py-0.2 rounded">
                  {node.researchQuestionReferences.join(", ")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer warning */}
      <div className="text-[8px] font-mono text-[--text-muted] border-t border-white/[0.02] pt-2 flex items-center justify-between uppercase">
        <span>INSPECT_NODE_BUFF</span>
        <span>SEMANTIC_MAP_ACTIVE</span>
      </div>
    </div>
  );
}
