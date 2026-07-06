"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIVITIES = [
  "Semantic index updated",
  "Cross-domain relation discovered",
  "Memory synchronized",
  "Embedding cache optimized",
  "Contradiction scan completed",
  "New citation clustered",
  "Synthesizing latent graph connections",
  "Optimizing publication retrieval vector",
  "Re-weighting attention matrices",
  "Clustering reference citation logs",
];

export default function AmbientResearchEngine() {
  const [activeLogs, setActiveLogs] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    // Start interval showing logs every 5.5s
    const interval = setInterval(() => {
      const randomText = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      const logId = crypto.randomUUID();
      
      // Limit list to keep UI clean and subtle
      setActiveLogs((prev) => [...prev.slice(-1), { id: logId, text: randomText }]);

      // Remove after 3.8s
      setTimeout(() => {
        setActiveLogs((prev) => prev.filter((l) => l.id !== logId));
      }, 3800);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none select-none font-mono text-[9px] text-indigo-400/40 space-y-1.5 flex flex-col items-start">
      <AnimatePresence mode="popLayout">
        {activeLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded bg-indigo-500/[0.02] border border-indigo-500/5 px-2.5 py-1 backdrop-blur-[1px] shadow-sm animate-pulse"
          >
            <span className="h-1 w-1 rounded-full bg-indigo-500/30 shrink-0" />
            <span>{log.text.toUpperCase()}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
