"use client";

import type { SecurityEvent } from "../types";

interface SecurityEventsProps {
  events: SecurityEvent[];
  onClear: () => void;
}

export default function SecurityEvents({ events, onClear }: SecurityEventsProps) {
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "00:00:00";
    }
  };

  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full">
      {/* Header logs control */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-widest block">
            // Real-Time Audit ledger logs
          </span>
        </div>
        
        {events.length > 3 && (
          <button
            onClick={onClear}
            className="text-[9px] font-mono font-bold text-rose-400/80 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 px-2 py-1 rounded border border-rose-500/10 transition-all duration-200"
          >
            FLUSH_LOGS
          </button>
        )}
      </div>

      {/* Events table */}
      <div className="overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-white/10" style={{ maxHeight: "210px" }}>
        {events.length === 0 ? (
          <div className="text-center py-10 font-mono text-[10px] text-[--text-muted]">
            AUDIT_LOG_EMPTY
          </div>
        ) : (
          events.map((evt) => {
            let severityColor = "text-emerald-400 bg-emerald-500/5 border-emerald-500/10";
            if (evt.severity === "high") {
              severityColor = "text-rose-400 bg-rose-500/5 border-rose-500/10 animate-pulse";
            } else if (evt.severity === "medium") {
              severityColor = "text-amber-400 bg-amber-500/5 border-amber-500/10";
            }

            return (
              <div
                key={evt.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-150 font-mono text-[10px]"
              >
                {/* Time */}
                <span className="text-[--text-muted] tracking-tighter w-14 shrink-0">
                  {formatTime(evt.timestamp)}
                </span>

                {/* Module */}
                <span className="bg-white/[0.02] border border-white/[0.04] text-[--text-secondary] rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider shrink-0 uppercase">
                  {evt.module}
                </span>

                {/* Event text */}
                <span className="text-white text-xs truncate flex-1 min-w-0 pr-2">
                  {evt.event}
                </span>

                {/* Status Badge */}
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold shrink-0 ${severityColor}`}>
                  {evt.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
