"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

const headerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function AuthHeader({
  title,
  subtitle,
  backHref,
  backLabel,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <motion.div variants={headerItem}>
        <Link href="/" className="mb-6 inline-block" aria-label="AIROS Home">
          <div className="glass-panel glow-ring flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105">
            <Logo size={28} />
          </div>
        </Link>
      </motion.div>

      <motion.h1
        variants={headerItem}
        className="mb-2 text-2xl font-bold tracking-tight text-white"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          variants={headerItem}
          className="text-sm leading-relaxed text-[--text-secondary]"
        >
          {subtitle}
        </motion.p>
      )}

      {backHref && backLabel && (
        <motion.p variants={headerItem} className="mt-3 text-sm text-[--text-muted]">
          <Link
            href={backHref}
            className="text-airos-400 transition-colors duration-200 hover:text-airos-300"
          >
            {backLabel}
          </Link>
        </motion.p>
      )}
    </div>
  );
}
