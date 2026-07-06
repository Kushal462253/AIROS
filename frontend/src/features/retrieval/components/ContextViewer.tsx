"use client";

import { motion } from "framer-motion";
import type { RAGContext } from "../types";

interface ContextViewerProps {
  contexts: RAGContext[];
  query?: string;
}

function highlightText(text: string, query: string = "") {
  if (!query || !query.trim()) return text;
  
  // Split query into keywords (filtering small or punctuation words)
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ""))
    .filter((t) => t.length > 2);
    
  if (terms.length === 0) return text;
  
  // Create regex pattern to split text, capturing matching terms
  const pattern = new RegExp(`\\b(${terms.join("|")})\\b`, "gi");
  const parts = text.split(pattern);
  
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = terms.includes(part.toLowerCase());
        return isMatch ? (
          <mark
            key={i}
            className="bg-indigo-500/20 text-white rounded border border-indigo-400/20 px-0.5 font-medium select-none"
          >
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </>
  );
}

export default function ContextViewer({ contexts, query = "" }: ContextViewerProps) {
  if (contexts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-xs font-semibold text-[--text-secondary] uppercase tracking-widest">
          Retrieved RAG Context (Similarity Search results)
        </h4>
        <span className="font-mono text-[10px] text-[--text-muted]">EXPOSED FOR MULTI-AGENT CONSUMPTION</span>
      </div>

      <div className="space-y-3.5">
        {contexts.map((ctx, idx) => (
          <motion.div
            key={ctx.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="glass-panel rounded-xl border border-white/[0.04] p-5 bg-surface-secondary/20 relative overflow-hidden flex flex-col gap-3"
          >
            {/* Header detail row */}
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
                <span className="truncate text-xs font-semibold text-white uppercase tracking-wide">
                  {ctx.metadata.source || "Unknown Document"}
                </span>
                <span className="font-mono text-[9px] text-[--text-muted]">
                  [CHUNK 0{ctx.metadata.chunk_index + 1}]
                </span>
              </div>

              {/* Vector Cosine Score */}
              <div className="rounded bg-airos-500/5 px-2 py-0.5 border border-airos-500/10 shrink-0 font-mono text-[9px] font-bold text-airos-300">
                SIMILARITY SCORE: {ctx.score.toFixed(3)}
              </div>
            </div>

            {/* Document Chunk Segment with term highlighting */}
            <p className="text-xs leading-relaxed text-[--text-secondary] pl-3 border-l-2 border-airos-500/30">
              &ldquo;{highlightText(ctx.document, query)}&rdquo;
            </p>

            {/* Metadata references */}
            <div className="flex items-center gap-4 text-[9px] font-mono text-[--text-muted]">
              <span>PROJECT_DB_ID: {ctx.id.split("_")[0]}</span>
              <span>•</span>
              <span>INDEX: CHROMA_V1</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
