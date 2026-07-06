"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PlanningStage } from "../types";

interface PlannerTimelineProps {
  stages: PlanningStage[];
}

export default function PlannerTimeline({ stages }: PlannerTimelineProps) {
  // Find current running stage index for progress calculation
  const runningIndex = stages.findIndex((s) => s.status === "running");
  const activeIndex = runningIndex !== -1 ? runningIndex : stages.every(s => s.status === "completed") ? stages.length : 0;
  const progressPercent = (activeIndex / (stages.length - 1)) * 100;

  return (
    <div className="glass-panel glow-ring mx-auto max-w-2xl rounded-2xl p-8 relative overflow-hidden bg-surface-secondary/40 backdrop-blur-xl border border-white/[0.04]">
      {/* Top ambient scanlines or glows */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-airos-500 to-transparent animate-pulse-slow" />
      
      {/* Terminal Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-airos-400 animate-ping" />
            <span className="font-mono text-xs font-semibold tracking-widest text-airos-400 uppercase">
              System Core // Planner Engine
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-white">
            Constructing Execution Topography
          </h3>
        </div>
        
        {/* Progress percent display */}
        <div className="flex items-end flex-col">
          <span className="font-mono text-xs text-[--text-muted]">PROGRESS VALUE</span>
          <span className="font-mono text-xl font-bold text-gradient-airos">
            {Math.round((activeIndex / stages.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative mb-8 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-airos-500 to-airos-400"
          initial={{ width: "0%" }}
          animate={{ width: `${(activeIndex / stages.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Timeline stages */}
      <div className="relative space-y-6 pl-8">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/[0.06]">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-airos-500 to-airos-300"
            initial={{ height: "0%" }}
            animate={{ height: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />
        </div>

        {stages.map((stage, idx) => {
          const isPending = stage.status === "pending";
          const isRunning = stage.status === "running";
          const isCompleted = stage.status === "completed";

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isPending ? 0.35 : 1,
                x: 0,
              }}
              transition={{ duration: 0.4 }}
              className="relative flex items-center justify-between"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[29px] flex h-6 w-6 items-center justify-center">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="z-10 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                ) : isRunning ? (
                  <div className="z-10 flex h-5 w-5 items-center justify-center">
                    <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-airos-500/30" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-airos-400 border border-white/20 shadow-[0_0_8px_var(--airos-primary)]" />
                  </div>
                ) : (
                  <div className="z-10 h-2.5 w-2.5 rounded-full bg-white/[0.1] border border-white/[0.05]" />
                )}
              </div>

              {/* Stage Text */}
              <div className="flex-1">
                <span
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isRunning
                      ? "text-white"
                      : isCompleted
                      ? "text-[--text-secondary]"
                      : "text-[--text-muted]"
                  }`}
                >
                  {stage.name}
                </span>
              </div>

              {/* Status Text Indicator */}
              <div className="font-mono text-xs uppercase tracking-wider">
                {isCompleted && (
                  <span className="text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    Ready
                  </span>
                )}
                {isRunning && (
                  <span className="text-airos-400 bg-airos-500/5 px-2 py-0.5 rounded border border-airos-500/10 flex items-center gap-1.5">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing
                  </span>
                )}
                {isPending && (
                  <span className="text-[--text-muted] px-2 py-0.5">
                    Queued
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer System Diagnostics */}
      <div className="mt-8 border-t border-white/[0.04] pt-4 flex items-center justify-between text-[10px] font-mono text-[--text-muted]">
        <div className="flex items-center gap-3">
          <span>HOST: localhost</span>
          <span>//</span>
          <span>KERNEL: AIROS_V1</span>
        </div>
        <div className="flex items-center gap-1.5 text-airos-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-airos-400 animate-pulse" />
          <span>LISTENING ON SHRD_MEM</span>
        </div>
      </div>
    </div>
  );
}
