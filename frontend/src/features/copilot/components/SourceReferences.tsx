"use client";

import type { CopilotSourceType } from "../types";

interface SourceReferencesProps {
  sources?: CopilotSourceType[];
  confidence?: number;
  relatedPapers?: string[];
  relatedEvidence?: string[];
  relatedNodes?: string[];
  plannerRefs?: string[];
  rqRefs?: string[];
}

export default function SourceReferences({
  sources = [],
  confidence,
  relatedPapers = [],
  relatedEvidence = [],
  relatedNodes = [],
  plannerRefs = [],
  rqRefs = [],
}: SourceReferencesProps) {
  const hasRefs =
    sources.length > 0 ||
    relatedPapers.length > 0 ||
    relatedEvidence.length > 0 ||
    relatedNodes.length > 0 ||
    plannerRefs.length > 0 ||
    rqRefs.length > 0;

  if (!hasRefs) return null;

  return (
    <div className="mt-3.5 pt-3 border-t border-white/[0.03] space-y-2.5 text-[10px] font-mono leading-relaxed">
      {/* Grounded Sources & Confidence */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[9px] uppercase text-[--text-muted] font-bold">Sources:</span>
        <div className="flex flex-wrap gap-1.5">
          {sources.map((src) => {
            let color = "bg-white/[0.04] text-[--text-secondary] border-white/[0.06]";
            if (src === "Planner") color = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
            else if (src === "Retrieved Papers") color = "bg-blue-500/10 text-blue-400 border-blue-500/20";
            else if (src === "Evidence") color = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            else if (src === "Knowledge Graph") color = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
            else if (src === "Uploaded PDF") color = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            else if (src === "Project Memory") color = "bg-violet-500/10 text-violet-400 border-violet-500/20";

            return (
              <span key={src} className={`px-2 py-0.5 rounded border text-[9px] font-bold ${color}`}>
                {src}
              </span>
            );
          })}
        </div>

        {confidence !== undefined && confidence > 0 && (
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[9px] uppercase text-[--text-muted]">Grounding Confidence:</span>
            <span className="text-[10px] font-bold text-gradient-airos">{confidence}%</span>
          </div>
        )}
      </div>

      {/* Referenced Content */}
      <div className="space-y-1 bg-white/[0.01] rounded-lg p-2.5 border border-white/[0.02]">
        {relatedPapers.length > 0 && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] text-[--text-muted] uppercase tracking-wider font-bold">Related Literature:</span>
            <ul className="list-disc pl-3 text-[9px] text-[--text-secondary] space-y-0.5">
              {relatedPapers.map((paper, idx) => (
                <li key={idx}>{paper}</li>
              ))}
            </ul>
          </div>
        )}

        {relatedEvidence.length > 0 && (
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-[8px] text-[--text-muted] uppercase tracking-wider font-bold">Supporting Evidence Vectors:</span>
            <ul className="list-disc pl-3 text-[9px] text-[--text-secondary] space-y-0.5">
              {relatedEvidence.map((ev, idx) => (
                <li key={idx}>"{ev}"</li>
              ))}
            </ul>
          </div>
        )}

        {relatedNodes.length > 0 && (
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-[8px] text-[--text-muted] uppercase tracking-wider font-bold">Active Graph Nodes:</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {relatedNodes.map((n, idx) => (
                <span key={idx} className="bg-cyan-500/5 text-cyan-400 border border-cyan-500/10 px-1.5 py-0.5 rounded text-[8px] font-bold">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {(plannerRefs.length > 0 || rqRefs.length > 0) && (
          <div className="flex items-center gap-4 mt-1 border-t border-white/[0.02] pt-1">
            {plannerRefs.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-[--text-muted] uppercase tracking-wider font-bold">Objectives Linked:</span>
                <span className="text-[9px] text-white font-bold">{plannerRefs.length}</span>
              </div>
            )}
            {rqRefs.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-[--text-muted] uppercase tracking-wider font-bold">Q-References:</span>
                <div className="flex gap-1">
                  {rqRefs.map((rq) => (
                    <span key={rq} className="text-[9px] font-bold text-indigo-400 bg-indigo-500/5 px-1 rounded border border-indigo-500/10">
                      {rq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
