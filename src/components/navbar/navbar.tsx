import Link from "next/link";
import Logo from "./logo";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";
import ScrollState from "./scroll-state";
import ThemeToggle from "./theme-toggle";
import "./navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <ScrollState />
      <div className="navbar__inner">
        <div className="navbar__left">
          <MobileMenu />
          <Link href="/" className="navbar__brand">
            <Logo />
            <span>Jay</span>
          </Link>
        </div>

        <div className="navbar__right">
          <nav className="navbar__desktop-nav" aria-label="Main">
            <NavLinks listClassName="navbar__links" />
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
