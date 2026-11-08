import type { ReactNode } from "react";
import { InlineText } from "@/components/inline-text";
import "./pull-quote.css";

type PullQuoteProps = {
  text: string;
  author?: string;
  /** Extra content shown under the quote (nested Notion blocks). */
  children?: ReactNode;
};

export default function PullQuote({ text, author, children }: PullQuoteProps) {
  return (
    <figure className="pull-quote">
      <blockquote className="pull-quote__text">
        <InlineText text={text} />
      </blockquote>
      {children}
      {author && <figcaption className="pull-quote__author">{author}</figcaption>}
    </figure>
  );
}
