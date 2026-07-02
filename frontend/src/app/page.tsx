"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  containerVariants,
  itemVariants,
  glowVariants,
  orbVariants,
} from "@/lib/animations";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-primary">
      {/* Background gradient orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-airos-600/[0.07] blur-[120px]"
        variants={orbVariants(0)}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-airos-400/[0.05] blur-[100px]"
        variants={orbVariants(2)}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-airos-500/[0.04] blur-[80px]"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glow ring behind logo */}
        <motion.div
          className="absolute -top-20 h-40 w-40 rounded-full bg-airos-500/20 blur-[60px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Logo mark */}
        <motion.div variants={itemVariants} className="relative mb-8">
          <div className="glass-panel glow-ring flex h-20 w-20 items-center justify-center rounded-2xl">
            <Logo />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="mb-3 text-6xl font-bold tracking-tight sm:text-7xl"
        >
          <span className="text-gradient-airos">AIROS</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mb-10 font-mono text-sm font-medium uppercase tracking-[0.3em] text-airos-300/60"
        >
          AI Research Operating System
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="mb-10 h-px w-48 bg-gradient-to-r from-transparent via-airos-500/30 to-transparent"
        />

        {/* Status badge */}
        <motion.div variants={itemVariants}>
          <StatusBadge label="Architecture Initialized Successfully" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-primary to-transparent" />
    </main>
  );
}
