"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn({ email, password, rememberMe });
    if (result.success) {
      router.push("/workspace");
    } else {
      setError(result.error ?? "Sign in failed.");
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
          title="Welcome back"
          subtitle="Sign in to your AIROS account"
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />

          <motion.div
            variants={formItem}
            className="flex items-center justify-between"
          >
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 bg-surface-secondary/50 text-airos-500 focus:ring-airos-500/20 focus:ring-offset-0"
              />
              <span className="text-[--text-secondary]">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-airos-400 transition-colors duration-200 hover:text-airos-300"
            >
              Forgot password?
            </Link>
          </motion.div>

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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>
      </AuthCard>

      <AuthFooter
        text="Don&apos;t have an account?"
        linkText="Create account"
        linkHref="/auth/sign-up"
      />
    </AuthLayout>
  );
}
