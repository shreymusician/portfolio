"use client";

import { useState } from "react";
import type { ContributionYear } from "@/lib/github";
import { ContributionHeatmap } from "@/components/sections/github/contribution-heatmap";

export function ContributionHeatmapCard({ years }: { years: ContributionYear[] }) {
  const [selectedYear, setSelectedYear] = useState(years[0]?.year);
  const active = years.find((y) => y.year === selectedYear) ?? years[0];

  if (!active) return null;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[var(--color-accent)]/30 via-[var(--color-accent-2)]/15 to-[var(--color-highlight)]/30 p-px shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
      <div className="glass-panel relative overflow-hidden rounded-[1.75rem] p-6 sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-20 -z-10 h-72 w-72 rounded-full bg-[var(--glow-blue)] opacity-70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-14 -z-10 h-72 w-72 rounded-full bg-[var(--glow-purple)] opacity-60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--glow-orange)] opacity-40 blur-3xl"
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                GitHub Contributions
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-success)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                </span>
                Live
              </span>
            </div>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
              {active.totalContributions.toLocaleString()} contributions in {active.year}
            </p>
          </div>

          {years.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] p-1">
              {years.map((y) => (
                <button
                  key={y.year}
                  type="button"
                  onClick={() => setSelectedYear(y.year)}
                  aria-pressed={y.year === selectedYear}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                    y.year === selectedYear
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {y.year}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7">
          <ContributionHeatmap weeks={active.weeks} />
        </div>
      </div>
    </div>
  );
}
