import { DATABASE_ENV_NAME, type NotionCollection } from "@/lib/notion/config";
import type { EntriesResult } from "@/lib/notion/entries";
import "../shared/typography.css";

type NotionNoticeProps = {
  collection: NotionCollection;
  status: EntriesResult["status"];
};

/**
 * A developer hint shown only while running locally, when Notion isn't connected yet.
 * It never appears on the live site.
 */
export default function NotionNotice({ collection, status }: NotionNoticeProps) {
  if (process.env.NODE_ENV === "production") return null;
  if (status !== "sample" && status !== "unconfigured") return null;

  return (
    <p className="description">
      Notion isn&apos;t connected for {collection} yet. Add{" "}
      <code>{DATABASE_ENV_NAME[collection]}</code> to <code>.env</code> and restart{" "}
      <code>pnpm dev</code>.
    </p>
  );
}
