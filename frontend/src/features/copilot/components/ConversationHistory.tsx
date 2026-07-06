"use client";

import { useEffect, useRef } from "react";
import type { CopilotMessage } from "../types";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

interface ConversationHistoryProps {
  messages: CopilotMessage[];
  isTyping?: boolean;
}

export default function ConversationHistory({
  messages,
  isTyping,
}: ConversationHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto space-y-4 px-4 py-2 scrollbar-thin scrollbar-thumb-white/5"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 text-[--text-muted] font-mono text-xs h-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-40">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M12 2a6 6 0 0 1 6 6v3H6V8a6 6 0 0 1 6-6z" />
          </svg>
          <span>SECURE_GROUNDED_SESSION_ESTABLISHED</span>
          <p className="text-[10px] opacity-60 mt-1 max-w-[280px]">
            No messages yet. Select a starter question below or type a query.
          </p>
        </div>
      ) : (
        messages.map((m) => <ChatMessage key={m.id} message={m} />)
      )}

      {isTyping && <TypingIndicator />}
    </div>
  );
}
