"use client";

import { motion } from "framer-motion";
import { orbVariants, glowVariants } from "@/lib/animations";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-primary px-4 py-12 sm:px-6">
      {/* Ambient orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-airos-600/[0.06] blur-[120px]"
        variants={orbVariants(0)}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/3 h-[350px] w-[350px] rounded-full bg-airos-400/[0.04] blur-[100px]"
        variants={orbVariants(3)}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-airos-500/[0.03] blur-[80px]"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
