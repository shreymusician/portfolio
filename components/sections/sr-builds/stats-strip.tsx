import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/motion/reveal";

export type StripStat = {
  label: string;
  value: number;
};

/**
 * Deliberately understated compared to the GitHub section's StatGrid cards
 * -- a single thin row, not a grid of glowing tiles. Numbers matter here
 * less than the content itself, so they get a supporting role.
 */
export function StatsStrip({ stats }: { stats: StripStat[] }) {
  return (
    <Reveal>
      <div className="glass-panel flex flex-wrap items-center justify-center divide-x divide-[var(--color-border)] rounded-2xl">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col items-center gap-1 px-6 py-5 text-center">
            <p className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
              <CountUp value={stat.value} />
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)] sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
