import Image from "next/image";
import { canOptimize } from "@/lib/image-hosts";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import "./post-card.css";

type PostCardProps = {
  title: string;
  description: string;
  date: string;
  readTime?: number;
  image: string;
  href: string;
  /** Match the surrounding outline: h2 under the page title, h3 under a section heading. */
  headingLevel?: "h2" | "h3";
};

export default function PostCard({
  title,
  description,
  date,
  readTime,
  image,
  href,
  headingLevel: Heading = "h2",
}: PostCardProps) {
  return (
    <Link href={href} className="post-card">
      <div className="post-card__surface">
        <div className="post-card__content">
          <Heading className="post-card__title">
            <span>{title}</span>
            <ArrowRight className="post-card__arrow" size={18} aria-hidden="true" />
          </Heading>
          <p className="post-card__description">{description}</p>
          <p className="post-card__meta">
            <span>Posted on {date}</span>
            {readTime !== undefined && (
              <span className="post-card__read-time">
                <Clock size={13} aria-hidden="true" />
                {readTime} min read
              </span>
            )}
          </p>
        </div>
        <div className="post-card__media">
          <Image
            src={image}
            alt=""
            fill
            unoptimized={!canOptimize(image)}
            sizes="170px"
            className="post-card__image"
          />
        </div>
      </div>
    </Link>
  );
}
