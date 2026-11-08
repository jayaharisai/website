import { LinkCard } from "@/components/link-card";
import { safeMediaUrl } from "@/lib/safe-url";
import "./video-embed.css";

type VideoEmbedProps = {
  url: string;
  caption?: string;
};

/** Pulls a YouTube / Vimeo ID out of a URL. Only the ID is used, never the raw URL. */
function parseEmbed(url: string): { provider: "youtube" | "vimeo"; id: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return /^[\w-]{6,20}$/.test(id) ? { provider: "youtube", id } : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id =
      parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)?.[1];
    return id && /^[\w-]{6,20}$/.test(id) ? { provider: "youtube", id } : null;
  }
  if (host === "vimeo.com") {
    const id = parsed.pathname.match(/^\/(\d+)/)?.[1];
    return id ? { provider: "vimeo", id } : null;
  }
  return null;
}

const VIDEO_FILE = /\.(mp4|webm|ogg|mov)(\?|$)/i;

export default function VideoEmbed({ url, caption }: VideoEmbedProps) {
  const embed = parseEmbed(url);
  const media = safeMediaUrl(url);

  let player: React.ReactNode = null;
  if (embed) {
    const src =
      embed.provider === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${embed.id}`
        : `https://player.vimeo.com/video/${embed.id}`;
    player = (
      <iframe
        src={src}
        title={caption || "Embedded video"}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        className="video-embed__frame"
      />
    );
  } else if (media && VIDEO_FILE.test(media)) {
    player = <video src={media} controls preload="metadata" className="video-embed__frame" />;
  }

  // Anything we can't embed safely becomes a normal link.
  if (!player) return <LinkCard url={url} title={caption} />;

  return (
    <figure className="video-embed">
      <div className="video-embed__ratio">{player}</div>
      {caption && <figcaption className="video-embed__caption">{caption}</figcaption>}
    </figure>
  );
}
