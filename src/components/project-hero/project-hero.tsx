import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageFigure } from "@/components/image-figure";
import "../shared/typography.css";
import "./project-hero.css";

type ProjectHeroProps = {
  title: string;
  summary?: string;
  /** Omit to show no cover image. */
  image?: string;
  year?: string;
  role?: string;
  duration?: string;
  stack?: string[];
};

/** Title, summary, quick facts and cover for a project. Every part except the title is optional. */
export default function ProjectHero({
  title,
  summary,
  image,
  year,
  role,
  duration,
  stack = [],
}: ProjectHeroProps) {
  const facts = [
    { label: "Year", value: year },
    { label: "Role", value: role },
    { label: "Duration", value: duration },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <header className="project-hero">
      <Link href="/projects" className="project-hero__back">
        <ArrowLeft size={14} aria-hidden="true" />
        All projects
      </Link>

      <div className="project-hero__heading">
        <h1 className="heading-1">{title}</h1>
        {summary && <p className="project-hero__summary">{summary}</p>}
      </div>

      {facts.length > 0 && (
        <dl className="project-hero__facts">
          {facts.map(({ label, value }) => (
            <div key={label} className="project-hero__fact">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {stack.length > 0 && (
        <ul className="project-hero__stack" aria-label="Technologies">
          {stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {image && <ImageFigure src={image} alt={`${title} cover`} ratio="2/1" priority />}
    </header>
  );
}
