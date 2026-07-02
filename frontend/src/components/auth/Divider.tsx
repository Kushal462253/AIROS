"use client";

import { motion } from "framer-motion";

interface DividerProps {
  text?: string;
}

const dividerItem = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

export default function Divider({ text = "or" }: DividerProps) {
  return (
    <motion.div
      variants={dividerItem}
      className="my-6 flex items-center gap-4"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <span className="text-xs font-medium uppercase tracking-widest text-[--text-muted]">
        {text}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </motion.div>
  );
}
