"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start items-end gap-2.5">
      {/* Bot Icon */}
      <div className="h-6 w-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 1 8 4M12 2a10 10 0 0 0-8 4M12 2v20M2 12h20" />
        </svg>
      </div>

      {/* Typing Bubble */}
      <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%] flex items-center gap-1">
        <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider mr-2">
          Copilot is routing
        </span>
        <motion.span
          className="h-1 w-1 bg-indigo-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="h-1 w-1 bg-indigo-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="h-1 w-1 bg-indigo-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  );
}
