"use client";

import { useState } from "react";
import type { ResearchProject } from "@/features/workspace";
import { useRetrieval } from "../useRetrieval";
import SearchProgress from "./SearchProgress";
import PapersList from "./PapersList";
import PdfUploader from "./PdfUploader";
import ContextViewer from "./ContextViewer";

interface RetrievalDashboardProps {
  project: ResearchProject;
}

export default function RetrievalDashboard({ project }: RetrievalDashboardProps) {
  const {
    searchState,
    papers,
    pdfs,
    retrievedContext,
    isSearching,
    isUploading,
    uploadProgress,
    error,
    search,
    uploadPDF,
    clearResults,
    clearPDF,
  } = useRetrieval(project.id);

  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      search(query.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-airos-500/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Retrieval Engine</h3>
          <p className="text-xs text-[--text-secondary]">
            Collect context-rich academic publications and index document embeddings into ChromaDB
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Search and Results Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search Controller Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel glow-ring rounded-2xl p-6 bg-surface-secondary/20 border border-white/[0.04] space-y-4"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider">
                Targeted Semantic Query
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter research topic, keywords, or synthesis prompt..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isSearching}
                  className="
                    flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-airos-500/40 focus:ring-1 focus:ring-airos-500/10 transition-all duration-200
                  "
                />
                
                <button
                  type="submit"
                  disabled={isSearching || !query.trim()}
                  className="
                    rounded-xl bg-airos-600 hover:bg-airos-500 text-white font-semibold text-xs px-5 py-2.5 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-airos-600/20 disabled:opacity-40 disabled:hover:shadow-none shrink-0
                  "
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Retrieving
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-400 font-mono">
                [ERROR] {error}
              </div>
            )}
          </form>

          {/* Stepper progress display */}
          <SearchProgress state={searchState} />

          {/* Results Lists */}
          {searchState === "complete" && (
            <div className="space-y-6">
              <PapersList papers={papers} />
              
              {/* Divider */}
              {retrievedContext.length > 0 && <div className="h-px bg-white/[0.04] w-full" />}
              
              <ContextViewer contexts={retrievedContext} />
            </div>
          )}
        </div>

        {/* Right Uploader Column */}
        <div className="glass-panel glow-ring rounded-2xl p-6 bg-surface-secondary/20 border border-white/[0.04] h-fit">
          <PdfUploader
            pdfs={pdfs}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onUpload={uploadPDF}
            onClear={clearPDF}
          />
        </div>
      </div>
    </div>
  );
}
