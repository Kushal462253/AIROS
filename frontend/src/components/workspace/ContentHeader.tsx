"use client";

import { motion } from "framer-motion";

interface ContentHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function ContentHeader({
  title,
  subtitle,
  actions,
}: ContentHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-4 border-b border-white/[0.04] px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[--text-secondary]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.div>
  );
}
