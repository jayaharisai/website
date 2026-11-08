import { slugify } from "@/lib/slugify";

/** A list entry: plain text, or text with nested blocks (e.g. a sub-list). */
export type ListItem = string | { text: string; children?: Block[] };

export type TodoItem = { text: string; checked: boolean; children?: Block[] };

/** Text may contain inline markup (see `lib/inline.ts`): links, bold, italic, code… */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2" | "h3" | "h4"; text: string }
  | { type: "ul" | "ol"; items: ListItem[] }
  | { type: "todo"; items: TodoItem[] }
  | { type: "toggle"; title: string; children: Block[] }
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "callout"; title?: string; text: string; icon?: string; children?: Block[] }
  | { type: "quote"; text: string; author?: string; children?: Block[] }
  | { type: "image"; src: string; caption: string }
  | { type: "video"; url: string; caption?: string }
  | { type: "bookmark"; url: string; caption?: string }
  | { type: "file"; url: string; name: string }
  | { type: "table"; header: boolean; rows: string[][] }
  | { type: "divider" };

type Heading = Extract<Block, { type: "h2" | "h3" | "h4" }>;

const words = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

function wordsIn(block: Block): number {
  switch (block.type) {
    case "p":
    case "h2":
    case "h3":
    case "h4":
      return words(block.text);
    case "quote":
      return words(block.text) + countWords(block.children ?? []);
    case "callout":
      return words(`${block.title ?? ""} ${block.text}`) + countWords(block.children ?? []);
    case "toggle":
      return words(block.title) + countWords(block.children);
    case "ul":
    case "ol":
      return block.items.reduce(
        (total, item) =>
          total +
          (typeof item === "string"
            ? words(item)
            : words(item.text) + countWords(item.children ?? [])),
        0,
      );
    case "todo":
      return block.items.reduce((total, item) => total + words(item.text), 0);
    case "table":
      return block.rows.flat().reduce((total, cell) => total + words(cell), 0);
    default:
      return 0;
  }
}

function countWords(blocks: Block[]) {
  return blocks.reduce((total, block) => total + wordsIn(block), 0);
}

/** Reading time in minutes at ~200 words per minute (minimum 1). */
export function estimateReadTime(content: Block[]) {
  return Math.max(1, Math.ceil(countWords(content) / 200));
}

/** Heading text with its markup removed, e.g. for anchors and the table of contents. */
export function plainText(text: string) {
  return text
    .replace(/\\(.)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*`~+]/g, "");
}

/**
 * Gives every heading (including nested ones) a unique anchor id. Two headings with the same
 * text get "-2", "-3", …. The page and the table of contents both read from this map.
 */
export function assignHeadingIds(blocks: Block[]) {
  const ids = new Map<Block, string>();
  const used = new Map<string, number>();

  const visit = (list: Block[]) => {
    for (const block of list) {
      if (block.type === "h2" || block.type === "h3" || block.type === "h4") {
        const base = slugify(plainText(block.text)) || "section";
        const count = (used.get(base) ?? 0) + 1;
        used.set(base, count);
        ids.set(block, count === 1 ? base : `${base}-${count}`);
      } else if (block.type === "toggle") {
        visit(block.children);
      }
    }
  };

  visit(blocks);
  return ids;
}

/** Top-level h2 headings, for the "On this page" list. */
export function tableOfContents(blocks: Block[]) {
  const ids = assignHeadingIds(blocks);
  return blocks
    .filter((block): block is Heading => block.type === "h2")
    .map((block) => ({ id: ids.get(block)!, label: plainText(block.text) }));
}
