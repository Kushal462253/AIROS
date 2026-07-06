"use client";

import type { QueryValidationResult } from "../types";

interface ValidationCardProps {
  validationResult: QueryValidationResult | null;
}

export default function ValidationCard({ validationResult }: ValidationCardProps) {
  if (!validationResult) {
    return (
      <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 flex flex-col justify-between h-full font-mono text-[10px]">
        <span className="text-[--text-muted] uppercase tracking-widest block mb-2">
          // INPUT_SANITIZATION_GATEWAY
        </span>
        <div className="text-center py-6 text-[--text-muted]">
          Waiting for search query gateway validation...
        </div>
      </div>
    );
  }

  const { isValid, riskLevel, riskScore, violations, explanation } = validationResult;

  let validColor = "text-emerald-400";
  let validBg = "bg-emerald-500/5";
  let borderClass = "border-emerald-500/20";
  if (!isValid) {
    validColor = "text-rose-400";
    validBg = "bg-rose-500/5";
    borderClass = "border-rose-500/20";
  }

  return (
    <div className={`glass-panel border bg-surface-secondary/20 rounded-2xl p-5 flex flex-col justify-between h-full font-mono text-[10px] ${borderClass}`}>
      <span className="text-[--text-muted] uppercase tracking-widest block mb-1">
        // INPUT_SANITIZATION_GATEWAY
      </span>

      <div className="space-y-3 pt-2">
        {/* Validation Status */}
        <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
          <span className="text-[--text-secondary]">Gateway Status</span>
          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${validColor} ${validBg} ${borderClass}`}>
            {isValid ? "VALIDATED" : "VIOLATION FLAGGED"}
          </span>
        </div>

        {/* Violations */}
        {violations.length > 0 ? (
          <div className="space-y-1">
            <span className="text-rose-400/80 font-bold uppercase text-[9px]">Constraints Violated:</span>
            <ul className="list-disc pl-3.5 space-y-1 text-white">
              {violations.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-emerald-400/80 uppercase font-bold text-[9px]">
            Input satisfies format constraints
          </div>
        )}

        {/* Details Explanation */}
        <p className="text-[11px] leading-relaxed text-[--text-secondary]">
          {explanation}
        </p>
      </div>
    </div>
  );
}
