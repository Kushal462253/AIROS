"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const inputItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <motion.div variants={inputItem} className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[--text-secondary]"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[--text-muted]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-surface-secondary/50 px-4 py-3 text-sm text-white
              placeholder-[--text-muted] outline-none
              transition-all duration-200
              border-white/[0.06]
              focus:border-airos-500/40 focus:ring-2 focus:ring-airos-500/10 focus:bg-surface-secondary/80
              disabled:cursor-not-allowed disabled:opacity-50
              ${icon ? "pl-11" : ""}
              ${error ? "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10" : ""}
              ${className}
            `}
            {...props}
          />
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
      </motion.div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
