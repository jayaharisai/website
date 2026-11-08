/**
 * Hosts whose images Next.js may resize, convert (AVIF/WebP) and cache on the CDN.
 * Notion serves uploaded files from its own S3 bucket; covers can also come from Unsplash.
 * Images from any other host are still shown, just as they are (see `canOptimize`).
 */
export const IMAGE_HOSTS = [
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "s3.us-west-2.amazonaws.com",
  "images.unsplash.com",
  "images.pexels.com",
] as const;

/** True for images the optimizer is allowed to handle: files on this site or an allowed host. */
export function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return (IMAGE_HOSTS as readonly string[]).includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
