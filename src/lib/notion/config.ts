/**
 * Names of the Notion database columns we read. Rename them here if your databases use
 * different column names. The title column is detected automatically. All are optional.
 */
export const NOTION_PROPERTIES = {
  summary: "Summary",
  date: "Date",
  tags: "Tags",
  slug: "Slug",
  published: "Published",
  image: "Image",
  // Used by projects:
  year: "Year",
  role: "Role",
  duration: "Duration",
  stack: "Stack",
} as const;

export type NotionCollection = "notes" | "posts" | "projects";

export type NotionConfig = {
  token: string;
  databaseId: string;
};

/** Environment variable(s) holding each collection's database ID (first one wins). */
const DATABASE_ENV: Record<NotionCollection, string[]> = {
  notes: ["NOTION_NOTES_DATABASE_ID", "NOTION_DATABASE_ID"],
  posts: ["NOTION_POSTS_DATABASE_ID"],
  projects: ["NOTION_PROJECTS_DATABASE_ID"],
};

/** The variable to mention when a collection isn't connected yet. */
export const DATABASE_ENV_NAME: Record<NotionCollection, string> = {
  notes: "NOTION_NOTES_DATABASE_ID",
  posts: "NOTION_POSTS_DATABASE_ID",
  projects: "NOTION_PROJECTS_DATABASE_ID",
};

/** Reads credentials from the server environment. Returns null when not configured. */
export function getNotionConfig(collection: NotionCollection): NotionConfig | null {
  const token = process.env.NOTION_API_KEY?.trim();
  const databaseId = DATABASE_ENV[collection]
    .map((name) => process.env[name]?.trim())
    .find((value) => value);
  return token && databaseId ? { token, databaseId } : null;
}
