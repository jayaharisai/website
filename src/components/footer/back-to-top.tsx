"use client";

import { ArrowUp } from "lucide-react";

/** Scrolls smoothly to the top (instantly for people who prefer reduced motion). */
export default function BackToTop() {
  return (
    <button
      type="button"
      className="footer__top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      Back to top
      <ArrowUp size={14} aria-hidden="true" />
    </button>
  );
}
