"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthFooter,
  AuthInput,
  PasswordInput,
  SocialButton,
  Divider,
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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, isLoading } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    const result = await signUp({ displayName, email, password, acceptTerms });
    if (result.success) {
      router.push("/auth/verify-email");
    } else {
      setError(result.error ?? "Sign up failed.");
    }
  };

  const handleGoogle = async () => {
    setError("");
    const result = await signInWithGoogle();
    if (result.success) {
      router.push("/workspace");
    } else {
      setError(result.error ?? "Google sign in failed.");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create your account"
          subtitle="Start your AI-powered research journey"
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

        <SocialButton provider="google" onClick={handleGoogle} disabled={isLoading} />

        <Divider />

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Full name"
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="name"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            }
          />

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

          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
            showStrength
          />

          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          <motion.label
            variants={formItem}
            className="flex cursor-pointer items-start gap-2.5 text-sm"
          >
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/10 bg-surface-secondary/50 text-airos-500 focus:ring-airos-500/20 focus:ring-offset-0"
            />
            <span className="leading-relaxed text-[--text-secondary]">
              I agree to the{" "}
              <span className="text-airos-400">Terms of Service</span> and{" "}
              <span className="text-airos-400">Privacy Policy</span>
            </span>
          </motion.label>

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
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </motion.button>
        </form>
      </AuthCard>

      <AuthFooter
        text="Already have an account?"
        linkText="Sign in"
        linkHref="/auth/sign-in"
      />
    </AuthLayout>
  );
}
