"use client";

import type { CopilotMessage } from "../types";
import SourceReferences from "./SourceReferences";

interface ChatMessageProps {
  message: CopilotMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  const formatTimestamp = (isoStr?: string) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Bot Icon */}
      {!isUser && (
        <div className="h-6 w-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 8 4M12 2a10 10 0 0 0-8 4M12 2v20M2 12h20" />
          </svg>
        </div>
      )}

      {/* Bubble Panel */}
      <div className={`
        glass-panel border p-4 max-w-[80%] flex flex-col justify-between
        ${isUser 
          ? "border-airos-500/20 bg-airos-950/15 text-white rounded-2xl rounded-br-none" 
          : "border-white/[0.04] bg-surface-secondary/20 text-[--text-secondary] rounded-2xl rounded-bl-none"}
      `}>
        {/* Timestamp Header */}
        <div className="flex items-center justify-between gap-6 mb-1 text-[8px] font-mono text-[--text-muted]">
          <span>{isUser ? "USER" : "AI COPILOT"}</span>
          <span>{formatTimestamp(message.timestamp)}</span>
        </div>

        {/* Content Body */}
        <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">
          {message.content}
        </p>

        {/* Source References (if Copilot message) */}
        {!isUser && (
          <SourceReferences
            sources={message.sources}
            confidence={message.confidence}
            relatedPapers={message.relatedPapers}
            relatedEvidence={message.relatedEvidence}
            relatedNodes={message.relatedNodes}
            plannerRefs={message.plannerRefs}
            rqRefs={message.rqRefs}
          />
        )}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="h-6 w-6 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}
