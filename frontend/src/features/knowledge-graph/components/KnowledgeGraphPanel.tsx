"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { KnowledgeGraph, KnowledgeNode, NodeType, EdgeType } from "../types";
import type { GraphFilters } from "../useKnowledgeGraph";
import type { EvidenceItem } from "@/features/evidence";
import { knowledgeGraphService } from "../knowledge-graph-service";

import KnowledgeGraphStats from "./KnowledgeGraphStats";
import KnowledgeGraphCanvas from "./KnowledgeGraphCanvas";
import KnowledgeNodeDetails from "./KnowledgeNodeDetails";
import KnowledgeGraphFilters from "./KnowledgeGraphFilters";

interface KnowledgeGraphPanelProps {
  graph: KnowledgeGraph | null;
  isGenerating: boolean;
  progress: number;
  generationStage: string;
  onGenerate: () => void;
  onClear: () => void;
  selectedNode: KnowledgeNode | null;
  onSelectNode: (node: KnowledgeNode | null) => void;
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  filters: GraphFilters;
  onChangeFilters: (filters: GraphFilters) => void;
  evidenceItems: EvidenceItem[];
}

export default function KnowledgeGraphPanel({
  graph,
  isGenerating,
  progress,
  generationStage,
  onGenerate,
  onClear,
  selectedNode,
  onSelectNode,
  searchQuery,
  onChangeSearch,
  filters,
  onChangeFilters,
  evidenceItems,
}: KnowledgeGraphPanelProps) {
  
  // 1. Calculate overall graph stats
  const stats = useMemo(() => {
    if (!graph) return null;
    return knowledgeGraphService.computeStats(graph);
  }, [graph]);

  // 2. Identify available filter categories from compile
  const availableNodeTypes = useMemo(() => {
    if (!graph) return [];
    return Array.from(new Set(graph.nodes.map((n) => n.type)));
  }, [graph]);

  const availableEdgeTypes = useMemo(() => {
    if (!graph) return [];
    return Array.from(new Set(graph.edges.map((e) => e.relationship)));
  }, [graph]);

  const availablePapers = useMemo(() => {
    if (!graph) return [];
    return Array.from(new Set(graph.nodes.filter((n) => n.type === "Paper").map((n) => n.name)));
  }, [graph]);

  // 3. Filter nodes and edges dynamically based on search and selected checkboxes
  const filteredGraph = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] };

    // Filter nodes
    const filteredNodes = graph.nodes.filter((node) => {
      // Filter by node type
      if (filters.nodeTypes.length > 0 && !filters.nodeTypes.includes(node.type)) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = node.name.toLowerCase().includes(query);
        const matchesDesc = node.description.toLowerCase().includes(query);
        const matchesType = node.type.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesType) return false;
      }
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map((n) => n.id));

    // Filter edges
    const filteredEdges = graph.edges.filter((edge) => {
      // Verify both endpoints exist in filtered nodes list
      if (!activeNodeIds.has(edge.source) || !activeNodeIds.has(edge.target)) {
        return false;
      }
      // Filter by relationship type
      if (filters.relationshipTypes.length > 0 && !filters.relationshipTypes.includes(edge.relationship)) {
        return false;
      }
      // Filter by source paper citation
      if (filters.sourcePapers.length > 0) {
        const sourceNode = graph.nodes.find((n) => n.id === edge.source);
        const targetNode = graph.nodes.find((n) => n.id === edge.target);
        const sourcePaperName = sourceNode?.type === "Paper" ? sourceNode.name : targetNode?.type === "Paper" ? targetNode.name : "";
        if (!filters.sourcePapers.includes(sourcePaperName)) {
          return false;
        }
      }
      return true;
    });

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
    };
  }, [graph, filters, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Knowledge Graph</h3>
            <p className="text-xs text-[--text-secondary]">
              Semantic relationship networking linking parameters, methodologies, and clinical claims
            </p>
          </div>
        </div>

        {graph && !isGenerating && (
          <button
            onClick={onClear}
            className="rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-rose-500/10 hover:border-rose-500/20 text-white font-semibold text-xs px-4 py-2 transition-all duration-200"
          >
            Clear Graph Data
          </button>
        )}
      </div>

      {/* 1. Empty / Run trigger state */}
      {!graph && !isGenerating && (
        <div className="glass-panel text-center rounded-2xl border border-dashed border-white/10 p-12 bg-white/[0.01] flex flex-col items-center justify-center space-y-4">
          <svg className="h-10 w-10 text-[--text-muted] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <div className="max-w-md space-y-1.5">
            <h4 className="text-sm font-semibold text-white">Synthesize conceptual research network</h4>
            <p className="text-xs text-[--text-secondary] leading-relaxed">
              Consumes extracted evidence parameters, datasets, and benchmarks to construct directional ontological dependencies.
            </p>
          </div>
          <button
            onClick={onGenerate}
            disabled={evidenceItems.length === 0}
            className={`rounded-xl font-semibold text-xs px-6 py-3 transition-all duration-200 shadow-md ${
              evidenceItems.length === 0
                ? "bg-white/5 border border-white/10 text-[--text-muted] cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-600/20"
            }`}
          >
            {evidenceItems.length === 0
              ? "Extract Evidence Before Generating Graph"
              : "Run Knowledge Graph Agent"}
          </button>
        </div>
      )}

      {/* 2. Loading progress timeline state */}
      {isGenerating && (
        <div className="glass-panel glow-ring rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.02] p-8 max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white inline-flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Knowledge Graph Agent Structuring Ontology...
            </span>
            <span className="font-mono text-xs text-indigo-300 font-bold">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.03] pt-3.5">
            <span className="font-mono text-[9px] text-[--text-muted] uppercase">Ingestion Stage</span>
            <span className="font-mono text-[10px] text-indigo-400 font-semibold">{generationStage}</span>
          </div>
        </div>
      )}

      {/* 3. Graph View Layout block */}
      {graph && !isGenerating && stats && (
        <div className="flex-1 min-h-0 flex flex-col gap-3.5 animate-fadeIn overflow-hidden">
          
          {/* Flat horizontal inline search & filter block */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between shrink-0 bg-[#0c0c14]/25 p-3 rounded-lg border border-white/[0.03]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider">
                Ontology Concept Search:
              </span>
              
              {/* Search concept input */}
              <div className="relative w-48 sm:w-64">
                <input
                  type="text"
                  placeholder="Filter nodes or types..."
                  value={searchQuery}
                  onChange={(e) => onChangeSearch(e.target.value)}
                  className="
                    w-full rounded bg-white/[0.02] border border-white/[0.06] pl-7 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/40 transition-all duration-200
                  "
                />
                <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Quick stats inline tags */}
            <div className="flex items-center gap-3 text-[9px] font-mono text-[--text-muted]">
              <span>NODES: <strong className="text-white">{filteredGraph.nodes.length}</strong></span>
              <span>·</span>
              <span>RELATIONS: <strong className="text-indigo-300">{filteredGraph.edges.length}</strong></span>
              <span>·</span>
              <span>KEY: <strong className="text-emerald-400">{stats.mostConnectedConcept}</strong></span>
            </div>
          </div>

          {/* Quick Filters inline bar */}
          <div className="shrink-0">
            <KnowledgeGraphFilters
              filters={filters}
              onChangeFilters={onChangeFilters}
              availableNodeTypes={availableNodeTypes}
              availableEdgeTypes={availableEdgeTypes}
              availablePapers={availablePapers}
            />
          </div>

          {/* Split Pane: Main Interactive Canvas (Left) | Node Inspector (Right) */}
          <div className="flex-grow flex flex-col lg:flex-row gap-4 min-h-0 relative overflow-hidden">
            
            {/* SVG Interactive Canvas */}
            <div className="flex-1 h-full min-h-0 relative flex flex-col">
              <KnowledgeGraphCanvas
                nodes={filteredGraph.nodes}
                edges={filteredGraph.edges}
                selectedNode={selectedNode}
                onSelectNode={onSelectNode}
              />
            </div>

            {/* Selection Inspector Drawer */}
            <div className="w-full lg:w-[320px] shrink-0 h-full overflow-hidden">
              {selectedNode ? (
                <KnowledgeNodeDetails
                  node={selectedNode}
                  edges={graph.edges}
                  nodesList={graph.nodes}
                  evidenceItems={evidenceItems}
                  onSelectNode={onSelectNode}
                  onClose={() => onSelectNode(null)}
                />
              ) : (
                <div className="border border-white/[0.04] rounded-xl p-6 bg-[#08080c]/25 flex flex-col items-center justify-center text-center h-full min-h-[250px] space-y-3">
                  <svg className="h-6 w-6 text-[--text-muted] opacity-40 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286.672zM12 2.25V4.5m5.303.197l-1.591 1.591M21 12h-2.25m-.197 5.303l-1.591-1.591M12 21.75V19.5m-5.303-.197l1.591-1.591M3 12h2.25m.197-5.303l1.591 1.591" />
                  </svg>
                  <h4 className="text-xs font-semibold text-white">Inspector</h4>
                  <p className="text-[10px] text-[--text-secondary] leading-relaxed max-w-[200px]">
                    Select any concept in the network canvas to audit nodes, related empirical proofs, and references.
                  </p>
                </div>
                             )}
             </div>

         </div>
       </div>
       )}
     </div>
  );
 }
