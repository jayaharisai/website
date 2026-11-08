import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "./project-card.css";

type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
  /** Match the surrounding outline: h2 under the page title, h3 under a section heading. */
  headingLevel?: "h2" | "h3";
};

export default function ProjectCard({
  title,
  description,
  image,
  href,
  headingLevel: Heading = "h3",
}: ProjectCardProps) {
  return (
    <Link href={href} className="project-card">
      <div className="project-card__surface">
        <div className="project-card__media">
          <Image
            src={image}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 559px) 100vw, 320px"
            className="project-card__image"
          />
        </div>
        <div className="project-card__body">
          <Heading className="project-card__title">
            <span>{title}</span>
            <ArrowUpRight className="project-card__arrow" size={14} aria-hidden="true" />
          </Heading>
          <p className="project-card__description">{description}</p>
        </div>
      </div>
    </Link>
  );
}
