"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const DefaultIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer ring */}
    <circle
      cx="32"
      cy="32"
      r="28"
      stroke="url(#empty-grad)"
      strokeWidth="1.5"
      strokeDasharray="4 6"
      opacity="0.3"
    />
    {/* Inner document shape */}
    <rect
      x="20"
      y="16"
      width="24"
      height="32"
      rx="3"
      stroke="url(#empty-grad)"
      strokeWidth="1.5"
      opacity="0.5"
    />
    {/* Text lines */}
    <line x1="25" y1="25" x2="39" y2="25" stroke="url(#empty-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <line x1="25" y1="30" x2="35" y2="30" stroke="url(#empty-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <line x1="25" y1="35" x2="37" y2="35" stroke="url(#empty-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    {/* Plus icon */}
    <circle cx="40" cy="40" r="8" fill="#0a0a0f" stroke="url(#empty-grad)" strokeWidth="1.5" opacity="0.7" />
    <line x1="40" y1="37" x2="40" y2="43" stroke="url(#empty-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <line x1="37" y1="40" x2="43" y2="40" stroke="url(#empty-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <defs>
      <linearGradient id="empty-grad" x1="12" y1="12" x2="52" y2="52">
        <stop stopColor="#a5b4fc" />
        <stop offset="0.5" stopColor="#6366f1" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
  </svg>
);

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Icon */}
      <motion.div
        variants={itemVariants}
        className="relative mb-8"
      >
        {/* Glow behind icon */}
        <div className="absolute inset-0 -m-4 rounded-full bg-airos-500/[0.06] blur-2xl" />
        <div className="relative">
          {icon ?? <DefaultIcon />}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={itemVariants}
        className="mb-2 text-lg font-semibold text-white"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="mb-8 max-w-sm text-sm leading-relaxed text-[--text-secondary]"
      >
        {description}
      </motion.p>

      {/* CTA */}
      {actionLabel && onAction && (
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="
            group relative flex items-center gap-2 overflow-hidden rounded-xl
            bg-airos-600 px-6 py-3 text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-airos-500 hover:shadow-lg hover:shadow-airos-600/25
            active:scale-[0.98]
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:rotate-90"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
