import type { CSSProperties } from "react";
import "./logo-marquee.css";

export type MarqueeItem = {
  name: string;
  /** Optional logo image. Falls back to a text wordmark. */
  logo?: string;
  /** Optional inline icon (an SVG path on a 24x24 canvas), shown beside the name. */
  iconPath?: string;
};

type LogoMarqueeProps = {
  items: MarqueeItem[];
  label?: string;
  /** Seconds for one full loop. Higher is slower. */
  duration?: number;
  /** Slide to the right instead of the left. */
  reverse?: boolean;
};

function Row({ items, hidden = false }: { items: MarqueeItem[]; hidden?: boolean }) {
  return (
    <ul className="logo-marquee__row" aria-hidden={hidden || undefined}>
      {items.map(({ name, logo, iconPath }) => (
        <li key={name} className="logo-marquee__item">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={hidden ? "" : name} className="logo-marquee__logo" />
          ) : iconPath ? (
            <span className="logo-marquee__tool">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d={iconPath} />
              </svg>
              <span>{name}</span>
            </span>
          ) : (
            <span className="logo-marquee__wordmark">{name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function LogoMarquee({
  items,
  label = "Tools and technologies I work with",
  duration = 32,
  reverse = false,
}: LogoMarqueeProps) {
  if (items.length === 0) return null;

  return (
    <section
      className="logo-marquee"
      data-reverse={reverse || undefined}
      aria-label={label}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="logo-marquee__track">
        <Row items={items} />
        <Row items={items} hidden />
      </div>
    </section>
  );
}
