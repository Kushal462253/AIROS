"use client";

import type { QueryValidationResult } from "../types";

interface ThreatCardProps {
  injectionResult: QueryValidationResult | null;
}

export default function ThreatCard({ injectionResult }: ThreatCardProps) {
  if (!injectionResult) {
    return (
      <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 flex flex-col justify-between h-full font-mono text-[10px]">
        <span className="text-[--text-muted] uppercase tracking-widest block mb-2">
          // PROMPT_INJECTION_SCANNER
        </span>
        <div className="text-center py-6 text-[--text-muted]">
          Waiting for Copilot interaction prompt audit...
        </div>
      </div>
    );
  }

  const { riskLevel, riskScore, violations, explanation } = injectionResult;

  let riskColor = "text-emerald-400";
  let riskBg = "bg-emerald-500/5";
  let borderClass = "border-emerald-500/20";
  if (riskLevel === "High") {
    riskColor = "text-rose-400 animate-pulse";
    riskBg = "bg-rose-500/5";
    borderClass = "border-rose-500/20";
  } else if (riskLevel === "Medium" || riskLevel === "Low") {
    riskColor = "text-amber-400";
    riskBg = "bg-amber-500/5";
    borderClass = "border-amber-500/20";
  }

  return (
    <div className={`glass-panel border bg-surface-secondary/20 rounded-2xl p-5 flex flex-col justify-between h-full font-mono text-[10px] ${borderClass}`}>
      <span className="text-[--text-muted] uppercase tracking-widest block mb-1">
        // PROMPT_INJECTION_SCANNER
      </span>

      <div className="space-y-3 pt-2">
        {/* Risk Score & Level */}
        <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
          <span className="text-[--text-secondary]">Risk Assessment</span>
          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${riskColor} ${riskBg} ${borderClass}`}>
            {riskLevel} Risk ({riskScore}%)
          </span>
        </div>

        {/* Violations */}
        {violations.length > 0 ? (
          <div className="space-y-1">
            <span className="text-rose-400/80 font-bold uppercase text-[9px]">Payload Anomalies:</span>
            <ul className="list-disc pl-3.5 space-y-1 text-white">
              {violations.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-emerald-400/80 uppercase font-bold text-[9px]">
            No heuristic signature anomalies found
          </div>
        )}

        {/* Explanation */}
        <p className="text-[11px] leading-relaxed text-[--text-secondary]">
          {explanation}
        </p>
      </div>
    </div>
  );
}
