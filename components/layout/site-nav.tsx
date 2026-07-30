"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
];

const initials = siteConfig.name
  .split(" ")
  .map((part) => part[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-nav border-b border-[var(--color-border)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#home"
          onClick={(e) => handleClick(e, "home")}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-sky)] text-xs font-bold text-white shadow-[0_0_18px_var(--glow-purple)] transition-transform group-hover:scale-105">
            {initials}
          </span>
          <span className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            {siteConfig.name}
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-[var(--color-border)] bg-white/[0.02] p-1 md:flex"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              {active === section.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-accent)]/25 via-[var(--color-accent-2)]/25 to-[var(--color-sky)]/25 shadow-[0_0_16px_var(--glow-purple)] ring-1 ring-[var(--color-border-strong)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{section.label}</span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(e) => handleClick(e, "contact")}
          className="btn-shine hidden rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-5 py-2 text-sm font-medium text-white shadow-[0_0_20px_var(--glow-blue)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--glow-purple)] sm:inline-flex"
        >
          Let&apos;s Talk
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-primary)] md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all ${menuOpen ? "top-2 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all ${menuOpen ? "top-2 -rotate-45" : "top-4"}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="glass-nav overflow-hidden border-b border-[var(--color-border)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active === section.id
                      ? "bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent-2)]/20 text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
