"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthFooter,
  AuthInput,
} from "@/components/auth";
import { useAuth } from "@/features/auth";

const formItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ForgotPasswordPage() {
  const { requestPasswordReset, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await requestPasswordReset({ email });
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error ?? "Failed to send reset email.");
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="flex flex-col items-center py-4 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-airos-500/10"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-xl font-bold text-white"
            >
              Check your email
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 max-w-xs text-sm leading-relaxed text-[--text-secondary]"
            >
              We sent a password reset link to{" "}
              <span className="font-medium text-white">{email}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/auth/sign-in"
                className="text-sm text-airos-400 transition-colors duration-200 hover:text-airos-300"
              >
                ← Back to sign in
              </Link>
            </motion.div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Forgot password?"
          subtitle="Enter your email and we'll send you a reset link"
          backHref="/auth/sign-in"
          backLabel="← Back to sign in"
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          />

          <motion.button
            variants={formItem}
            type="submit"
            disabled={isLoading}
            className="
              relative w-full overflow-hidden rounded-xl bg-airos-600 px-4 py-3
              text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-airos-500 hover:shadow-lg hover:shadow-airos-600/20
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Sending...
              </span>
            ) : (
              "Send reset link"
            )}
          </motion.button>
        </form>
      </AuthCard>

      <AuthFooter
        text="Remember your password?"
        linkText="Sign in"
        linkHref="/auth/sign-in"
      />
    </AuthLayout>
  );
}
