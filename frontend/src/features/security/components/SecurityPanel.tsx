"use client";

import type {
  SecurityStats,
  SecurityEvent,
  WorkspaceIsolationState,
  MemoryProtectionState,
  ExecutionSafetyState,
  QueryValidationResult,
} from "../types";
import SecurityScore from "./SecurityScore";
import SecurityEvents from "./SecurityEvents";
import ThreatCard from "./ThreatCard";
import ValidationCard from "./ValidationCard";
import WorkspaceIsolation from "./WorkspaceIsolation";
import ExecutionSafety from "./ExecutionSafety";

interface SecurityPanelProps {
  events: SecurityEvent[];
  stats: SecurityStats;
  isolation: WorkspaceIsolationState;
  protection: MemoryProtectionState;
  safety: ExecutionSafetyState;
  queryResult: QueryValidationResult | null;
  injectionResult: QueryValidationResult | null;
  onClearLogs: () => void;
}

export default function SecurityPanel({
  events,
  stats,
  isolation,
  protection,
  safety,
  queryResult,
  injectionResult,
  onClearLogs,
}: SecurityPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono tracking-widest">
            Security Center
          </h3>
          <p className="text-xs text-[--text-secondary]">
            Workspace isolation, access sandboxing, and heuristic payload threat validations panel.
          </p>
        </div>
      </div>

      {/* Grid: Stats Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Queries Validated */}
        <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-4 flex flex-col justify-between font-mono text-[10px]">
          <span className="text-[--text-muted] uppercase block">Queries Audited</span>
          <span className="text-lg font-bold text-white mt-1.5">{stats.queriesValidated}</span>
        </div>

        {/* PDFs Validated */}
        <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-4 flex flex-col justify-between font-mono text-[10px]">
          <span className="text-[--text-muted] uppercase block">PDFs Verified</span>
          <span className="text-lg font-bold text-white mt-1.5">{stats.pdfsValidated}</span>
        </div>

        {/* Threats Blocked */}
        <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-4 flex flex-col justify-between font-mono text-[10px]">
          <span className="text-[--text-muted] uppercase block">Threats Prevented</span>
          <span className={`text-lg font-bold mt-1.5 ${stats.threatsDetected > 0 ? "text-rose-400 animate-pulse" : "text-white"}`}>
            {stats.threatsDetected}
          </span>
        </div>

        {/* Injection Attempts */}
        <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-4 flex flex-col justify-between font-mono text-[10px]">
          <span className="text-[--text-muted] uppercase block">Injection Triggers</span>
          <span className={`text-lg font-bold mt-1.5 ${stats.injectionAttempts > 0 ? "text-amber-400 animate-pulse" : "text-white"}`}>
            {stats.injectionAttempts}
          </span>
        </div>

        {/* Safe Agent Executions */}
        <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-4 flex flex-col justify-between font-mono text-[10px]">
          <span className="text-[--text-muted] uppercase block">Safe Executions</span>
          <span className="text-lg font-bold text-emerald-400 mt-1.5">{stats.safeExecutions}</span>
        </div>

        {/* Workspace Isolation Checks */}
        <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-4 flex flex-col justify-between font-mono text-[10px]">
          <span className="text-[--text-muted] uppercase block">Sandbox Checks</span>
          <span className="text-lg font-bold text-white mt-1.5">{stats.workspaceChecks}</span>
        </div>
      </div>

      {/* Primary Panels Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Security Score Radial + Audit Events log */}
        <div className="space-y-6 lg:col-span-1">
          <SecurityScore stats={stats} />
          <SecurityEvents events={events} onClear={onClearLogs} />
        </div>

        {/* Middle Column: Prompt Injection scanner + input constraints validation */}
        <div className="space-y-6 lg:col-span-1">
          <ThreatCard injectionResult={injectionResult} />
          <ValidationCard validationResult={queryResult} />
        </div>

        {/* Right Column: Sandbox settings + execution state indicators */}
        <div className="space-y-6 lg:col-span-1">
          <WorkspaceIsolation isolation={isolation} protection={protection} />
          <ExecutionSafety safety={safety} />
        </div>

      </div>
    </div>
  );
}
