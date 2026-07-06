"use client";

import type { NodeType, EdgeType } from "../types";
import type { GraphFilters } from "../useKnowledgeGraph";

interface KnowledgeGraphFiltersProps {
  filters: GraphFilters;
  onChangeFilters: (filters: GraphFilters) => void;
  availableNodeTypes: NodeType[];
  availableEdgeTypes: EdgeType[];
  availablePapers: string[];
}

export default function KnowledgeGraphFilters({
  filters,
  onChangeFilters,
  availableNodeTypes,
  availableEdgeTypes,
  availablePapers,
}: KnowledgeGraphFiltersProps) {
  // Toggle selection helper
  const handleToggle = <K extends keyof GraphFilters>(
    key: K,
    val: GraphFilters[K][number]
  ) => {
    const list = filters[key] as any[];
    const isSelected = list.includes(val);
    const updated = isSelected ? list.filter((item) => item !== val) : [...list, val];
    
    onChangeFilters({
      ...filters,
      [key]: updated,
    });
  };

  const handleReset = () => {
    onChangeFilters({
      nodeTypes: [],
      relationshipTypes: [],
      sourcePapers: [],
      objectives: [],
      researchQuestions: [],
    });
  };

  const hasActiveFilters =
    filters.nodeTypes.length > 0 ||
    filters.relationshipTypes.length > 0 ||
    filters.sourcePapers.length > 0;

  return (
    <div className="glass-panel border border-white/[0.04] p-4 bg-surface-secondary/20 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-widest block">
          Filter Relationships
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-[8px] font-mono font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Node Types */}
        <div className="space-y-1.5">
          <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">Node Type</span>
          <div className="max-h-[100px] overflow-y-auto space-y-1 pr-1 border border-white/[0.03] p-1.5 rounded bg-black/20">
            {availableNodeTypes.map((type) => {
              const isChecked = filters.nodeTypes.includes(type);
              return (
                <label key={type} className="flex items-center gap-2 cursor-pointer text-[10px] text-[--text-secondary] hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle("nodeTypes", type)}
                    className="rounded border-white/10 bg-white/[0.02] text-indigo-600 focus:ring-0 focus:ring-offset-0 h-3 w-3"
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Relationship Types */}
        <div className="space-y-1.5">
          <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">Relation Type</span>
          <div className="max-h-[100px] overflow-y-auto space-y-1 pr-1 border border-white/[0.03] p-1.5 rounded bg-black/20">
            {availableEdgeTypes.map((rel) => {
              const isChecked = filters.relationshipTypes.includes(rel);
              return (
                <label key={rel} className="flex items-center gap-2 cursor-pointer text-[10px] text-[--text-secondary] hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle("relationshipTypes", rel)}
                    className="rounded border-white/10 bg-white/[0.02] text-indigo-600 focus:ring-0 focus:ring-offset-0 h-3 w-3"
                  />
                  <span>{rel}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Ingested Source Papers */}
        <div className="space-y-1.5">
          <span className="text-[8px] font-mono text-[--text-muted] uppercase tracking-wider block">Source Citation</span>
          <div className="max-h-[100px] overflow-y-auto space-y-1 pr-1 border border-white/[0.03] p-1.5 rounded bg-black/20">
            {availablePapers.map((paper) => {
              const isChecked = filters.sourcePapers.includes(paper);
              return (
                <label key={paper} className="flex items-center gap-2 cursor-pointer text-[10px] text-[--text-secondary] hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle("sourcePapers", paper)}
                    className="rounded border-white/10 bg-white/[0.02] text-indigo-600 focus:ring-0 focus:ring-offset-0 h-3 w-3"
                  />
                  <span className="truncate max-w-[150px]" title={paper}>{paper}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
