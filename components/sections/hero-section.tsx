"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

/** Tokens for the professional identity line: accented keywords carry the
 * eyebrow gradient, everything else sits in muted secondary text so the
 * eye lands on AI/ML, Data Science, Python, Machine Learning, SR Builds. */
type IdentityToken =
  | { text: string; accent?: boolean; sep?: false }
  | { sep: true };

const identityLine: IdentityToken[] = [
  { text: "AI/ML", accent: true },
  { text: "Undergraduate" },
  { sep: true },
  { text: "Data Science", accent: true },
  { text: "Enthusiast" },
  { sep: true },
  { text: "Python", accent: true },
  { text: "&" },
  { text: "Machine Learning", accent: true },
  { sep: true },
  { text: "Building Real-World Projects" },
  { sep: true },
  { text: "Educator @" },
  { text: "SR Builds", accent: true },
];

const socialProof = [
  { icon: "📜", text: "20+ Certifications" },
  { icon: "💻", text: "13+ Public Projects" },
  { icon: "🎥", text: "Building in Public @ SR Builds" },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Orchestrates the hero's entrance: badge, identity line, name,
 * description, buttons, then social proof -- each child ~100ms further
 * down the reveal, never all at once. The profile image animates on its
 * own timeline, timed to settle in last. */
const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const glowX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const glowY = useTransform(springY, [-0.5, 0.5], [-18, 18]);

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-20 pb-20 sm:px-6"
    >
      {/* Hero-local ambient accents: extra glow blobs + floating geometry,
          with a very subtle parallax drift toward the cursor. */}
      <motion.div
        aria-hidden="true"
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
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
        <span
          className="animate-float absolute right-[22%] bottom-[30%] h-2 w-2 rounded-full bg-[var(--color-highlight)] shadow-[0_0_14px_4px_var(--glow-orange)]"
          style={{ animationDelay: "-1.5s" }}
        />
        <span
          className="animate-float absolute left-[20%] top-[20%] h-1.5 w-1.5 rounded-full bg-[var(--color-sky)] shadow-[0_0_12px_4px_var(--glow-sky)]"
          style={{ animationDelay: "-3.5s" }}
        />
        <span
          className="animate-float absolute left-[45%] top-[65%] h-1 w-1 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_3px_var(--glow-blue)]"
          style={{ animationDelay: "-5s" }}
        />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-14 md:flex-row md:gap-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainer}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <motion.span
            variants={heroItem}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-[var(--color-accent-hover)]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            </span>
            {siteConfig.title}
          </motion.span>

          <motion.p
            variants={heroItem}
            className="mt-5 flex max-w-xl flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-sm font-semibold uppercase leading-relaxed tracking-[0.14em] sm:text-base md:justify-start"
          >
            {identityLine.map((token, i) =>
              token.sep ? (
                <span
                  key={i}
                  aria-hidden="true"
                  className="mx-0.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-border-strong)]"
                />
              ) : (
                <span
                  key={i}
                  className={
                    token.accent
                      ? "eyebrow-gradient"
                      : "text-[var(--color-text-secondary)]/75"
                  }
                >
                  {token.text}
                </span>
              )
            )}
          </motion.p>

          <motion.h1
            variants={heroItem}
            className="mt-4 text-[clamp(2.75rem,7.5vw,5rem)] font-bold leading-[1.05] tracking-tight"
          >
            <span className="text-gradient">{siteConfig.name}</span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-6 max-w-lg text-[clamp(1.05rem,1.25vw,1.2rem)] leading-[1.7] text-[var(--color-text-secondary)]"
          >
            {siteConfig.tagline}
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            <Button href="#projects" variant="primary">
              View Projects
            </Button>
            <Button href="#github" variant="secondary">
              Explore GitHub
            </Button>
            <Button href={siteConfig.resumeUrl} variant="ghost">
              Download Resume
            </Button>
          </motion.div>

          <motion.div
            variants={heroItem}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            {socialProof.map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] sm:text-sm"
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.75, ease: EASE_OUT }}
          className="relative shrink-0"
        >
          {/* Blurred colored circles behind the image -- glow dialed back
              so the face reads as the anchor, not the halo. */}
          <div
            aria-hidden="true"
            className="animate-pulse-ring absolute -inset-8 rounded-full bg-gradient-to-br from-[var(--color-royal)]/35 via-[var(--color-accent-2)]/28 to-[var(--color-sky)]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-highlight)] opacity-50 blur-md"
          />

          {/* Slow-rotating dashed orbit ring */}
          <div
            aria-hidden="true"
            className="animate-spin-slow absolute -inset-6 rounded-full border border-dashed border-[var(--color-border-strong)]"
          />

          <div className="animate-float relative">
            <div className="relative h-52 w-52 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-sky)] p-[3px] shadow-2xl sm:h-60 sm:w-60 md:h-[17rem] md:w-[17rem]">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--color-background)]">
                <Image
                  src={siteConfig.profileImageUrl}
                  alt={siteConfig.name}
                  fill
                  sizes="(min-width: 768px) 272px, (min-width: 640px) 240px, 208px"
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2.5 pb-8">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8, ease: EASE_OUT }}
          className="text-[var(--color-text-secondary)]"
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-6 items-start justify-center rounded-full border border-[var(--color-border-strong)] p-1.5 shadow-[0_0_14px_var(--glow-blue)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-2)]" />
          </motion.div>
        </motion.div>
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-[var(--color-text-secondary)]"
          animate={{ opacity: [0.25, 0.9, 0.25], y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
    </section>
  );
}
