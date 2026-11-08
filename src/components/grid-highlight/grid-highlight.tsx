"use client";

import { useEffect, useRef } from "react";
import "./grid-highlight.css";

/** How long a lit cell takes to fade out. */
const FADE_MS = 900;
/** Peak opacity of a lit cell. */
const MAX_ALPHA = 0.28;

/**
 * Lights up the background grid cell under the mouse, leaving a short fading trail.
 * Cell size and colour come from CSS variables (--grid-width, --grid-height, --grid-hover),
 * so it always lines up with <Background /> and follows the day/night theme.
 */
export default function GridHighlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Hover effect only: skip touch screens and people who prefer reduced motion.
    const wantsEffect =
      matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!wantsEffect) return;

    const root = getComputedStyle(document.documentElement);
    const lit = new Map<string, { col: number; row: number; at: number }>();
    let frame = 0;
    let dpr = 1;

    const size = () => ({
      w: parseFloat(root.getPropertyValue("--grid-width")) || 40,
      h: parseFloat(root.getPropertyValue("--grid-height")) || 68,
      line: parseFloat(root.getPropertyValue("--grid-line")) || 1,
    });

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      const { w, h, line } = size();
      ctx.fillStyle = root.getPropertyValue("--grid-hover").trim() || "#6366f1";

      lit.forEach((cell, key) => {
        const age = (now - cell.at) / FADE_MS;
        if (age >= 1) {
          lit.delete(key);
          return;
        }
        ctx.globalAlpha = MAX_ALPHA * (1 - age) ** 2;
        // Leave the grid line itself visible.
        ctx.fillRect(cell.col * w + line, cell.row * h + line, w - line, h - line);
      });

      if (lit.size > 0) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const { w, h } = size();
      const col = Math.floor(event.clientX / w);
      const row = Math.floor(event.clientY / h);
      lit.set(`${col}:${row}`, { col, row, at: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="grid-highlight" aria-hidden="true" />;
}
