"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends Omit<HTMLMotionProps<"a">, "children"> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

const variants: Record<Variant, string> = {
  primary:
    "btn-shine bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] text-white shadow-[0_0_24px_var(--glow-blue)] hover:-translate-y-0.5 hover:shadow-[0_0_32px_var(--glow-purple)]",
  secondary:
    "glass-panel text-[var(--color-text-primary)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[0_0_24px_var(--glow-sky)]",
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
