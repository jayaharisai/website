import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NOTION_CACHE_TAG } from "@/lib/notion/entries";

const JSON_HEADERS = { "Cache-Control": "no-store" };

function sameSecret(given: string, expected: string) {
  // Hash first so both buffers have equal length, then compare in constant time.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Refreshes Notion notes right away, so a Notion edit shows up on the next page load:
 *   GET /api/revalidate?secret=YOUR_REVALIDATE_SECRET
 * (or POST with the header `Authorization: Bearer YOUR_REVALIDATE_SECRET`).
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
  return Response.json(
    { revalidated: true, at: new Date().toISOString() },
    { headers: JSON_HEADERS },
  );
}

export const GET = handle;
export const POST = handle;
