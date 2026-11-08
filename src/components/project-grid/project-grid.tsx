import type { Project } from "@/data/entry";
import { ProjectCard } from "@/components/project-card";
import "../shared/typography.css";
import "./project-grid.css";

/** Anything that can be shown as a card (projects and notes both fit). */
type CardItem = Pick<Project, "slug" | "title" | "description" | "image">;

type ProjectGridProps = {
  projects: CardItem[];
  /** Where each card links to: `${basePath}/${slug}`. */
  basePath?: string;
  headingLevel?: "h2" | "h3";
  emptyMessage?: string;
};

export default function ProjectGrid({
  projects,
  basePath = "/projects",
  headingLevel,
  emptyMessage = "No projects yet.",
}: ProjectGridProps) {
  if (projects.length === 0) {
    return <p className="description">{emptyMessage}</p>;
  }

  return (
    <ul className="project-grid">
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard
            title={project.title}
            description={project.description}
            image={project.image}
            href={`${basePath}/${project.slug}`}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
