"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.37.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.13 2.14C4.49 20.5 12 20.5 12 20.5s7.51 0 9.37-.56a3.02 3.02 0 0 0 2.13-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z" />
    </svg>
  );
}

/**
 * The only place in the portfolio that uses YouTube's brand red -- confined
 * to this single button so the section reads as YouTube-adjacent without
 * tinting the page. The rest of the section stays on the site's own
 * purple/orange/pink/blue wash.
 */
export function SubscribeCTA({ channelUrl }: { channelUrl: string }) {
  return (
    <Reveal>
      <div className="glass-panel relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -top-20 h-40 rounded-full bg-gradient-to-r from-[var(--color-accent-2)]/25 via-[var(--color-highlight)]/20 to-transparent blur-3xl"
        />
        <h3 className="relative text-[clamp(1.5rem,2.8vw,2rem)] font-bold tracking-tight text-[var(--color-text-primary)]">
          Enjoy my content?
        </h3>
        <p className="relative mx-auto mt-3 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">
          Follow my journey as I build AI systems, share projects, and teach everything I learn.
        </p>
        <motion.a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FF0000] px-6 text-base font-medium text-white shadow-[0_0_20px_rgba(255,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(255,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
        >
          <YouTubeIcon className="h-5 w-5" />
          Subscribe on YouTube
        </motion.a>
      </div>
    </Reveal>
  );
}
