import Link from "next/link";
import type { ReactNode } from "react";
import { parseInline, type InlineNode } from "@/lib/inline";
import { isExternalUrl, safeHref } from "@/lib/safe-url";
import "./inline-text.css";

function render(nodes: InlineNode[]): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.t) {
      case "text":
        return node.v;
      case "code":
        return (
          <code key={index} className="inline-text__code">
            {node.v}
          </code>
        );
      case "strong":
        return <strong key={index}>{render(node.children)}</strong>;
      case "em":
        return <em key={index}>{render(node.children)}</em>;
      case "del":
        return <del key={index}>{render(node.children)}</del>;
      case "u":
        return <u key={index}>{render(node.children)}</u>;
      case "link": {
        const href = safeHref(node.href);
        // Unsafe links (e.g. javascript:) are shown as plain text, never as a link.
        if (!href) return <span key={index}>{render(node.children)}</span>;
        return isExternalUrl(href) ? (
          <a
            key={index}
            href={href}
            className="inline-text__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {render(node.children)}
          </a>
        ) : (
          <Link key={index} href={href} className="inline-text__link">
            {render(node.children)}
          </Link>
        );
      }
    }
  });
}

/** Renders note/post text, including links, emphasis and inline code. */
export default function InlineText({ text }: { text: string }) {
  return <>{render(parseInline(text))}</>;
}
