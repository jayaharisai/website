import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  Client,
  collectPaginatedAPI,
  isFullBlock,
  isFullPage,
  type BlockObjectResponse,
  type PageObjectResponse,
} from "@notionhq/client";
import { PLACEHOLDER_IMAGE, type Entry } from "@/data/entry";
import { sampleNotes } from "@/data/notes";
import { estimateReadTime } from "@/lib/content";
import { slugify } from "@/lib/slugify";
import {
  notionBlocksToContent,
  richTextToString,
  type KnownPages,
  type NotionNode,
} from "./blocks";
import {
  getNotionConfig,
  NOTION_PROPERTIES,
  type NotionCollection,
  type NotionConfig,
} from "./config";

/** Cache tag for all Notion data. `/api/revalidate` clears it on demand. */
export const NOTION_CACHE_TAG = "notion";

// How fresh Notion data is:
//  - while running `pnpm dev`: re-read every 2 seconds, so edits show up almost instantly;
//  - on the live site: re-read at most once a minute (plus the on-demand refresh link).
// `expire` stays under 1 hour because Notion's signed file/image URLs expire after 1 hour, and
// above 5 minutes so the data still counts as cacheable when pages are prerendered.
const LIVE_CACHE =
  process.env.NODE_ENV === "development"
    ? ({ stale: 30, revalidate: 2, expire: 600 } as const)
    : ({ stale: 30, revalidate: 60, expire: 3000 } as const);

// Failures retry after a minute. This must stay long enough to be prerenderable, otherwise a
// Notion outage during `next build` would break the whole build.
const ERROR_CACHE = { stale: 30, revalidate: 60, expire: 600 } as const;

/** How many levels of pages-inside-pages are followed. */
const MAX_DEPTH = 4;

export type EntriesResult = {
  /** Every entry, including nested ones. Top-level entries have no `parentSlug`. */
  entries: Entry[];
  /**
   * "live": loaded from Notion. "sample": Notion isn't connected and built-in samples are shown.
   * "unconfigured": Notion isn't connected and there is nothing to show. "error": Notion failed.
   */
  status: "live" | "sample" | "unconfigured" | "error";
};

type Properties = PageObjectResponse["properties"];

function createClient({ token }: NotionConfig) {
  return new Client({ auth: token, timeoutMs: 10_000 });
}

/** The database's first data source (Notion's name for a table inside a database). */
async function resolveDataSourceId(client: Client, databaseId: string) {
  const database = await client.databases.retrieve({ database_id: databaseId });
  if ("data_sources" in database && database.data_sources.length > 0) {
    return database.data_sources[0].id;
  }
  throw new Error("The Notion database has no data source.");
}

/** Runs `task` over `items` a few at a time, to stay inside Notion's rate limit. */
async function mapInBatches<T, R>(items: T[], size: number, task: (item: T) => Promise<R>) {
  const results: R[] = [];
  for (let index = 0; index < items.length; index += size) {
    results.push(...(await Promise.all(items.slice(index, index + size).map(task))));
  }
  return results;
}

function readText(properties: Properties, name: string) {
  const property = properties[name];
  if (!property) return "";
  if (property.type === "rich_text") return richTextToString(property.rich_text);
  if (property.type === "title") return richTextToString(property.title);
  return "";
}

/** A short label from a text, number, select, status or date column (e.g. Year, Role). */
function readLabel(properties: Properties, name: string) {
  const property = properties[name];
  if (!property) return undefined;
  switch (property.type) {
    case "rich_text":
      return property.rich_text.map((item) => item.plain_text).join("") || undefined;
    case "number":
      return property.number === null ? undefined : String(property.number);
    case "select":
      return property.select?.name;
    case "status":
      return property.status?.name;
    case "date":
      return property.date?.start;
    default:
      return undefined;
  }
}

function readMultiSelect(properties: Properties, name: string) {
  const property = properties[name];
  return property?.type === "multi_select" ? property.multi_select.map((tag) => tag.name) : [];
}

function readTitle(properties: Properties) {
  const title = Object.values(properties).find((property) => property.type === "title");
  return title?.type === "title" ? title.title.map((item) => item.plain_text).join("") : "";
}

function readImage(page: PageObjectResponse) {
  const files = page.properties[NOTION_PROPERTIES.image];
  if (files?.type === "files" && files.files.length > 0) {
    const file = files.files[0];
    return file.type === "external" ? file.external.url : file.file.url;
  }
  if (page.cover) {
    return page.cover.type === "external" ? page.cover.external.url : page.cover.file.url;
  }
  return PLACEHOLDER_IMAGE;
}

function pageToEntry(page: PageObjectResponse): Entry | null {
  const { properties } = page;

  const published = properties[NOTION_PROPERTIES.published];
  if (published?.type === "checkbox" && !published.checkbox) return null;

  const title = readTitle(properties).trim() || "Untitled";
  const customSlug = slugify(readText(properties, NOTION_PROPERTIES.slug));
  // The page ID suffix keeps slugs unique even when two pages share a title.
  const slug = customSlug || `${slugify(title) || "page"}-${page.id.replace(/-/g, "").slice(0, 6)}`;

  const dateProperty = properties[NOTION_PROPERTIES.date];
  const date = (dateProperty?.type === "date" && dateProperty.date?.start) || page.created_time;

  return {
    id: page.id,
    slug,
    title,
    description: readText(properties, NOTION_PROPERTIES.summary),
    image: readImage(page),
    date: date.slice(0, 10),
    tags: readMultiSelect(properties, NOTION_PROPERTIES.tags),
    content: [],
    year: readLabel(properties, NOTION_PROPERTIES.year),
    role: readLabel(properties, NOTION_PROPERTIES.role),
    duration: readLabel(properties, NOTION_PROPERTIES.duration),
    stack: readMultiSelect(properties, NOTION_PROPERTIES.stack),
  };
}

/** Same file? Notion's signed image URLs differ only in their query string. */
function sameFile(a: string, b: string) {
  return a.split("?")[0] === b.split("?")[0];
}

/** First image block, used as the card image when a page has no cover. */
function firstImageUrl(blocks: BlockObjectResponse[]) {
  for (const block of blocks) {
    if (block.type !== "image") continue;
    return block.image.type === "external" ? block.image.external.url : block.image.file.url;
  }
  return null;
}

/** First non-empty paragraph of a page, trimmed to a card-sized summary. */
function firstParagraph(blocks: BlockObjectResponse[]) {
  for (const block of blocks) {
    if (block.type !== "paragraph") continue;
    const text = block.paragraph.rich_text
      .map((item) => item.plain_text)
      .join("")
      .trim();
    if (text) return text.length > 160 ? `${text.slice(0, 157)}…` : text;
  }
  return "";
}

/**
 * Loads a page as an entry, then every page inside it (and so on), returning them flat.
 * The first item is the page itself; its direct children are listed in `childSlugs`.
 */
async function expandPage(
  client: Client,
  page: PageObjectResponse,
  parentSlug: string | undefined,
  depth: number,
): Promise<Entry[]> {
  const entry = pageToEntry(page);
  if (!entry) return [];

  const blocks = (
    await collectPaginatedAPI(client.blocks.children.list, { block_id: page.id })
  ).filter(isFullBlock);

  // A blank row (no title and nothing written) isn't content; skip it instead of "Untitled".
  if (!readTitle(page.properties).trim() && blocks.length === 0) return [];

  // Cards need a summary and an image even when the database has no such columns.
  if (!entry.description) {
    const description = firstParagraph(blocks);
    if (description) {
      entry.description = description;
      entry.descriptionFromBody = true;
    }
  }
  if (entry.image === PLACEHOLDER_IMAGE) {
    entry.image = firstImageUrl(blocks) ?? entry.image;
  }
  entry.readTime = estimateReadTime(notionBlocksToContent(blocks));
  entry.parentSlug = parentSlug;

  const childPages = depth < MAX_DEPTH ? blocks.filter((block) => block.type === "child_page") : [];
  const groups = await mapInBatches(childPages, 2, async (child) => {
    const childPage = await client.pages.retrieve({ page_id: child.id });
    return isFullPage(childPage) ? expandPage(client, childPage, entry.slug, depth + 1) : [];
  });

  entry.childSlugs = groups.map((group) => group[0]?.slug).filter((slug): slug is string => !!slug);
  return [entry, ...groups.flat()];
}

async function fetchEntries(config: NotionConfig): Promise<Entry[]> {
  const client = createClient(config);
  const dataSourceId = await resolveDataSourceId(client, config.databaseId);
  const rows = (
    await collectPaginatedAPI(client.dataSources.query, { data_source_id: dataSourceId })
  ).filter(isFullPage);

  const groups = await mapInBatches(rows, 2, (page) => expandPage(client, page, undefined, 0));

  // Newest top-level entry first; each entry stays followed by the pages inside it.
  return groups
    .filter((group) => group.length > 0)
    .sort((a, b) => b[0].date.localeCompare(a[0].date))
    .flat();
}

/** Fetches a page's blocks, and the blocks inside them (lists, toggles, columns, tables…). */
async function fetchBlockTree(client: Client, blockId: string, depth = 0): Promise<NotionNode[]> {
  const blocks = (
    await collectPaginatedAPI(client.blocks.children.list, { block_id: blockId })
  ).filter(isFullBlock);

  return mapInBatches(blocks, 3, async (block): Promise<NotionNode> => {
    // Pages inside this page are separate entries, so we don't read into them here.
    const skip = block.type === "child_page" || block.type === "child_database";
    if (!block.has_children || skip || depth >= 5) return block;

    const sourceId =
      block.type === "synced_block" && block.synced_block.synced_from
        ? block.synced_block.synced_from.block_id
        : block.id;
    return { ...block, children: await fetchBlockTree(client, sourceId, depth + 1) };
  });
}

/** Maps each entry's Notion page ID to where it lives on the site, so links between pages work. */
function knownPages(entries: Entry[], basePath: string): KnownPages {
  const known: KnownPages = new Map();
  for (const entry of entries) {
    if (entry.id) {
      known.set(entry.id.replace(/-/g, "").toLowerCase(), {
        slug: entry.slug,
        title: entry.title,
        basePath,
      });
    }
  }
  return known;
}

const BASE_PATH: Record<NotionCollection, string> = {
  notes: "/notes",
  posts: "/posts",
  projects: "/projects",
};

/**
 * All published entries of a collection (newest first, nested pages after their parent).
 * Until Notion is connected, notes show built-in samples and the others are empty.
 */
export async function getEntries(collection: NotionCollection): Promise<EntriesResult> {
  "use cache";
  cacheTag(NOTION_CACHE_TAG);

  const config = getNotionConfig(collection);
  if (!config) {
    cacheLife("hours");
    return collection === "notes"
      ? { entries: sampleNotes, status: "sample" }
      : { entries: [], status: "unconfigured" };
  }

  try {
    const entries = await fetchEntries(config);
    // Fresh enough to feel live, cheap enough not to hit Notion's rate limits.
    cacheLife(LIVE_CACHE);
    return { entries, status: "live" };
  } catch (error) {
    // Log only the message: never the token or the full request.
    console.error(
      `[notion] Could not load ${collection}:`,
      error instanceof Error ? error.message : error,
    );
    cacheLife(ERROR_CACHE);
    return { entries: [], status: "error" };
  }
}

/** One entry with its full content, or null if it does not exist. */
export async function getEntry(collection: NotionCollection, slug: string): Promise<Entry | null> {
  "use cache";
  cacheTag(NOTION_CACHE_TAG);

  const config = getNotionConfig(collection);
  if (!config) {
    cacheLife("hours");
    return collection === "notes" ? (sampleNotes.find((note) => note.slug === slug) ?? null) : null;
  }

  try {
    const { entries, status } = await getEntries(collection);
    const entry = entries.find((candidate) => candidate.slug === slug);
    if (status !== "live" || !entry?.id) {
      cacheLife(status === "error" ? ERROR_CACHE : LIVE_CACHE);
      return null;
    }

    const tree = await fetchBlockTree(createClient(config), entry.id);
    const content = notionBlocksToContent(tree, knownPages(entries, BASE_PATH[collection]));

    // No cover? Use the first picture in the page as the header image...
    let image = entry.image;
    if (image === PLACEHOLDER_IMAGE) {
      const firstImage = content.find((block) => block.type === "image");
      if (firstImage) image = firstImage.src;
    }

    cacheLife(LIVE_CACHE);
    // ...and never show the header image a second time inside the body.
    return {
      ...entry,
      image,
      content: content.filter((block) => !(block.type === "image" && sameFile(block.src, image))),
    };
  } catch (error) {
    console.error(
      `[notion] Could not load ${collection} entry:`,
      error instanceof Error ? error.message : error,
    );
    cacheLife(ERROR_CACHE);
    return null;
  }
}
