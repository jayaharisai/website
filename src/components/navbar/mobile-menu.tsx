"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./logo";
import NavLinks from "./nav-links";

const DESKTOP_QUERY = "(min-width: 768px)";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  // Escape closes the drawer, the page behind it doesn't scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      // Keep Tab / Shift+Tab inside the open drawer.
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  // Growing past the mobile breakpoint closes the drawer.
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="navbar__burger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <div className="mobile-menu__overlay" data-open={open} onClick={close} aria-hidden="true" />

      <aside
        ref={drawerRef}
        id="mobile-menu"
        className="mobile-menu"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <div className="mobile-menu__header">
          <span className="mobile-menu__brand">
            <Logo />
            <span>Jay</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            className="navbar__burger navbar__burger--close"
            onClick={close}
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile">
          <NavLinks listClassName="mobile-menu__links" onNavigate={() => setOpen(false)} />
        </nav>
      </aside>
    </>
  );
}
