"use client";

import React, { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Ask the Copilot to navigate, explain, or check grounding in this project..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="
          flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-airos-500/40 focus:ring-1 focus:ring-airos-500/10 transition-all duration-200
        "
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="
          rounded-xl bg-airos-600 hover:bg-airos-500 text-white font-semibold text-[11px] px-5 py-2.5 transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-airos-600/20 disabled:opacity-40 disabled:hover:shadow-none shrink-0
        "
      >
        <span>Send</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
