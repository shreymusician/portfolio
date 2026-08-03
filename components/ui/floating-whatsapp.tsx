"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const WHATSAPP_MESSAGE = "Hi Shreyas! I came across your portfolio and would like to connect.";

const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

/**
 * Persistent floating contact affordance, styled to match the site's own
 * glass/glow language rather than a generic third-party widget. Idle float +
 * hover/tap motion all live on the same button so the tooltip can key off
 * one shared hover state.
 */
export function FloatingWhatsApp() {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    setHovered(true);
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 500);
  };

  const handleLeave = () => {
    setHovered(false);
    setShowTooltip(false);
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current);
      tooltipTimer.current = null;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7 lg:bottom-8 lg:right-8">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            role="tooltip"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
              Chat with me on WhatsApp
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] blur-xl"
        animate={{ opacity: hovered ? 0.65 : 0.4, scale: hovered ? 1.25 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with me on WhatsApp"
        onHoverStart={handleEnter}
        onHoverEnd={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(0,0,0,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:h-[60px] sm:w-[60px] lg:h-16 lg:w-16"
        animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
        whileHover={{
          scale: 1.08,
          y: shouldReduceMotion ? 0 : -6,
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        }}
        whileTap={{ scale: 0.94 }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 400, damping: 20 },
        }}
      >
        <WhatsAppIcon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
      </motion.a>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.501c0 2.393.665 4.7 1.925 6.716L3 29l6.955-2.376a12.45 12.45 0 0 0 6.046 1.541h.005c6.904 0 12.5-5.596 12.5-12.501C28.506 8.596 22.905 3 16.001 3Zm0 22.877h-.004a10.36 10.36 0 0 1-5.283-1.448l-.379-.226-3.928 1.342 1.362-3.83-.246-.393a10.37 10.37 0 0 1-1.598-5.52c0-5.734 4.669-10.402 10.408-10.402 2.78 0 5.393 1.084 7.359 3.052a10.335 10.335 0 0 1 3.045 7.36c0 5.734-4.669 10.401-10.402 10.401m5.708-7.793c-.312-.156-1.85-.913-2.137-1.017-.287-.104-.496-.156-.704.156-.208.313-.808 1.017-.99 1.226-.183.208-.365.234-.677.078-.312-.156-1.317-.485-2.51-1.548-.928-.827-1.554-1.85-1.736-2.163-.183-.312-.02-.481.137-.636.14-.14.312-.365.469-.547.156-.183.208-.313.312-.521.104-.208.052-.391-.026-.547-.078-.156-.704-1.696-.965-2.322-.254-.61-.512-.527-.704-.537l-.6-.01c-.208 0-.547.078-.834.39-.286.313-1.09 1.066-1.09 2.6 0 1.534 1.117 3.017 1.273 3.225.156.208 2.199 3.36 5.33 4.71.745.322 1.326.514 1.779.658.747.238 1.427.204 1.965.124.6-.09 1.85-.756 2.111-1.487.26-.73.26-1.356.182-1.487-.078-.13-.286-.208-.599-.365Z" />
    </svg>
  );
}
