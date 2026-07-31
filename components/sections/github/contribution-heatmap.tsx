"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ContributionDay } from "@/lib/github";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** One shared viewport observer for the whole grid, staggered per week-column rather than per day-cell. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.012 } },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.95, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEKDAY_LABELS = ["Mon", "Wed", "Fri"];

const CELL_SIZE = 14;
const CELL_GAP = 4;
const STEP = CELL_SIZE + CELL_GAP;
const LABEL_COL_WIDTH = 34;
const LABEL_GAP = 12;
const GRID_OFFSET = LABEL_COL_WIDTH + LABEL_GAP;

/** GitHub's own dark-mode contribution scale -- kept authentic on purpose. */
const LEVEL_COLORS = [
  "#161b22", // 0: no activity
  "#0e4429", // 1: dark green
  "#006d32", // 2: medium green
  "#26a641", // 3: bright green
  "#39d353", // 4: light green (peak)
];

function levelColor(level: number): string {
  return LEVEL_COLORS[Math.min(level, LEVEL_COLORS.length - 1)];
}

type Hovered = { day: ContributionDay; wi: number; di: number };

export function ContributionHeatmap({ weeks }: { weeks: ContributionDay[][] }) {
  const [hovered, setHovered] = useState<Hovered | null>(null);

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
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-full flex-col gap-2">
          <div className="relative h-4" style={{ marginLeft: GRID_OFFSET }}>
            {monthMarkers.map((m) => (
              <span
                key={`${m.label}-${m.index}`}
                className="absolute text-xs text-[var(--color-text-secondary)]"
                style={{ left: `${m.index * STEP}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="relative flex" style={{ gap: LABEL_GAP }}>
            <div
              className="sticky left-0 z-10 flex shrink-0 flex-col justify-between rounded-sm text-xs text-[var(--color-text-secondary)]"
              style={{
                width: LABEL_COL_WIDTH,
                height: STEP * 6 + CELL_SIZE,
                background:
                  "linear-gradient(180deg, rgba(20, 27, 51, 0.97), rgba(11, 16, 32, 0.95))",
              }}
            >
              {WEEKDAY_LABELS.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <motion.div
              className="relative flex"
              style={{ gap: CELL_GAP }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={gridVariants}
            >
              {weeks.map((week, wi) => (
                <motion.div
                  key={wi}
                  variants={columnVariants}
                  className="flex flex-col"
                  style={{ gap: CELL_GAP }}
                >
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week.find((d) => d.weekday === di);
                    if (!day) {
                      return (
                        <div key={di} style={{ height: CELL_SIZE, width: CELL_SIZE }} />
                      );
                    }
                    const color = levelColor(day.level);
                    return (
                      <div
                        key={day.date}
                        onMouseEnter={() => setHovered({ day, wi, di })}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer rounded-[3px] border border-white/[0.06] transition-transform duration-150 hover:scale-125"
                        style={{
                          height: CELL_SIZE,
                          width: CELL_SIZE,
                          background: color,
                          boxShadow: day.count > 0 ? `0 0 6px ${color}55` : "none",
                        }}
                      />
                    );
                  })}
                </motion.div>
              ))}

              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.94 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-panel pointer-events-none absolute z-20 whitespace-nowrap rounded-lg border-[var(--color-border-strong)] px-3 py-2 text-xs shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]"
                    style={{
                      left: hovered.wi * STEP + CELL_SIZE / 2,
                      top: hovered.di * STEP - 12,
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {hovered.day.count} Contribution{hovered.day.count === 1 ? "" : "s"}
                    </p>
                    <p className="text-[var(--color-text-secondary)]">
                      {new Date(`${hovered.day.date}T00:00:00Z`).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-1.5 text-sm text-[var(--color-text-secondary)]">
        <span>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <span
            key={i}
            className="h-[13px] w-[13px] rounded-[3px] border border-white/[0.06]"
            style={{ background: color }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
