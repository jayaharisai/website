import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { InlineText } from "@/components/inline-text";
import "./toggle-block.css";

type ToggleBlockProps = {
  title: string;
  children: ReactNode;
};

/**
 * A collapsible section. Native <details>, so it works with the keyboard and without JS.
 * Starts open so the content is visible straight away; readers can still collapse it.
 */
export default function ToggleBlock({ title, children }: ToggleBlockProps) {
  return (
    <details className="toggle-block" open>
      <summary className="toggle-block__summary">
        <ChevronRight className="toggle-block__chevron" size={16} aria-hidden="true" />
        <span>
          <InlineText text={title} />
        </span>
      </summary>
      <div className="toggle-block__content">{children}</div>
    </details>
  );
}
