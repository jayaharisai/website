import type { Metadata } from "next";
import { NotionNotice } from "@/components/notion-notice";
import { PageHeader } from "@/components/page-header";
import { ProjectGrid } from "@/components/project-grid";
import { getEntries } from "@/lib/notion/entries";
import "@/components/shared/layout.css";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const { entries, status } = await getEntries("projects");
  const projects = entries.filter((entry) => !entry.parentSlug);

  return (
    <main id="main-content" className="page-container page-container--md">
      <PageHeader
        title="Projects"
        description="Things I have built, and the thinking behind them."
      />
      <NotionNotice collection="projects" status={status} />
      <ProjectGrid
        projects={projects}
        headingLevel="h2"
        emptyMessage={
          status === "error"
            ? "Projects couldn't be loaded right now. Please try again in a moment."
            : "No projects yet."
        }
      />
    </main>
  );
}
