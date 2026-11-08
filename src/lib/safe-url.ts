const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * Returns the URL if it is safe to put in an href, otherwise null.
 * Allows http(s), mailto, tel, site-relative paths and #anchors. Blocks `javascript:`,
 * `data:` and anything else, because the text may come from a CMS.
 */
export function safeHref(url: string | undefined | null): string | null {
  if (!url) return null;
  const value = url.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (value.startsWith("#")) return value;
  try {
    return ALLOWED_PROTOCOLS.has(new URL(value).protocol) ? value : null;
  } catch {
    return null;
  }
}

export function isExternalUrl(url: string) {
  return /^(https?:)?\/\//.test(url) || url.startsWith("mailto:") || url.startsWith("tel:");
}

/** Only https URLs are used for media (images, video files, downloads). */
export function safeMediaUrl(url: string | undefined | null): string | null {
  const value = safeHref(url);
  return value && (value.startsWith("https://") || value.startsWith("/")) ? value : null;
}
