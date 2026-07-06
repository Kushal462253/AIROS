"use client";

import { useCopilot } from "../useCopilot";
import CopilotStats from "./CopilotStats";
import ConversationHistory from "./ConversationHistory";
import SuggestedQuestions from "./SuggestedQuestions";
import ChatInput from "./ChatInput";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

import type { QueryValidationResult } from "@/features/security/types";

interface CopilotPanelProps {
  projectId: string;
  evidenceItems: EvidenceItem[];
  knowledgeGraph: KnowledgeGraph | null;
  onPromptSend?: (result: QueryValidationResult) => void;
  activeTab?: string;
}

export default function CopilotPanel({
  projectId,
  evidenceItems,
  knowledgeGraph,
  onPromptSend,
  activeTab = "overview",
}: CopilotPanelProps) {
  const { messages, isTyping, sendMessage, clearHistory, stats } = useCopilot({
    projectId,
    evidenceItems,
    knowledgeGraph,
    onPromptSend,
  });

  return (
    <div className="flex flex-col h-full w-full bg-[#08080c]/10 overflow-hidden relative animate-breathing-glow border border-transparent">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/[0.04] p-4 shrink-0 bg-[#0c0c14]/40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 8 4M12 2a10 10 0 0 0-8 4M12 2v20M2 12h20" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
              Research Copilot
            </h3>
            <p className="text-[9px] text-[--text-muted]">
              Grounded system navigation
            </p>
          </div>
        </div>

        {/* Clear Button */}
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-[8px] font-mono font-bold text-rose-400/80 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 px-2 py-1 rounded border border-rose-500/10 transition-all duration-200"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Analytics stats */}
      <CopilotStats stats={stats} />

      {/* Scrolling Chat Thread */}
      <ConversationHistory messages={messages} isTyping={isTyping} />

      {/* Suggested Questions selection */}
      <div className="px-4 py-1 shrink-0">
        <SuggestedQuestions onSelect={sendMessage} activeTab={activeTab} />
      </div>

      {/* Chat Input panel */}
      <div className="border-t border-white/[0.04] p-4 bg-[#0a0a0f]/40 shrink-0">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
