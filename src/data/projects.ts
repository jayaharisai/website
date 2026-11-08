export type ProjectFigure = {
  src: string;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Short text shown on the card. */
  description: string;
  image: string;
  summary: string;
  year: string;
  role: string;
  duration: string;
  stack: string[];
  intro: string[];
  design: {
    text: string[];
    figures: ProjectFigure[];
  };
  notes: string[];
  quote: {
    text: string;
    author: string;
  };
};

/** Empty on purpose: projects will be loaded from Notion. */
export const projects: Project[] = [];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, count = 3) {
  return projects.filter((project) => project.slug !== slug).slice(0, count);
}
