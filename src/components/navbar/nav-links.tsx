"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { navItems } from "./nav-items";

type NavLinksProps = {
  listClassName: string;
  onNavigate?: () => void;
};

export default function NavLinks({ listClassName, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={listClassName}>
      {navItems.map(({ label, href }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
        return (
          <li key={href}>
            <Link
              href={href}
              className="navbar__link"
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <span>{label}</span>
              <ArrowRight className="navbar__link-icon" size={16} aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
