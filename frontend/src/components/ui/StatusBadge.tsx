"use client";

import { motion } from "framer-motion";

interface StatusBadgeProps {
  label: string;
  variant?: "success" | "warning" | "error" | "info";
}

const variantStyles: Record<string, { dot: string; text: string }> = {
  success: {
    dot: "bg-emerald-400",
    text: "text-emerald-300/90",
  },
  warning: {
    dot: "bg-amber-400",
    text: "text-amber-300/90",
  },
  error: {
    dot: "bg-red-400",
    text: "text-red-300/90",
  },
  info: {
    dot: "bg-airos-400",
    text: "text-airos-300/90",
  },
};

export default function StatusBadge({
  label,
  variant = "success",
}: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="glass-panel inline-flex items-center gap-3 rounded-full px-5 py-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${styles.dot} opacity-75`}
          />
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${styles.dot}`}
          />
        </span>
        <span
          className={`font-mono text-xs font-medium tracking-wider ${styles.text}`}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
