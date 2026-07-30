"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { ContributionDay } from "@/lib/github";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Portfolio-tinted scale from dark navy (no activity) up to bright cyan (peak activity). */
function levelColor(count: number, max: number): string {
  if (count === 0) return "rgba(148, 163, 184, 0.08)";
  const ratio = max === 0 ? 0 : count / max;
  if (ratio <= 0.25) return "#2952e3"; // royal blue
  if (ratio <= 0.5) return "#3b82f6"; // blue
  if (ratio <= 0.75) return "#8b5cf6"; // purple
  return "#38bdf8"; // bright sky/cyan for peak days
}

export function ContributionHeatmap({ weeks }: { weeks: ContributionDay[][] }) {
  const [hovered, setHovered] = useState<ContributionDay | null>(null);

  const max = useMemo(
    () => Math.max(1, ...weeks.flat().map((d) => d.count)),
    [weeks]
  );

  const monthMarkers = useMemo(() => {
    const markers: { index: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        markers.push({ index: i, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    });
    return markers;
  }, [weeks]);

  return (
    <div className="relative">
      <div className="relative mb-2 h-4" style={{ marginLeft: "1.75rem" }}>
        {monthMarkers.map((m) => (
          <span
            key={`${m.label}-${m.index}`}
            className="absolute text-[11px] text-[var(--color-text-secondary)]"
            style={{ left: `${m.index * 14}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <div className="mt-0.5 flex shrink-0 flex-col justify-between text-[11px] text-[var(--color-text-secondary)]" style={{ height: "98px" }}>
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week.find((d) => d.weekday === di);
                if (!day) {
                  return <div key={di} className="h-[13px] w-[13px]" />;
                }
                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.3, delay: wi * 0.004 }}
                    onMouseEnter={() => setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    className="h-[13px] w-[13px] cursor-pointer rounded-[3px] transition-transform hover:scale-125"
                    style={{
                      background: levelColor(day.count, max),
                      boxShadow:
                        day.count > 0
                          ? `0 0 6px ${levelColor(day.count, max)}55`
                          : "none",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
        <span className="min-h-[1em]">
          {hovered
            ? `${hovered.count} contribution${hovered.count === 1 ? "" : "s"} on ${new Date(hovered.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
            : "Hover a day to see details"}
        </span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {[0, 0.2, 0.45, 0.7, 1].map((r) => (
            <span
              key={r}
              className="h-[11px] w-[11px] rounded-[3px]"
              style={{ background: levelColor(r === 0 ? 0 : Math.ceil(r * max), max) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
