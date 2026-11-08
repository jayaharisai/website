import type { Metadata } from "next";
import { NotionNotice } from "@/components/notion-notice";
import { PageHeader } from "@/components/page-header";
import { ProjectGrid } from "@/components/project-grid";
import { getEntries } from "@/lib/notion/entries";
import "@/components/shared/layout.css";

export const metadata: Metadata = {
  title: "Notes",
};

export default async function NotesPage() {
  const { entries: allNotes, status } = await getEntries("notes");
  // Pages inside other notes are reached from their parent, not listed here.
  const notes = allNotes.filter((note) => !note.parentSlug);

  return (
    <main id="main-content" className="page-container page-container--md">
      <PageHeader
        title="Notes"
        description="Short notes, learnings and ideas, written in Notion and published here automatically."
      />

      <NotionNotice collection="notes" status={status} />

      <ProjectGrid
        projects={notes}
        basePath="/notes"
        headingLevel="h2"
        emptyMessage={
          status === "error"
            ? "Notes couldn't be loaded right now. Please try again in a moment."
            : "No notes yet."
        }
      />
    </main>
  );
}
