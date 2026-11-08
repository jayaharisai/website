import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { getNotionConfig, type NotionCollection } from "@/lib/notion/config";
import { getEntries, NOTION_CACHE_TAG } from "@/lib/notion/entries";

const JSON_HEADERS = { "Cache-Control": "no-store" };

function sameSecret(given: string, expected: string) {
  // Hash first so both buffers have equal length, then compare in constant time.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const COLLECTIONS: NotionCollection[] = ["projects", "posts", "notes"];

/**
 * Refreshes Notion content right away, so a Notion edit shows up on the next page load:
 *   GET /api/revalidate?secret=YOUR_REVALIDATE_SECRET
 * (or POST with the header `Authorization: Bearer YOUR_REVALIDATE_SECRET`).
 *
 * The answer also says how each section loaded, which is the quickest way to debug a live site:
 *   configured: false  -> the NOTION_API_KEY / database ID variables are missing on the host
 *   status "error"     -> Notion refused the request (check the integration has access to the
 *                         database, and look in the host's logs for the message)
 *   status "live"      -> connected; `entries` is how many published rows were found
 */
async function handle(request: Request) {
  const expected = process.env.REVALIDATE_SECRET?.trim();
  if (!expected) {
    return Response.json(
      { error: "REVALIDATE_SECRET is not set." },
      { status: 503, headers: JSON_HEADERS },
    );
  }

  const url = new URL(request.url);
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const given = bearer ?? url.searchParams.get("secret") ?? "";

  if (!sameSecret(given, expected)) {
    return Response.json({ error: "Invalid secret." }, { status: 401, headers: JSON_HEADERS });
  }

  // `expire: 0`: the next request waits for fresh data instead of seeing the old copy.
  revalidateTag(NOTION_CACHE_TAG, { expire: 0 });

  const results = await Promise.all(
    COLLECTIONS.map(async (collection) => {
      const { entries, status } = await getEntries(collection);
      return [
        collection,
        { configured: getNotionConfig(collection) !== null, status, entries: entries.length },
      ] as const;
    }),
  );

  return Response.json(
    { revalidated: true, at: new Date().toISOString(), collections: Object.fromEntries(results) },
    { headers: JSON_HEADERS },
  );
}

export const GET = handle;
export const POST = handle;
