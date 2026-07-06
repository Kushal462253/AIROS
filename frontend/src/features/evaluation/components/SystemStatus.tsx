"use client";

import { motion } from "framer-motion";
import type { SystemStatusType } from "../types";

interface SystemStatusProps {
  status: SystemStatusType;
  score: number;
}

export default function SystemStatus({ status, score }: SystemStatusProps) {
  let color = "text-emerald-400";
  let bg = "bg-emerald-500/10";
  let border = "border-emerald-500/20";
  let rippleGlow = "shadow-[0_0_20px_rgba(52,211,153,0.25)]";

  if (status === "Degraded" || status === "Warning") {
    color = "text-amber-400";
    bg = "bg-amber-500/10";
    border = "border-amber-500/20";
    rippleGlow = "shadow-[0_0_20px_rgba(251,191,36,0.25)]";
  } else if (status === "Offline") {
    color = "text-rose-400";
    bg = "bg-rose-500/10";
    border = "border-rose-500/20";
    rippleGlow = "shadow-[0_0_20px_rgba(248,113,113,0.25)]";
  }

  // Radial border configuration
  const radius = 38;
  const strokeWidth = 5;
  const perimeter = 2 * Math.PI * radius;
  const strokeDashoffset = perimeter - (score / 100) * perimeter;

  return (
    <div className={`glass-panel border rounded-2xl p-5 flex flex-col items-center justify-between h-full bg-surface-secondary/25 relative ${border}`}>
      <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-widest block self-start">
        // Diagnostic status
      </span>

      {/* Pulsing indicator circle */}
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

        {/* Pulse center core */}
        <div className={`absolute h-14 w-14 rounded-full flex flex-col items-center justify-center font-mono ${bg} ${border} ${rippleGlow}`}>
          <span className={`text-[10px] font-bold uppercase ${color}`}>
            {status}
          </span>
        </div>
      </div>

      <div className={`rounded-xl px-4 py-2 border w-full flex flex-col items-center font-mono text-center ${bg} ${border}`}>
        <span className="text-[7px] text-[--text-muted] uppercase tracking-wider block">
          Diagnostic Audit Output
        </span>
        <span className={`text-[10px] font-bold uppercase mt-0.5 ${color}`}>
          SYSTEM_OPERATIONAL_GATEWAY
        </span>
      </div>
    </div>
  );
}
