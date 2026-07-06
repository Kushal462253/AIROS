"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkspaceInitializerProps {
  title: string;
  onComplete: () => void;
  pipelineHealth: string;
  coverageEstimate: string;
  expectedConfidence: string;
  estimatedRuntime: string;
  children: React.ReactNode;
}

export default function WorkspaceInitializer({
  title,
  onComplete,
  pipelineHealth,
  coverageEstimate,
  expectedConfidence,
  estimatedRuntime,
  children,
}: WorkspaceInitializerProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.max(3, Math.round((100 - current) * 0.12));
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          onComplete();
        }, 600); // short wait after 100% to let transitions play
      } else {
        setProgress(current);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Construct standard ASCII block style terminal progress indicator
  const blockCount = Math.round(progress / 10);
  const blockBar = "█".repeat(blockCount) + "░".repeat(10 - blockCount);

  let currentStageText = "Neural network activating";
  if (progress >= 95) currentStageText = "Agent ready";
  else if (progress >= 75) currentStageText = "Citation graph initialized";
  else if (progress >= 55) currentStageText = "Semantic engine online";
  else if (progress >= 35) currentStageText = "Research memory synchronized";
  else if (progress >= 15) currentStageText = "Workspace secured";

  return (
    <div className="w-full relative min-h-[300px]">
      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div
            key="init-container"
            className="space-y-6 w-full max-w-3xl mx-auto py-8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } }}
          >
            {/* Header Text & Loader */}
            <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 p-6 rounded-2xl space-y-4 text-center">
              <span className="font-mono text-[9px] text-indigo-400 uppercase tracking-widest block animate-pulse">
                // SYSTEM_BOOT: {title.toUpperCase()}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight font-mono">
                {currentStageText}...
              </h3>
              
              <div className="space-y-2 max-w-md mx-auto">
                <div className="font-mono text-xs text-emerald-400 tracking-wider">
                  {blockBar} {progress}%
                </div>
                <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Split Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Security Monitor */}
              <motion.div
                layout
                className="glass-panel border border-emerald-500/20 bg-emerald-500/[0.02] p-5 rounded-xl space-y-3"
              >
                <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Security Monitor
                  </span>
                </div>
                
                <ul className="space-y-2 font-mono text-[10px] text-[--text-secondary]">
                  <li className="flex items-center justify-between">
                    <span>WORKSPACE ISOLATION</span>
                    <span className="text-emerald-400 font-bold">SECURE</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>EXECUTION SANDBOX</span>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>MEMORY STACK ENCRYPTION</span>
                    <span className="text-emerald-400 font-bold">PROTECTED</span>
                  </li>
                </ul>
              </motion.div>

              {/* Evaluation Summary */}
              <motion.div
                layout
                className="glass-panel border border-indigo-500/20 bg-indigo-500/[0.02] p-5 rounded-xl space-y-3"
              >
                <div className="flex items-center gap-2 border-b border-indigo-500/10 pb-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                    Evaluation Summary
                  </span>
                </div>

                <ul className="space-y-2 font-mono text-[10px] text-[--text-secondary]">
                  <li className="flex items-center justify-between">
                    <span>PIPELINE HEALTH</span>
                    <span className="text-white font-bold">{pipelineHealth}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>COVERAGE ESTIMATE</span>
                    <span className="text-white font-bold">{coverageEstimate}%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>EXPECTED CONFIDENCE</span>
                    <span className="text-white font-bold">{expectedConfidence}%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>ESTIMATED RUNTIME</span>
                    <span className="text-white font-bold">{estimatedRuntime}</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="workspace-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
