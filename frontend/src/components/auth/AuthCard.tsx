"use client";

import { motion } from "framer-motion";

interface AuthCardProps {
  children: React.ReactNode;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="glass-panel glow-ring rounded-2xl p-8 sm:p-10"
    >
      {children}
    </motion.div>
  );
}
