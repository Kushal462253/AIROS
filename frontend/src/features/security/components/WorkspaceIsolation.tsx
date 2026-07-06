"use client";

import type { WorkspaceIsolationState, MemoryProtectionState } from "../types";

interface WorkspaceIsolationProps {
  isolation: WorkspaceIsolationState;
  protection: MemoryProtectionState;
}

export default function WorkspaceIsolation({ isolation, protection }: WorkspaceIsolationProps) {
  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full font-mono text-[10px]">
      <span className="text-[--text-muted] uppercase tracking-widest block border-b border-white/[0.04] pb-2 mb-1">
        // WORKSPACE_ISOLATION_AND_MEMORY_INTEGRITY
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {/* Workspace ID */}
        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Workspace ID</span>
          <span className="text-white text-xs font-bold truncate mt-1">
            {isolation.workspaceId}
          </span>
        </div>

        {/* Sandbox Path */}
        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Sandbox Path</span>
          <span className="text-[10px] text-white font-semibold truncate mt-1" title={isolation.sandboxPath}>
            {isolation.sandboxPath}
          </span>
        </div>

        {/* Namespace */}
        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Memory Namespace</span>
          <span className="text-[10px] text-indigo-400 font-semibold mt-1">
            {isolation.memoryNamespace}
          </span>
        </div>

        {/* Session Isolation Status */}
        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Session Isolation</span>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1">
            {isolation.sessionIsolationStatus.toUpperCase()} [LOCAL_ONLY]
          </span>
        </div>

        {/* Memory Integrity */}
        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Memory Integrity</span>
          <span className="text-[10px] text-emerald-400 font-bold mt-1">
            {protection.integrityCheck} (HMAC-SHA256 verified)
          </span>
        </div>

        {/* Encryption Status */}
        <div className="flex flex-col justify-between p-2.5 rounded-lg border border-white/[0.02] bg-white/[0.01]">
          <span className="text-[8px] text-[--text-muted] uppercase">Encryption Status</span>
          <span className="text-[10px] text-emerald-400 font-bold mt-1">
            {protection.encryptionStatus} (Client-Scoped)
          </span>
        </div>
      </div>
    </div>
  );
}
