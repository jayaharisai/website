import type { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client";
import { escapeInline } from "@/lib/inline";
import type { Block, ListItem, TodoItem } from "@/lib/content";

/** A Notion block together with its (already fetched) child blocks. */
export type NotionNode = BlockObjectResponse & { children?: NotionNode[] };

/** Known pages by Notion page ID, so links between pages become internal links. */
export type KnownPages = Map<string, { slug: string; title: string; basePath: string }>;

type Context = {
  known: KnownPages;
  /** Notion heading level (1–3) → output heading type. */
  levels: Map<number, "h2" | "h3" | "h4">;
};

const compactId = (value: string) => value.replace(/-/g, "").toLowerCase();
const NOTION_HOST =
  /^(?:https?:\/\/)?(?:www\.)?(?:notion\.so|notion\.com|notion\.site|app\.notion\.com)/i;

/**
 * Turns a Notion link into a site link when it points at one of our notes.
 * Relative Notion links (`/<page id>`) that we don't know are made absolute.
 */
function resolveHref(href: string, known: KnownPages): string {
  const isNotionLink = href.startsWith("/") || NOTION_HOST.test(href);
  if (!isNotionLink) return href;

  const id = compactId(href).match(/[0-9a-f]{32}/)?.[0];
  const note = id ? known.get(id) : undefined;
  if (note) return `${note.basePath}/${note.slug}`;
  return href.startsWith("/") ? `https://www.notion.so${href}` : href;
}

/** Rich text → text with inline markup (links, bold, italic, strike, underline, code). */
export function richTextToString(items: RichTextItemResponse[], known: KnownPages = new Map()) {
  return items
    .map((item) => {
      const { annotations: a } = item;
      let text: string;

      if (item.type === "equation" || (a.code && !item.plain_text.includes("`"))) {
        text = `\`${item.plain_text}\``;
      } else {
        text = escapeInline(item.plain_text);
        if (a.bold && a.italic) text = `***${text}***`;
        else if (a.bold) text = `**${text}**`;
        else if (a.italic) text = `*${text}*`;
        if (a.strikethrough) text = `~~${text}~~`;
        if (a.underline) text = `++${text}++`;
      }

      if (item.href) {
        const href = resolveHref(item.href, known).replace(/\)/g, "%29");
        text = `[${text}](${href})`;
      }
      return text;
    })
    .join("");
}

const plain = (items: RichTextItemResponse[]) => items.map((item) => item.plain_text).join("");

/** Heading levels actually used on the page, smallest first → h2, h3, h4. */
function headingLevels(nodes: NotionNode[]) {
  const used = new Set<number>();
  const visit = (list: NotionNode[]) => {
    for (const node of list) {
      if (node.type === "heading_1") used.add(1);
      if (node.type === "heading_2") used.add(2);
      if (node.type === "heading_3") used.add(3);
      if (node.children) visit(node.children);
    }
  };
  visit(nodes);

  const order: ("h2" | "h3" | "h4")[] = ["h2", "h3", "h4"];
  return new Map([...used].sort().map((level, index) => [level, order[index]]));
}

function fileUrl(
  source: { type: "external"; external: { url: string } } | { type: "file"; file: { url: string } },
) {
  return source.type === "external" ? source.external.url : source.file.url;
}

function convert(nodes: NotionNode[], ctx: Context): Block[] {
  const blocks: Block[] = [];
  const text = (items: RichTextItemResponse[]) => richTextToString(items, ctx.known);
  const kids = (node: NotionNode) => convert(node.children ?? [], ctx);

  const pushListItem = (type: "ul" | "ol", item: ListItem) => {
    const last = blocks[blocks.length - 1];
    if (last && last.type === type) last.items.push(item);
    else blocks.push({ type, items: [item] });
  };

  for (const node of nodes) {
    switch (node.type) {
      case "paragraph": {
        const value = text(node.paragraph.rich_text);
        if (value.trim()) blocks.push({ type: "p", text: value });
        blocks.push(...kids(node));
        break;
      }
      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const data =
          node.type === "heading_1"
            ? node.heading_1
            : node.type === "heading_2"
              ? node.heading_2
              : node.heading_3;
        const level = Number(node.type.slice(-1));
        const value = text(data.rich_text);
        if (!value.trim()) break;
        if (data.is_toggleable) {
          blocks.push({ type: "toggle", title: value, children: kids(node) });
        } else {
          blocks.push({ type: ctx.levels.get(level) ?? "h2", text: value });
          blocks.push(...kids(node));
        }
        break;
      }
      case "bulleted_list_item":
      case "numbered_list_item": {
        const data =
          node.type === "bulleted_list_item" ? node.bulleted_list_item : node.numbered_list_item;
        const value = text(data.rich_text);
        const children = kids(node);
        pushListItem(
          node.type === "bulleted_list_item" ? "ul" : "ol",
          children.length > 0 ? { text: value, children } : value,
        );
        break;
      }
      case "to_do": {
        const item: TodoItem = {
          text: text(node.to_do.rich_text),
          checked: node.to_do.checked,
          children: kids(node),
        };
        const last = blocks[blocks.length - 1];
        if (last && last.type === "todo") last.items.push(item);
        else blocks.push({ type: "todo", items: [item] });
        break;
      }
      case "toggle":
        blocks.push({ type: "toggle", title: text(node.toggle.rich_text), children: kids(node) });
        break;
      case "quote": {
        const value = text(node.quote.rich_text);
        if (value.trim()) blocks.push({ type: "quote", text: value, children: kids(node) });
        break;
      }
      case "callout": {
        const icon = node.callout.icon?.type === "emoji" ? node.callout.icon.emoji : undefined;
        blocks.push({
          type: "callout",
          icon,
          text: text(node.callout.rich_text),
          children: kids(node),
        });
        break;
      }
      case "code":
        blocks.push({
          type: "code",
          language: node.code.language,
          code: plain(node.code.rich_text),
          filename: plain(node.code.caption) || undefined,
        });
        break;
      case "equation":
        blocks.push({ type: "code", language: "latex", code: node.equation.expression });
        break;
      case "image":
        blocks.push({
          type: "image",
          src: fileUrl(node.image),
          caption: plain(node.image.caption),
        });
        break;
      case "video":
        blocks.push({
          type: "video",
          url: fileUrl(node.video),
          caption: plain(node.video.caption) || undefined,
        });
        break;
      case "bookmark":
        blocks.push({
          type: "bookmark",
          url: node.bookmark.url,
          caption: plain(node.bookmark.caption) || undefined,
        });
        break;
      case "link_preview":
        blocks.push({ type: "bookmark", url: node.link_preview.url });
        break;
      case "embed":
        blocks.push({
          type: "bookmark",
          url: node.embed.url,
          caption: plain(node.embed.caption) || undefined,
        });
        break;
      case "file":
      case "pdf":
      case "audio": {
        const data = node.type === "file" ? node.file : node.type === "pdf" ? node.pdf : node.audio;
        const caption = plain(data.caption);
        const name =
          ("name" in data && typeof data.name === "string" && data.name) || caption || "Download";
        blocks.push({ type: "file", url: fileUrl(data), name });
        break;
      }
      case "table": {
        const rows = (node.children ?? [])
          .filter((row) => row.type === "table_row")
          .map((row) =>
            row.type === "table_row" ? row.table_row.cells.map((cell) => text(cell)) : [],
          );
        blocks.push({ type: "table", header: node.table.has_column_header, rows });
        break;
      }
      case "divider":
        blocks.push({ type: "divider" });
        break;
      case "link_to_page": {
        const target = node.link_to_page.type === "page_id" ? node.link_to_page.page_id : undefined;
        const note = target ? ctx.known.get(compactId(target)) : undefined;
        if (note)
          blocks.push({
            type: "bookmark",
            url: `${note.basePath}/${note.slug}`,
            caption: note.title,
          });
        break;
      }
      case "column_list":
      case "column":
      case "synced_block":
        // Shown one after another, in reading order.
        blocks.push(...kids(node));
        break;
      default:
        // child_page (listed separately as sub-pages), table_of_contents, breadcrumb, etc.
        break;
    }
  }

  return blocks;
}

/** Converts a fetched Notion block tree into the site's `Block` model. */
export function notionBlocksToContent(nodes: NotionNode[], known: KnownPages = new Map()): Block[] {
  return convert(nodes, { known, levels: headingLevels(nodes) });
}
