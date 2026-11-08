import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { ImageFigure } from "@/components/image-figure";
import "../shared/typography.css";
import "./post-header.css";

type PostHeaderProps = {
  title: string;
  description?: string;
  date: string;
  readTime: number;
  tags: string[];
  /** Omit to show no cover image. */
  image?: string;
  backHref?: string;
  backLabel?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function PostHeader({
  title,
  description,
  date,
  readTime,
  tags,
  image,
  backHref = "/posts",
  backLabel = "All posts",
}: PostHeaderProps) {
  return (
    <header className="post-header">
      <Link href={backHref} className="post-header__back">
        <ArrowLeft size={14} aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="post-header__titles">
        <ul className="post-header__tags" aria-label="Topics">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <h1 className="heading-1 post-header__title">{title}</h1>
        {description && <p className="post-header__description">{description}</p>}
        <p className="post-header__meta">
          <time dateTime={date}>{formatDate(date)}</time>
          <span className="post-header__dot" aria-hidden="true" />
          <span className="post-header__read">
            <Clock size={13} aria-hidden="true" />
            {readTime} min read
          </span>
        </p>
      </div>

      {image && <ImageFigure src={image} alt={`${title} cover`} ratio="2/1" priority />}
    </header>
  );
}
