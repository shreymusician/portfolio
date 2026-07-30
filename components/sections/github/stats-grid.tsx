"use client";

import { motion } from "framer-motion";
import { CountUp } from "./count-up";

export type GithubStat = {
  label: string;
  value: number;
  accent?: "blue" | "purple" | "sky" | "orange";
};

const accentGlow: Record<NonNullable<GithubStat["accent"]>, string> = {
  blue: "var(--glow-blue)",
  purple: "var(--glow-purple)",
  sky: "var(--glow-sky)",
  orange: "var(--glow-orange)",
};

export function StatsGrid({ stats }: { stats: GithubStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className="glass-panel rounded-2xl p-5 text-center transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_var(--stat-glow)]"
          style={{ "--stat-glow": accentGlow[stat.accent ?? "blue"] } as React.CSSProperties}
        >
          <p className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            <CountUp value={stat.value} />
          </p>
          <p className="mt-1.5 text-sm font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
