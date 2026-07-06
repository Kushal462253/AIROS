"use client";

import { motion } from "framer-motion";
import type { SecurityStats } from "../types";

interface SecurityScoreProps {
  stats: SecurityStats;
}

export default function SecurityScore({ stats }: SecurityScoreProps) {
  const score = stats.overallSecurityScore;
  
  // Color styling based on score ranges
  let color = "text-emerald-400";
  let bg = "bg-emerald-500/10";
  let border = "border-emerald-500/20";
  let statusText = "System Secured";

  if (score < 70) {
    color = "text-rose-400";
    bg = "bg-rose-500/10";
    border = "border-rose-500/20";
    statusText = "Risk Detected";
  } else if (score < 90) {
    color = "text-amber-400";
    bg = "bg-amber-500/10";
    border = "border-amber-500/20";
    statusText = "Alert Flagged";
  }

  // Calculate circular perimeter: 2 * PI * r
  const radius = 40;
  const strokeWidth = 6;
  const perimeter = 2 * Math.PI * radius;
  const strokeDashoffset = perimeter - (score / 100) * perimeter;

  return (
    <div className={`glass-panel border rounded-2xl p-5 flex flex-col items-center justify-between h-full bg-surface-secondary/25 relative ${border}`}>
      <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-widest block self-start">
        // Safety Index Ratio
      </span>

      {/* Radial score circle */}
      <div className="relative h-28 w-28 flex items-center justify-center my-3">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-white/[0.04]"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className={`stroke-current ${color}`}
            strokeWidth={strokeWidth}
            strokeDasharray={perimeter}
            initial={{ strokeDashoffset: perimeter }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Dynamic score label */}
        <div className="absolute flex flex-col items-center justify-center font-mono">
          <span className="text-2xl font-bold text-white leading-none">
            {score}
          </span>
          <span className="text-[7px] text-[--text-muted] tracking-widest uppercase mt-0.5">
            SCORE
          </span>
        </div>
      </div>

      {/* Badge indicators */}
      <div className={`rounded-xl px-4 py-2 border w-full flex flex-col items-center font-mono text-center ${bg} ${border}`}>
        <span className="text-[7px] text-[--text-muted] uppercase tracking-wider block">
          Threat Status Assessment
        </span>
        <span className={`text-[10px] font-bold uppercase mt-0.5 ${color}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}
