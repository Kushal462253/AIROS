"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthLayout, AuthCard } from "@/components/auth";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/features/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [resent, setResent] = useState(false);

  const handleResend = useCallback(() => {
    setResent(true);
  }, []);

  useEffect(() => {
    if (!resent) return;
    const timer = setTimeout(() => setResent(false), 3000);
    return () => clearTimeout(timer);
  }, [resent]);

  const handleContinue = () => {
    router.push("/workspace");
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center py-4 text-center">
          {/* Animated envelope icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
            className="relative mb-8"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-airos-500/10">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            {/* Floating dot */}
            <motion.div
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-airos-500 shadow-lg shadow-airos-500/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <Logo size={20} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-2xl font-bold text-white"
          >
            Verify your email
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 max-w-xs text-sm leading-relaxed text-[--text-secondary]"
          >
            We sent a verification link to{" "}
            <span className="font-medium text-white">
              {user?.email ?? "your email"}
            </span>
            . Check your inbox and click the link to activate your account.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex w-full flex-col gap-3"
          >
            <button
              onClick={handleContinue}
              className="
                w-full rounded-xl bg-airos-600 px-4 py-3
                text-sm font-semibold text-white
                transition-all duration-200
                hover:bg-airos-500 hover:shadow-lg hover:shadow-airos-600/20
                active:scale-[0.98]
              "
            >
              Continue to workspace
            </button>

            <button
              onClick={handleResend}
              disabled={resent}
              className="
                w-full rounded-xl border border-white/[0.06] bg-surface-secondary/50 px-4 py-3
                text-sm font-medium text-[--text-secondary]
                transition-all duration-200
                hover:bg-surface-secondary/80 hover:text-white
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {resent ? (
                <span className="flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Email sent!
                </span>
              ) : (
                "Resend verification email"
              )}
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-xs text-[--text-muted]"
          >
            Didn&apos;t receive the email? Check your spam folder.
          </motion.p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
