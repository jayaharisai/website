import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./post-nav.css";

type NavTarget = {
  title: string;
  href: string;
};

type PostNavProps = {
  previous?: NavTarget;
  next?: NavTarget;
};

export default function PostNav({ previous, next }: PostNavProps) {
  if (!previous && !next) return null;

  return (
    <nav className="post-nav" aria-label="More posts">
      {previous ? (
        <Link href={previous.href} className="post-nav__link">
          <span className="post-nav__label">
            <ArrowLeft size={14} aria-hidden="true" /> Newer
          </span>
          <span className="post-nav__title">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="post-nav__link post-nav__link--next">
          <span className="post-nav__label">
            Older <ArrowRight size={14} aria-hidden="true" />
          </span>
          <span className="post-nav__title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
