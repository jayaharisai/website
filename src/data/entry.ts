import type { Block } from "@/lib/content";

/** Shown on cards when a page has no cover image. */
export const PLACEHOLDER_IMAGE = "/placeholder.svg";

/**
 * One page of content: a project, a post or a note. All three come from Notion and share
 * this shape; project-only fields are simply left empty for posts and notes.
 */
export type Entry = {
  /** Notion page ID. */
  id?: string;
  slug: string;
  title: string;
  /** Card text. Taken from the Summary column, or the page's first paragraph. */
  description: string;
  /** True when `description` is the first paragraph (so it should not be shown twice). */
  descriptionFromBody?: boolean;
  image: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  tags: string[];
  /** Slug of the page this one sits inside (nested pages). */
  parentSlug?: string;
  /** Slugs of the pages inside this one, in Notion order. */
  childSlugs?: string[];
  content: Block[];
  /** Estimated minutes to read (from the page's top-level text). */
  readTime?: number;

  // Project details (optional columns).
  year?: string;
  role?: string;
  duration?: string;
  stack?: string[];
};

export type Project = Entry;
export type Post = Entry;
export type Note = Entry;
