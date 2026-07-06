"use client";

import type { PipelineHealthState } from "../types";

interface PipelineHealthProps {
  pipeline: PipelineHealthState;
}

export default function PipelineHealth({ pipeline }: PipelineHealthProps) {
  const steps = Object.keys(pipeline) as Array<keyof PipelineHealthState>;

  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full font-mono text-[10px]">
      <span className="text-[--text-muted] uppercase tracking-widest block border-b border-white/[0.04] pb-2 mb-1">
        // PIPELINE_NODE_HEALTH
      </span>

      <div className="space-y-3">
        {steps.map((step) => {
          const status = pipeline[step];
          let color = "text-emerald-400";
          let bg = "bg-emerald-500/5";
          let border = "border-emerald-500/10";

          if (status === "Running") {
            color = "text-indigo-400 animate-pulse";
            bg = "bg-indigo-500/5";
            border = "border-indigo-500/10";
          } else if (status === "Waiting") {
            color = "text-[--text-secondary]";
            bg = "bg-white/[0.02]";
            border = "border-white/[0.04]";
          } else if (status === "Healthy") {
            color = "text-cyan-400";
            bg = "bg-cyan-500/5";
            border = "border-cyan-500/10";
          }

          return (
            <div
              key={step}
              className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]"
            >
              <span className="text-white text-xs font-semibold">
                {step}
              </span>
              <span className={`px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase ${color} ${bg} ${border}`}>
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
