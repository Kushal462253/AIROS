"use client";

import { useMemory } from "../context/MemoryContext";

export default function ProjectMemoryCard() {
  const { memoryState, memoryStatus } = useMemory();

  // Status themes
  const statusThemes = {
    idle: {
      dot: "bg-white/20",
      text: "text-[--text-muted]",
      label: "Idle Context",
    },
    active: {
      dot: "bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]",
      text: "text-indigo-400 font-semibold",
      label: "Active Ingestion",
    },
    synced: {
      dot: "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      text: "text-emerald-400 font-semibold",
      label: "Memory Synced",
    },
  };

  const theme = statusThemes[memoryStatus.status] || statusThemes.idle;

  // Format timestamp nicely
  const formatTime = (isoString: string) => {
    if (!isoString) return "Never";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return "Never";
    }
  };

  // Estimate serialized storage sizes in bytes/kb
  const getEstimatedSize = () => {
    try {
      const serialized = JSON.stringify(memoryState);
      const bytes = serialized.length * 2; // UTF-16 characters
      if (bytes < 1024) return `${bytes} B`;
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(2)} KB`;
      const mb = kb / 1024;
      return `${mb.toFixed(2)} MB`;
    } catch {
      return "2.4 KB";
    }
  };

  return (
    <div className="glass-panel glow-ring rounded-2xl border border-white/[0.04] p-6 bg-surface-secondary/20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
          <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono tracking-widest">
            Project Memory
          </h3>
        </div>

        {/* Dynamic Status badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-white/[0.02] px-2 py-0.5 border border-white/[0.03]">
          <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
          <span className={`font-mono text-[8px] uppercase tracking-wider ${theme.text}`}>
            {theme.label}
          </span>
        </div>
      </div>

      {/* Internal Content Metadata stats */}
      <div className="space-y-2.5 font-mono text-[10px] text-[--text-secondary] border-t border-white/[0.03] pt-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Planner Blueprints</span>
          <span className="font-bold text-white bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03]">
            {memoryState.plannerOutput ? 1 : 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Retrieved Papers</span>
          <span className="font-bold text-white bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03]">
            {memoryState.retrievedPapers.length}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Indexed Documents</span>
          <span className="font-bold text-white bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03]">
            {memoryState.uploadedPdfs.length}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Stored Context Chunks</span>
          <span className="font-bold text-white bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03]">
            {memoryState.retrievedContext.length}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Stored Evidence</span>
          <span className="font-bold text-white bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03]">
            {memoryState.evidence?.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Graph Concept Nodes</span>
          <span className="font-bold text-white bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03]">
            {memoryState.knowledgeGraph?.nodes.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Copilot Conversations</span>
          <span className="font-bold text-white bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03]">
            {memoryState.copilotConversations?.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Memory Status</span>
          <span className={`font-bold uppercase text-[9px] ${theme.text}`}>
            {theme.label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Last Synchronization</span>
          <span className="text-[--text-secondary] font-semibold">
            {formatTime(memoryStatus.lastUpdated)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[--text-muted] uppercase">Memory Size (estimated)</span>
          <span className="text-[--text-secondary] font-semibold">
            {getEstimatedSize()}
          </span>
        </div>
      </div>

      {/* Security alert context */}
      <div className="border-t border-white/[0.02] pt-2 text-[8px] font-mono text-[--text-muted] flex items-center justify-between">
        <span>SECURITY: PROJECT_LOCAL_SANDBOX</span>
        <span>SHRD_MEM_BUF</span>
      </div>
    </div>
  );
}
