import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";
import "./button-motion.css";

type ButtonOnlyProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  href?: undefined;
};

type LinkOnlyProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
  href: string;
};

/** What a Primary/Secondary button accepts: a <button>, or a link when `href` is set. */
export type ArrowButtonOwnProps = (ButtonOnlyProps | LinkOnlyProps) & {
  className?: string;
};

type ArrowButtonProps = ArrowButtonOwnProps & {
  /** Variant class that owns the colours, e.g. "primary-button". */
  variant: string;
};

const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");

/**
 * Shared markup for the Primary and Secondary buttons: label + arrow, 40px high.
 */
export default function ArrowButton({
  variant,
  className = "",
  children,
  ...props
}: ArrowButtonProps) {
  const classes = `btn-motion ${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight className={`btn-motion__icon ${variant}__icon`} size={14} aria-hidden="true" />
    </>
  );

  if (typeof props.href === "string") {
    const { href, ...anchorProps } = props;
    return isExternal(href) ? (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorProps}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  // `href` is undefined on this branch; drop it so it isn't passed to <button>.
  const { type = "button", ...buttonProps } = props as Omit<ButtonOnlyProps, "href">;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
