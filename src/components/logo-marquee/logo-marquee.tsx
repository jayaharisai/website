import type { CSSProperties } from "react";
import "./logo-marquee.css";

export type MarqueeItem = {
  name: string;
  /** Optional logo image. Falls back to a text wordmark. */
  logo?: string;
};

type LogoMarqueeProps = {
  items: MarqueeItem[];
  label?: string;
  /** Seconds for one full loop. Higher is slower. */
  duration?: number;
};

function Row({ items, hidden = false }: { items: MarqueeItem[]; hidden?: boolean }) {
  return (
    <ul className="logo-marquee__row" aria-hidden={hidden || undefined}>
      {items.map(({ name, logo }) => (
        <li key={name} className="logo-marquee__item">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={hidden ? "" : name} className="logo-marquee__logo" />
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
}: LogoMarqueeProps) {
  if (items.length === 0) return null;

  return (
    <section
      className="logo-marquee"
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
