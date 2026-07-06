"use client";

import { motion } from "framer-motion";
import type { GraphEdge } from "../types";

interface GraphEdgeLineProps {
  edge: GraphEdge;
}

export default function GraphEdgeLine({ edge }: GraphEdgeLineProps) {
  const isInactive = edge.status === "inactive";
  const isActive = edge.status === "active";
  const isCompleted = edge.status === "completed";

  let strokeColor = "rgba(255, 255, 255, 0.08)";
  if (isActive) strokeColor = "#818cf8";
  if (isCompleted) strokeColor = "#10b981";

  return (
    <div className="flex justify-start pl-[22px] md:justify-center md:pl-0 w-full my-0.5 relative z-0">
      <style>{`
        @keyframes flowDash {
          to {
            stroke-dashoffset: -12;
          }
        }
        .flow-line-dash {
          animation: flowDash 0.6s linear infinite;
        }
      `}</style>

      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="overflow-visible">
        {/* Shadow glow for completed flow */}
        {isCompleted && (
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="28"
            stroke="rgba(16, 185, 129, 0.2)"
            strokeWidth="5"
            strokeLinecap="round"
            className="blur-[2px]"
          />
        )}

        {/* Shadow glow for active flow */}
        {isActive && (
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="28"
            stroke="rgba(99, 102, 241, 0.45)"
            strokeWidth="6"
            strokeLinecap="round"
            className="blur-[3px]"
          />
        )}

        {/* Main Edge Line */}
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="28"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={isActive ? "6 6" : undefined}
          className={isActive ? "flow-line-dash" : undefined}
        />

        {/* Flowing Pulse Node */}
        {isActive && (
          <motion.circle
            cx="12"
            cy="0"
            r="3.5"
            fill="#a5b4fc"
            animate={{ cy: [0, 28] }}
            transition={{
              duration: 1.0,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </svg>
    </div>
  );
}
