import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import "./callout.css";

type CalloutProps = {
  title?: string;
  /** An emoji. Falls back to a lightbulb icon. */
  icon?: string;
  children: ReactNode;
};

export default function Callout({ title, icon, children }: CalloutProps) {
  return (
    <aside className="callout">
      {icon ? (
        <span className="callout__emoji" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <Lightbulb className="callout__icon" size={18} aria-hidden="true" />
      )}
      <div className="callout__content">
        {title && <p className="callout__title">{title}</p>}
        <div className="callout__text">{children}</div>
      </div>
    </aside>
  );
}
