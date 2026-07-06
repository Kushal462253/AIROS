"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EvidenceItem, EvidenceCategory, EvidenceStrength } from "../types";
import type { PaperResult, PDFDocument } from "@/features/retrieval";
import type { ExecutionPlan } from "@/features/planner";
import Magnetic from "@/components/ui/Magnetic";

interface EvidenceEngineProps {
  evidenceItems: EvidenceItem[];
  isExtracting: boolean;
  progress: number;
  extractionStage: string;
  onExtract: () => void;
  onClear?: () => void;
}

type FilterType =
  | "All"
  | "Strong"
  | "Moderate"
  | "Weak"
  | "Methodology"
  | "Results"
  | "Limitations"
  | "Datasets"
  | "Uploaded PDF";

export default function EvidenceEngine({
  evidenceItems,
  isExtracting,
  progress,
  extractionStage,
  onExtract,
  onClear,
}: EvidenceEngineProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Calculate stats based on evidenceItems
  const stats = useMemo(() => {
    const total = evidenceItems.length;
    if (total === 0) {
      return {
        total: 0,
        strong: 0,
        weak: 0,
        methodologies: 0,
        benchmarks: 0,
        limitations: 0,
        datasets: 0,
        avgConfidence: 0,
      };
    }

    const strong = evidenceItems.filter((item) => item.evidenceStrength === "Strong").length;
    const weak = evidenceItems.filter((item) => item.evidenceStrength === "Weak").length;
    const methodologies = evidenceItems.filter((item) => item.evidenceCategory === "Methodology").length;
    const benchmarks = evidenceItems.filter((item) => item.evidenceCategory === "Benchmark").length;
    const limitations = evidenceItems.filter((item) => item.evidenceCategory === "Limitation").length;
    const datasets = evidenceItems.filter((item) => item.evidenceCategory === "Dataset").length;
    
    const sumConfidence = evidenceItems.reduce((acc, item) => acc + item.confidenceScore, 0);
    const avgConfidence = Math.round(sumConfidence / total);

    return {
      total,
      strong,
      weak,
      methodologies,
      benchmarks,
      limitations,
      datasets,
      avgConfidence,
    };
  }, [evidenceItems]);

  // 2. Filter & search items
  const filteredItems = useMemo(() => {
    return evidenceItems.filter((item) => {
      // Filter mapping
      if (activeFilter === "Strong" && item.evidenceStrength !== "Strong") return false;
      if (activeFilter === "Moderate" && item.evidenceStrength !== "Moderate") return false;
      if (activeFilter === "Weak" && item.evidenceStrength !== "Weak") return false;
      if (activeFilter === "Methodology" && item.evidenceCategory !== "Methodology") return false;
      
      if (activeFilter === "Results") {
        const cat = item.evidenceCategory;
        if (cat !== "Experimental Result" && cat !== "Statistical Result") return false;
      }
      if (activeFilter === "Limitations" && item.evidenceCategory !== "Limitation") return false;
      if (activeFilter === "Datasets" && item.evidenceCategory !== "Dataset") return false;
      if (activeFilter === "Uploaded PDF" && item.sourceType !== "PDF") return false;

      // Search mapping
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inClaim = item.extractedClaim.toLowerCase().includes(query);
        const inPaper = item.sourcePaper.toLowerCase().includes(query);
        const inEvidence = item.supportingEvidence.toLowerCase().includes(query);
        return inClaim || inPaper || inEvidence;
      }

      return true;
    });
  }, [evidenceItems, activeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-airos-500/10 text-airos-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Evidence Engine</h3>
            <p className="text-xs text-[--text-secondary]">
              Transform RAG context and publications into validated structured claims
            </p>
          </div>
        </div>

        {evidenceItems.length > 0 && onClear && !isExtracting && (
          <button
            onClick={onClear}
            className="rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-rose-500/10 hover:border-rose-500/20 text-white font-semibold text-xs px-4 py-2 transition-all duration-200"
          >
            Clear Evidence
          </button>
        )}
      </div>

      {/* 1. Ingestion / Trigger State */}
      {evidenceItems.length === 0 && !isExtracting && (
        <div className="glass-panel text-center rounded-2xl border border-white/[0.04] p-12 bg-[#0c0c14]/15 flex flex-col items-center justify-center space-y-5">
          {/* Animated SVG Molecule */}
          <div className="relative h-16 w-16 flex items-center justify-center">
            <motion.svg
              width="54"
              height="54"
              viewBox="0 0 60 60"
              className="text-indigo-400/80"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <line x1="30" y1="30" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30" y1="30" x2="48" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30" y1="30" x2="30" y2="48" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              
              <circle cx="30" cy="30" r="6.5" fill="#6366f1" />
              <motion.circle
                cx="12"
                cy="12"
                r="4.5"
                fill="#818cf8"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx="48"
                cy="12"
                r="4"
                fill="#34d399"
                animate={{ scale: [1.25, 1, 1.25] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx="30"
                cy="48"
                r="3.5"
                fill="#a78bfa"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>
          </div>

          <div className="max-w-md space-y-1.5">
            <h4 className="text-sm font-semibold text-white">No evidence yet</h4>
            <p className="text-xs text-[--text-secondary] leading-relaxed">
              Extract evidence to begin validation. Synthesize clinical parameters, statistical data vectors, and indexed literature to populate the ledger.
            </p>
          </div>
          <Magnetic>
            <button
              onClick={onExtract}
              className="rounded-xl bg-airos-600 hover:bg-airos-500 text-white font-semibold text-xs px-6 py-3 transition-all duration-200 shadow-md hover:shadow-airos-600/20"
            >
              Run Evidence Ingestion Agent
            </button>
          </Magnetic>
        </div>
      )}

      {/* 2. Loading / Processing Ingestion state */}
      {isExtracting && (
        <div className="glass-panel glow-ring rounded-2xl border border-airos-500/20 bg-airos-500/[0.02] p-8 max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white inline-flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 text-airos-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Evidence Agent Parsing Literature...
            </span>
            <span className="font-mono text-xs text-airos-300 font-bold">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-airos-600 to-airos-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.03] pt-3.5">
            <span className="font-mono text-[9px] text-[--text-muted] uppercase">Active pipeline state</span>
            <span className="font-mono text-[10px] text-airos-400 font-semibold">{extractionStage}</span>
          </div>
        </div>
      )}

      {/* 3. Output state (Stats + Filters + Grid list) */}
      {evidenceItems.length > 0 && !isExtracting && (
        <div className="space-y-6">
          
          {/* Statistics panel */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {/* Total */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Extracted</span>
              <span className="font-mono text-base font-bold text-white mt-1">{stats.total}</span>
            </div>

            {/* Strong */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Strong</span>
              <span className="font-mono text-base font-bold text-emerald-400 mt-1">{stats.strong}</span>
            </div>

            {/* Weak */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Weak</span>
              <span className="font-mono text-base font-bold text-rose-400 mt-1">{stats.weak}</span>
            </div>

            {/* Methodologies */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Methodologies</span>
              <span className="font-mono text-base font-bold text-white mt-1">{stats.methodologies}</span>
            </div>

            {/* Benchmarks */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Benchmarks</span>
              <span className="font-mono text-base font-bold text-cyan-400 mt-1">{stats.benchmarks}</span>
            </div>

            {/* Limitations */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Limitations</span>
              <span className="font-mono text-base font-bold text-amber-400 mt-1">{stats.limitations}</span>
            </div>

            {/* Datasets */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Datasets</span>
              <span className="font-mono text-base font-bold text-violet-400 mt-1">{stats.datasets}</span>
            </div>

            {/* Avg Confidence */}
            <div className="glass-panel border border-white/[0.03] bg-surface-secondary/10 p-3.5 rounded-xl flex flex-col justify-between min-h-[72px]">
              <span className="text-[8px] font-mono text-[--text-muted] uppercase">Avg Conf</span>
              <span className="font-mono text-base font-bold text-indigo-400 mt-1">{stats.avgConfidence}%</span>
            </div>
          </div>

          {/* Filtering bar and Search inputs row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between border-t border-white/[0.03] pt-4">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  "All",
                  "Strong",
                  "Moderate",
                  "Weak",
                  "Methodology",
                  "Results",
                  "Limitations",
                  "Datasets",
                  "Uploaded PDF",
                ] as FilterType[]
              ).map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                      rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 font-mono tracking-wide
                      ${
                        isActive
                          ? "bg-airos-600 text-white shadow-md shadow-airos-600/10"
                          : "bg-white/[0.02] border border-white/[0.04] text-[--text-secondary] hover:bg-white/[0.04] hover:text-white"
                      }
                    `}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Search inputs */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search claims or papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full rounded-xl bg-white/[0.02] border border-white/[0.06] pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-airos-500/40 focus:ring-1 focus:ring-airos-500/10 transition-all duration-200
                "
              />
              <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

          </div>

          {/* Cards Grid Ledger */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
                
                // Color mapping for strength badges
                const strengthStyles =
                  item.evidenceStrength === "Strong"
                    ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                    : item.evidenceStrength === "Moderate"
                    ? "bg-amber-500/5 border-amber-500/10 text-amber-400"
                    : "bg-rose-500/5 border-rose-500/10 text-rose-400";

                // Color mapping for categories
                const categoryStyles =
                  item.evidenceCategory === "Methodology"
                    ? "text-sky-400 bg-sky-500/5 border-sky-500/10"
                    : item.evidenceCategory === "Experimental Result" || item.evidenceCategory === "Statistical Result"
                    ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10"
                    : item.evidenceCategory === "Limitation"
                    ? "text-amber-400 bg-amber-500/5 border-amber-500/10"
                    : item.evidenceCategory === "Dataset"
                    ? "text-violet-400 bg-violet-500/5 border-violet-500/10"
                    : "text-slate-300 bg-white/5 border-white/10";

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx * 0.03 }}
                    className="glass-panel border border-white/[0.04] p-5 rounded-2xl bg-surface-secondary/20 flex flex-col justify-between space-y-4 hover:border-airos-500/20 transition-all duration-300"
                  >
                    <div>
                      {/* Top Badges Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          {/* Category Badge */}
                          <span className={`inline-flex items-center rounded px-2 py-0.5 border font-mono text-[9px] font-semibold uppercase tracking-wide ${categoryStyles}`}>
                            {item.evidenceCategory}
                          </span>
                          {/* Strength Badge */}
                          <span className={`inline-flex items-center rounded px-2 py-0.5 border font-mono text-[9px] font-semibold uppercase tracking-wide ${strengthStyles}`}>
                            {item.evidenceStrength}
                          </span>
                        </div>

                        {/* Confidence Indicator */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 font-semibold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                          <span className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" />
                          <span>{item.confidenceScore}% Confidence</span>
                        </div>
                      </div>

                      {/* Paper title context */}
                      <div className="flex items-center gap-2 mb-2 min-w-0">
                        {item.sourceType === "PDF" ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                        )}
                        <span className="truncate text-[10px] text-[--text-muted] font-medium font-mono uppercase">
                          {item.sourceType === "PDF" ? "Local Manuscript" : item.sourceType} • {item.citation}
                        </span>
                      </div>

                      <h5 className="text-[11px] font-bold text-[--text-secondary] leading-relaxed mb-2 uppercase font-mono tracking-wider">
                        {item.title}
                      </h5>

                      {/* Extracted claim block */}
                      <p className="text-xs text-white font-semibold leading-relaxed mb-2.5">
                        {item.extractedClaim}
                      </p>

                      {/* Supporting evidence snippet */}
                      <div className="border-l border-white/10 pl-3.5 py-1 text-[11px] text-[--text-secondary] leading-relaxed italic bg-white/[0.01] rounded-r-md">
                        {item.supportingEvidence}
                      </div>
                    </div>

                    {/* Metadata references bottom tags */}
                    <div className="border-t border-white/[0.03] pt-3 flex items-center justify-between flex-wrap gap-2 text-[9px] font-mono text-[--text-muted]">
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <span className="text-airos-400 uppercase tracking-wide shrink-0">Objective:</span>
                        <span className="truncate text-white/70">{item.relatedObjective}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-indigo-400 uppercase tracking-wide">Ref:</span>
                        <span className="text-white bg-white/[0.02] border border-white/[0.04] px-1.5 py-0.5 rounded font-bold">{item.relatedResearchQuestion}</span>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="col-span-full glass-panel text-center rounded-xl p-8 border border-white/[0.03] bg-white/[0.01] text-xs text-[--text-muted]">
                No evidence items match the search query or active filter.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
