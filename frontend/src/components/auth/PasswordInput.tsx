"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

const inputItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-400" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-400" };
  if (score <= 4) return { score, label: "Strong", color: "bg-emerald-400" };
  return { score, label: "Very Strong", color: "bg-emerald-400" };
}

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
);

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { label, error, showStrength = false, className = "", id, onChange, ...props },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [strength, setStrength] = useState({ score: 0, label: "", color: "" });

    const generatedId = useId();
    const inputId = id ?? generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showStrength) {
        setStrength(getPasswordStrength(e.target.value));
      }
      onChange?.(e);
    };

    return (
      <motion.div variants={inputItem} className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[--text-secondary]"
        >
          {label}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[--text-muted]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            onChange={handleChange}
            className={`
              w-full rounded-xl border bg-surface-secondary/50 py-3 pl-11 pr-12 text-sm text-white
              placeholder-[--text-muted] outline-none
              transition-all duration-200
              border-white/[0.06]
              focus:border-airos-500/40 focus:ring-2 focus:ring-airos-500/10 focus:bg-surface-secondary/80
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10" : ""}
              ${className}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[--text-muted] transition-colors duration-200 hover:text-white"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}

        {showStrength && strength.score > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1.5 pt-1"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i <= strength.score
                      ? strength.color
                      : "bg-white/[0.06]"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-[--text-muted]">
              Password strength:{" "}
              <span className="text-[--text-secondary]">{strength.label}</span>
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
