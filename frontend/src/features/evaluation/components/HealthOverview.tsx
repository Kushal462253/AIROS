"use client";

import { motion } from "framer-motion";

interface HealthOverviewProps {
  activity: {
    agentActive: boolean;
    memorySynced: boolean;
    retrievalReady: boolean;
    graphReady: boolean;
    copilotReady: boolean;
  };
}

export default function HealthOverview({ activity }: HealthOverviewProps) {
  const diagnostics = [
    { label: "Agent Activity", status: activity.agentActive },
    { label: "Memory Sync buffer", status: activity.memorySynced },
    { label: "Retrieval engine Ready", status: activity.retrievalReady },
    { label: "Graph ontology compiler", status: activity.graphReady },
    { label: "Copilot secure console", status: activity.copilotReady },
  ];

  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full font-mono text-[10px]">
      <span className="text-[--text-muted] uppercase tracking-widest block border-b border-white/[0.04] pb-2 mb-1">
        // SERVICE_HEALTH_INDICATORS
      </span>

      <div className="space-y-3">
        {diagnostics.map((diag) => (
          <div
            key={diag.label}
            className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]"
          >
            <span className="text-[--text-secondary] text-xs">
              {diag.label}
            </span>

            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold uppercase ${diag.status ? "text-emerald-400" : "text-[--text-muted]"}`}>
                {diag.status ? "Operational" : "Idle"}
              </span>

              {/* Status Dot */}
              <div className="relative flex h-2 w-2">
                {diag.status && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${diag.status ? "bg-emerald-400" : "bg-white/10"}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
