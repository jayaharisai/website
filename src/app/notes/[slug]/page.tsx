import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/post-body";
import { PostHeader } from "@/components/post-header";
import { ProjectGrid } from "@/components/project-grid";
import { TableOfContents } from "@/components/table-of-contents";
import { PLACEHOLDER_IMAGE } from "@/data/entry";
import { estimateReadTime, tableOfContents } from "@/lib/content";
import { getEntries, getEntry } from "@/lib/notion/entries";
import "@/components/shared/layout.css";

// Detail pages read live Notion content, so they are allowed to wait for it on the server
// instead of being validated as instant navigations (a dev-only check).
export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { entries: notes } = await getEntries("notes");
  // Cache Components needs at least one prerendered param, even before any notes exist.
  return notes.length > 0 ? notes.map(({ slug }) => ({ slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getEntry("notes", slug);
  return note ? { title: note.title, description: note.description || undefined } : {};
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getEntry("notes", slug);
  if (!note) notFound();

  const { entries: notes } = await getEntries("notes");
  const parent = notes.find((candidate) => candidate.slug === note.parentSlug);

  // Pages inside this note, in the order they have in Notion.
  const subPages = (note.childSlugs ?? [])
    .map((childSlug) => notes.find((candidate) => candidate.slug === childSlug))
    .filter((child): child is NonNullable<typeof child> => !!child);

  // Other pages at the same level (siblings), so readers can keep going.
  const siblings = notes
    .filter((candidate) => candidate.parentSlug === note.parentSlug && candidate.slug !== note.slug)
    .slice(0, 3);

  return (
    <main id="main-content" className="page-container page-container--lg">
      <article className="post-article">
        <PostHeader
          title={note.title}
          description={note.descriptionFromBody ? undefined : note.description}
          date={note.date}
          readTime={estimateReadTime(note.content)}
          tags={note.tags}
          // A note without a real picture shows no cover (the placeholder is for cards only).
          image={note.image === PLACEHOLDER_IMAGE ? undefined : note.image}
          backHref={parent ? `/notes/${parent.slug}` : "/notes"}
          backLabel={parent ? parent.title : "All notes"}
        />
        <TableOfContents items={tableOfContents(note.content)} />
        <PostBody content={note.content} />
      </article>

      {subPages.length > 0 && (
        <section className="related-notes" aria-labelledby="sub-pages-title">
          <h2 id="sub-pages-title" className="related-notes__title">
            Pages in this note
          </h2>
          <ProjectGrid projects={subPages} basePath="/notes" headingLevel="h3" />
        </section>
      )}

      {siblings.length > 0 && (
        <section className="related-notes" aria-labelledby="more-notes-title">
          <h2 id="more-notes-title" className="related-notes__title">
            More notes
          </h2>
          <ProjectGrid projects={siblings} basePath="/notes" headingLevel="h3" />
        </section>
      )}
    </main>
  );
}
