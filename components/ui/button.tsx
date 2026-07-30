"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends Omit<HTMLMotionProps<"a">, "children"> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white shadow-[0_0_24px_var(--glow-blue)] hover:bg-[var(--color-accent-hover)]",
  secondary:
    "border border-[var(--color-border-strong)] bg-white/[0.03] text-[var(--color-text-primary)] hover:bg-white/[0.07] hover:border-[var(--color-accent)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <motion.a
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
