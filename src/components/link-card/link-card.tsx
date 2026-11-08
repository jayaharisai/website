import Link from "next/link";
import { ArrowUpRight, FileText, Link2 } from "lucide-react";
import { isExternalUrl, safeHref } from "@/lib/safe-url";
import "./link-card.css";

type LinkCardProps = {
  url: string;
  title?: string;
  kind?: "link" | "file";
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** A bookmark or file download shown as a simple card. */
export default function LinkCard({ url, title, kind = "link" }: LinkCardProps) {
  const href = safeHref(url);
  const label = title || (isExternalUrl(url) ? hostOf(url) : url);

  const body = (
    <>
      <span className="link-card__icon" aria-hidden="true">
        {kind === "file" ? <FileText size={18} /> : <Link2 size={18} />}
      </span>
      <span className="link-card__text">
        <span className="link-card__title">{label}</span>
        <span className="link-card__url">{kind === "file" ? "Download file" : hostOf(url)}</span>
      </span>
      <ArrowUpRight className="link-card__arrow" size={16} aria-hidden="true" />
    </>
  );

  if (!href) {
    return <div className="link-card link-card--disabled">{body}</div>;
  }

  return isExternalUrl(href) ? (
    <a href={href} className="link-card" target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <Link href={href} className="link-card">
      {body}
    </Link>
  );
}
