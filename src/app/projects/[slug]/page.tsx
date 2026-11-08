import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/post-body";
import { ProjectHero } from "@/components/project-hero";
import { RelatedProjects } from "@/components/related-projects";
import { PLACEHOLDER_IMAGE } from "@/data/entry";
import { getEntries, getEntry } from "@/lib/notion/entries";
import "@/components/shared/layout.css";

// Detail pages read live Notion content, so they are allowed to wait for it on the server
// instead of being validated as instant navigations (a dev-only check).
export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { entries } = await getEntries("projects");
  // Cache Components needs at least one prerendered param, even while there is no content.
  // The placeholder is not a real page: it renders a 404, like any unknown address.
  return entries.length > 0 ? entries.map(({ slug }) => ({ slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getEntry("projects", slug);
  return project ? { title: project.title, description: project.description || undefined } : {};
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getEntry("projects", slug);
  if (!project) notFound();

  const { entries } = await getEntries("projects");
  const related = entries
    .filter((entry) => entry.parentSlug === project.parentSlug && entry.slug !== project.slug)
    .slice(0, 3);

  return (
    <main id="main-content" className="page-container page-container--lg">
      <article className="post-article">
        <ProjectHero
          title={project.title}
          summary={project.descriptionFromBody ? undefined : project.description}
          image={project.image === PLACEHOLDER_IMAGE ? undefined : project.image}
          year={project.year}
          role={project.role}
          duration={project.duration}
          stack={project.stack}
        />
        <PostBody content={project.content} />
      </article>

      <RelatedProjects projects={related} />
    </main>
  );
}
