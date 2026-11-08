"use client";

import { useEffect } from "react";

const THRESHOLD = 8;

/** Flags <html data-scrolled="true"> once the page has moved, so CSS can react. */
export default function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      root.dataset.scrolled = String(window.scrollY > THRESHOLD);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      delete root.dataset.scrolled;
    };
  }, []);

  return null;
}
