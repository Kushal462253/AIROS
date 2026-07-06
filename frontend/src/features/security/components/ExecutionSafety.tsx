"use client";

import type { ExecutionSafetyState } from "../types";

interface ExecutionSafetyProps {
  safety: ExecutionSafetyState;
}

export default function ExecutionSafety({ safety }: ExecutionSafetyProps) {
  const agents = Object.keys(safety) as Array<keyof ExecutionSafetyState>;

  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full font-mono text-[10px]">
      <span className="text-[--text-muted] uppercase tracking-widest block border-b border-white/[0.04] pb-2 mb-1">
        // AGENT_EXECUTION_SAFETY
      </span>

      <div className="space-y-2.5">
        {agents.map((agent) => {
          const status = safety[agent];
          let color = "text-emerald-400";
          let bg = "bg-emerald-500/5";
          let border = "border-emerald-500/10";

          if (status === "Blocked") {
            color = "text-rose-400 animate-pulse";
            bg = "bg-rose-500/5";
            border = "border-rose-500/10";
          } else if (status === "Warning") {
            color = "text-amber-400";
            bg = "bg-amber-500/5";
            border = "border-amber-500/10";
          }

          return (
            <div
              key={agent}
              className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]"
            >
              <span className="text-white text-xs font-semibold">
                {agent}
              </span>
              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${color} ${bg} ${border}`}>
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
