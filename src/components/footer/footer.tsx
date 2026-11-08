import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/navbar/logo";
import { navItems } from "@/components/navbar/nav-items";
import { siteName, siteTagline, socialLinks, type SocialLink } from "@/data/site";
import BackToTop from "./back-to-top";
import "./footer.css";

/** The current year. Cached, because reading the clock is not allowed in a prerendered page. */
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

type FooterProps = {
  links?: SocialLink[];
};

export default async function Footer({ links = socialLinks }: FooterProps) {
  const year = await currentYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__main">
          <div className="footer__brand">
            <Link href="/" className="footer__name">
              <Logo />
              {siteName}
            </Link>
            <p className="footer__tagline">{siteTagline}</p>
          </div>

          <nav className="footer__column" aria-label="Footer">
            <h2 className="footer__heading">Explore</h2>
            <ul className="footer__list">
              {navItems.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="footer__link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {links.length > 0 ? (
            <div className="footer__column">
              <h2 className="footer__heading">Connect</h2>
              <ul className="footer__list">
                {links.map(({ label, href }) => {
                  const external = href.startsWith("http");
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        className="footer__link"
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {label}
                        {external ? <ArrowUpRight size={14} aria-hidden="true" /> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} {siteName}. Built with Next.js and Notion.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
