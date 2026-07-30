"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

const proofPoints = [
  "3rd-year AI/ML engineering student",
  "Ships and documents projects end-to-end",
  "Builds in public on SR Builds (YouTube)",
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-28 pb-16 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 md:flex-row md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-[var(--color-accent-hover)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            {siteConfig.title}
          </span>

          <h1 className="mt-6 text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.05] tracking-tight">
            <span className="text-gradient">{siteConfig.name}</span>
          </h1>

          <p className="mt-6 max-w-xl text-[clamp(1.05rem,1.3vw,1.25rem)] leading-relaxed text-[var(--color-text-secondary)]">
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
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                />
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative shrink-0"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-full bg-gradient-to-br from-[var(--color-accent)]/40 via-[var(--color-accent-2)]/30 to-transparent blur-2xl"
          />
          <div className="relative h-48 w-48 rounded-full ring-1 ring-[var(--color-border-strong)] shadow-2xl sm:h-56 sm:w-56 md:h-64 md:w-64">
            <Image
              src={siteConfig.profileImageUrl}
              alt={siteConfig.name}
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-secondary)]"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-6 items-start justify-center rounded-full border border-[var(--color-border-strong)] p-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
