"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  PasswordInput,
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = await resetPassword({
      password,
      confirmPassword,
      token: "mock-reset-token",
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error ?? "Failed to reset password.");
    }
  };

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.push("/auth/sign-in"), 2500);
    return () => clearTimeout(timer);
  }, [success, router]);

  if (success) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="flex flex-col items-center py-4 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-xl font-bold text-white"
            >
              Password reset successful
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-[--text-secondary]"
            >
              Redirecting you to sign in...
            </motion.p>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Set new password"
          subtitle="Create a strong password for your account"
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
          <PasswordInput
            label="New password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
            showStrength
          />

          <PasswordInput
            label="Confirm new password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
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
                Resetting...
              </span>
            ) : (
              "Reset password"
            )}
          </motion.button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
