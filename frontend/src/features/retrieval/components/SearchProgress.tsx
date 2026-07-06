"use client";

import { motion } from "framer-motion";
import type { SearchState } from "../types";

interface SearchProgressProps {
  state: SearchState;
  progress?: number;
}

const STEPS: { id: SearchState; label: string; subLabel: string }[] = [
  {
    id: "searching",
    label: "Searching academic indices...",
    subLabel: "Querying arXiv, Semantic Scholar, and Web index engines...",
  },
  {
    id: "retrieving",
    label: "Retrieving publications...",
    subLabel: "Downloading metadata records and abstract profiles...",
  },
  {
    id: "ranking",
    label: "Ranking semantic relevance...",
    subLabel: "Computing cosine relevance weight vectors...",
  },
  {
    id: "deduplicating",
    label: "Removing duplicate papers...",
    subLabel: "Excluding overlap records and validating source bounds...",
  },
  {
    id: "preparing",
    label: "Preparing workspace...",
    subLabel: "Compiling retrieved segments for session memory...",
  },
];

export default function SearchProgress({ state, progress = 0 }: SearchProgressProps) {
  if (state === "idle" || state === "complete") return null;

  // Find index of current state to check completeness of steps
  const activeIdx = STEPS.findIndex((s) => s.id === state);

  return (
    <div className="glass-panel glow-ring rounded-2xl p-6 bg-surface-secondary/40 relative overflow-hidden max-w-xl mx-auto border border-white/[0.04]">
      {/* Background progress line */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-airos-600 to-airos-400 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />

      <h4 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-widest text-airos-400">
        // INGESTION ENGINE ACTIVE
      </h4>

      <div className="relative space-y-6 pl-6">
        {/* Timeline bar */}
        <div className="absolute left-[9px] top-1.5 bottom-1.5 w-[1.5px] bg-white/[0.05]">
          <motion.div
            className="absolute top-0 left-0 w-full bg-airos-400"
            initial={{ height: "0%" }}
            animate={{
              height: `${(activeIdx / (STEPS.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {STEPS.map((step, idx) => {
          const isPending = idx > activeIdx;
          const isRunning = step.id === state;
          const isCompleted = idx < activeIdx;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
              className="relative flex items-start gap-4"
            >
              {/* Stepper Bullet */}
              <div className="absolute -left-[23px] flex h-5 w-5 items-center justify-center">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500"
                  >
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                ) : isRunning ? (
                  <div className="z-10 flex h-4 w-4 items-center justify-center">
                    <span className="absolute h-3 w-3 animate-ping rounded-full bg-airos-500/35" />
                    <span className="h-2 w-2 rounded-full bg-airos-400" />
                  </div>
                ) : (
                  <div className="z-10 h-2 w-2 rounded-full bg-white/[0.1] border border-white/[0.05]" />
                )}
              </div>

              {/* Step Text Details */}
              <div className="flex-1">
                <span
                  className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${
                    isRunning ? "text-white" : "text-[--text-muted]"
                  }`}
                >
                  {step.label}
                </span>
                <p className="mt-0.5 text-[10px] text-[--text-muted] leading-relaxed">
                  {step.subLabel}
                </p>
              </div>

              {/* Status Tag */}
              {isRunning && (
                <div className="font-mono text-[9px] uppercase tracking-wider text-airos-300 animate-pulse bg-airos-500/5 px-2 py-0.5 rounded border border-airos-500/10 shrink-0">
                  Running
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
