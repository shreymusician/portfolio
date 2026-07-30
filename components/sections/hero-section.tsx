"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

const identityLine =
  "AIML Undergraduate | Data Science Enthusiast | Python & Machine Learning | Building Real-World Projects | Educator @ SR Builds ⭐";

const proofPoints = [
  "3rd-year AI/ML engineering student",
  "Ships and documents projects end-to-end",
  "Builds in public on SR Builds (YouTube)",
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-32 pb-20 sm:px-6"
    >
      {/* Hero-local ambient accents: extra glow blobs + floating geometry */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -left-24 top-24 h-72 w-72 rounded-full bg-[var(--color-royal)]/25 blur-[100px]" />
        <div
          className="animate-float absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-[var(--color-accent-2)]/25 blur-[110px]"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="animate-float absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[var(--color-sky)]/20 blur-[100px]"
          style={{ animationDelay: "-4s" }}
        />
        <div className="animate-spin-slow absolute right-[12%] top-[18%] h-10 w-10 rounded-lg border border-[var(--color-border-strong)]" />
        <div
          className="animate-spin-slow absolute left-[8%] bottom-[22%] h-14 w-14 rounded-full border border-[var(--color-border-strong)]"
          style={{ animationDirection: "reverse" }}
        />
        <span className="absolute right-[22%] bottom-[30%] h-2 w-2 rounded-full bg-[var(--color-highlight)] shadow-[0_0_14px_4px_var(--glow-orange)]" />
        <span className="absolute left-[20%] top-[20%] h-1.5 w-1.5 rounded-full bg-[var(--color-sky)] shadow-[0_0_12px_4px_var(--glow-sky)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-14 md:flex-row md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-[var(--color-accent-hover)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            </span>
            {siteConfig.title}
          </span>

          <p className="eyebrow-gradient mt-5 max-w-xl text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm">
            {identityLine}
          </p>

          <h1 className="mt-4 text-[clamp(2.75rem,7.5vw,5rem)] font-bold leading-[1.05] tracking-tight">
            <span className="text-gradient">{siteConfig.name}</span>
          </h1>

          <p className="mt-6 max-w-lg text-[clamp(1.05rem,1.25vw,1.2rem)] leading-[1.7] text-[var(--color-text-secondary)]">
            {siteConfig.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Button href="#projects" variant="primary">
              View Projects
            </Button>
            <Button href="#github" variant="secondary">
              Explore GitHub
            </Button>
            <Button href={siteConfig.resumeUrl} variant="secondary">
              Download Resume
            </Button>
          </div>

          <ul className="mt-12 flex flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
            {proofPoints.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
                />
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative shrink-0"
        >
          {/* Blurred colored circles behind the image */}
          <div
            aria-hidden="true"
            className="animate-pulse-ring absolute -inset-10 rounded-full bg-gradient-to-br from-[var(--color-royal)]/50 via-[var(--color-accent-2)]/40 to-[var(--color-sky)]/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-highlight)] opacity-70 blur-md"
          />

          {/* Slow-rotating dashed orbit ring */}
          <div
            aria-hidden="true"
            className="animate-spin-slow absolute -inset-6 rounded-full border border-dashed border-[var(--color-border-strong)]"
          />

          <div className="animate-float relative">
            <div className="relative h-48 w-48 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-sky)] p-[3px] shadow-2xl sm:h-56 sm:w-56 md:h-64 md:w-64">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--color-background)]">
                <Image
                  src={siteConfig.profileImageUrl}
                  alt={siteConfig.name}
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-[var(--color-text-secondary)]"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-6 items-start justify-center rounded-full border border-[var(--color-border-strong)] p-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-2)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
