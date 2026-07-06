"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PaperResult, SourceType } from "../types";
import { collectionsService, type Collection } from "@/services/collections-service";

interface PapersListProps {
  papers: PaperResult[];
}

const SOURCE_TAGS: Record<SourceType, { bg: string; text: string; border: string; icon: string }> = {
  arXiv: {
    bg: "bg-red-500/5",
    text: "text-red-400",
    border: "border-red-500/20",
    icon: "🔬",
  },
  "Semantic Scholar": {
    bg: "bg-blue-500/5",
    text: "text-blue-400",
    border: "border-blue-500/20",
    icon: "📖",
  },
  Web: {
    bg: "bg-amber-500/5",
    text: "text-amber-400",
    border: "border-amber-500/20",
    icon: "🌐",
  },
  PDF: {
    bg: "bg-indigo-500/5",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    icon: "📄",
  },
};

function PaperCard({ paper }: { paper: PaperResult }) {
  const [expanded, setExpanded] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleOpenDropdown = () => {
    setCollections(collectionsService.getCollections());
    setShowDropdown((prev) => !prev);
  };

  const tag = SOURCE_TAGS[paper.sourceType] || SOURCE_TAGS.Web;
  
  // Format authors to show "et al." if too long
  const authorsTruncated = paper.authors.length > 80 
    ? `${paper.authors.slice(0, 80)}... et al.` 
    : paper.authors;

  return (
    <motion.div
      className="glass-panel card-lift-hover rounded-xl border border-white/[0.04] p-5 bg-[#0a0a0f]/25 relative overflow-hidden flex flex-col justify-between transition-all duration-300 group"
    >
      <div>
        {/* Top line metadata */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Source Type Badge */}
            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-mono font-bold uppercase border ${tag.bg} ${tag.text} ${tag.border}`}>
              <span>{tag.icon}</span>
              <span>{paper.sourceType}</span>
            </span>
            <span className="font-mono text-[10px] text-[--text-muted] group-hover:text-white/60 transition-colors">
              {paper.publicationYear}
            </span>
            <span className="text-[10px] text-[--text-muted] truncate max-w-[150px] group-hover:text-white/60 transition-colors">
              • {paper.source}
            </span>
          </div>

          {/* Collection Add & Match Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <button
                onClick={handleOpenDropdown}
                className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
              >
                + Collection
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-6 z-20 w-44 rounded-lg border border-white/[0.08] bg-[#0c0c14] p-1 shadow-xl font-mono text-[9px]">
                  {collections.length === 0 ? (
                    <div className="px-2 py-1.5 text-[--text-muted] text-center">
                      No collections. Create one on the main Workspace page.
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="px-2 py-0.5 text-[--text-muted] border-b border-white/[0.04] mb-1">
                        Select Collection
                      </div>
                      {collections.map((col) => {
                        const inCollection = col.papers.some((p) => p.title === paper.title);
                        return (
                          <button
                            key={col.id}
                            disabled={inCollection}
                            onClick={() => {
                              collectionsService.addPaperToCollection(col.id, paper);
                              setShowDropdown(false);
                              alert(`Paper added to collection: ${col.name}`);
                            }}
                            className="w-full text-left px-2 py-1 rounded hover:bg-white/[0.04] text-white disabled:opacity-40 transition-colors flex items-center justify-between"
                          >
                            <span className="truncate">{col.name}</span>
                            {inCollection && <span className="text-emerald-400 font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1.5 rounded bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[9px] font-bold text-emerald-400">
                  {Math.round(paper.relevanceScore * 100)}% MATCH
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-white tracking-wide leading-snug">
          {paper.url ? (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-airos-400 transition-colors inline-flex items-center gap-1"
            >
              {paper.title}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : (
            paper.title
          )}
        </h4>

        {/* Authors */}
        <p className="mt-1 text-[11px] text-[--text-secondary] italic">
          By {authorsTruncated}
        </p>

        {/* Summary / Abstract Container */}
        <div className="mt-3">
          <p className={`text-xs leading-relaxed text-[--text-secondary] ${expanded ? "" : "line-clamp-2"}`}>
            {paper.abstract}
          </p>
        </div>
      </div>

      {/* Expand trigger (Slides in from bottom on card hover) */}
      {paper.abstract && paper.abstract.length > 100 && (
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.03] pt-3 transform translate-y-2.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-[10px] font-semibold text-airos-400 hover:text-airos-300 transition-colors flex items-center gap-1"
          >
            {expanded ? "HIDE ABSTRACT" : "EXPAND ABSTRACT"}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transform transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function PapersList({ papers }: PapersListProps) {
  const [activeFilter, setActiveFilter] = useState<"All" | SourceType>("All");

  if (papers.length === 0) return null;

  const filteredPapers = activeFilter === "All"
    ? papers
    : papers.filter((p) => p.sourceType === activeFilter);

  const filters: ("All" | SourceType)[] = ["All", "arXiv", "Semantic Scholar", "Web"];

  return (
    <div className="space-y-4">
      {/* Title block */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-mono text-xs font-semibold text-[--text-secondary] uppercase tracking-widest">
          Retrieved Literature ({filteredPapers.length} of {papers.length} publications)
        </h4>
        <span className="font-mono text-[9px] text-[--text-muted] uppercase">
          Sorted by relevance vector weights
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-1">
        {filters.map((f) => {
          const count = f === "All" ? papers.length : papers.filter((p) => p.sourceType === f).length;
          const isActive = activeFilter === f;

          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`
                rounded-lg px-3 py-1.5 text-xs transition-all duration-200 font-mono flex items-center gap-1.5 border
                ${
                  isActive
                    ? "bg-airos-600 border-airos-500/35 text-white font-bold"
                    : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.04] text-[--text-secondary]"
                }
              `}
            >
              <span>{f}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[8px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-white/[0.04] text-[--text-muted]"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid List */}
      <AnimatePresence mode="popLayout">
        {filteredPapers.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4"
          >
            {filteredPapers.map((paper, idx) => (
              <motion.div
                key={paper.title + idx}
                layout
                initial={{ opacity: 0, y: 14, rotate: -0.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: idx * 0.03 }}
              >
                <PaperCard paper={paper} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel text-center rounded-xl p-8 border border-white/[0.03] bg-surface-secondary/5"
          >
            <p className="text-xs text-[--text-muted] font-mono">// No publications found in filtered source index.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
