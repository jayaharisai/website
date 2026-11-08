import { ProjectGrid } from "@/components/project-grid";
import type { Project } from "@/data/entry";
import "./related-projects.css";

type RelatedProjectsProps = {
  projects: Project[];
  title?: string;
};

export default function RelatedProjects({
  projects,
  title = "Related projects",
}: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="related-projects" aria-labelledby="related-projects-title">
      <h2 id="related-projects-title" className="related-projects__title">
        {title}
      </h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}
