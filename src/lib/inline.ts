/**
 * A tiny inline-markup parser used for note and post text.
 *
 *   `code`   **bold**   *italic*   ***bold italic***   ~~strike~~   ++underline++
 *   [label](url)         \* escapes the next character
 *
 * The output is a tree of nodes that React renders as elements, so no HTML is ever injected.
 */
export type InlineNode =
  | { t: "text"; v: string }
  | { t: "code"; v: string }
  | { t: "link"; href: string; children: InlineNode[] }
  | { t: "strong" | "em" | "del" | "u"; children: InlineNode[] };

const MARKS: { open: string; type: "strong" | "del" | "u" | "em" }[] = [
  { open: "**", type: "strong" },
  { open: "~~", type: "del" },
  { open: "++", type: "u" },
  { open: "*", type: "em" },
];

/** Escapes characters that would be read as markup. */
export function escapeInline(text: string) {
  return text.replace(/([\\`*~[\]+])/g, "\\$1");
}

/** Finds the next unescaped `mark` at or after `from`, skipping code spans. */
function findClose(source: string, mark: string, from: number) {
  for (let index = from; index < source.length; index++) {
    const char = source[index];
    if (char === "\\") {
      index++;
    } else if (char === "`") {
      const end = source.indexOf("`", index + 1);
      if (end === -1) return -1;
      index = end;
    } else if (source.startsWith(mark, index)) {
      // A lone `*` must not match half of a `**`.
      if (mark === "*" && source.startsWith("**", index)) {
        index++;
        continue;
      }
      return index;
    }
  }
  return -1;
}

function findClosingBracket(source: string, open: number) {
  let depth = 0;
  for (let index = open; index < source.length; index++) {
    const char = source[index];
    if (char === "\\") index++;
    else if (char === "[") depth++;
    else if (char === "]" && --depth === 0) return index;
  }
  return -1;
}

export function parseInline(source: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let buffer = "";
  let index = 0;

  const flush = () => {
    if (buffer) nodes.push({ t: "text", v: buffer });
    buffer = "";
  };

  scan: while (index < source.length) {
    const char = source[index];

    if (char === "\\" && index + 1 < source.length) {
      buffer += source[index + 1];
      index += 2;
      continue;
    }

    if (char === "`") {
      const end = source.indexOf("`", index + 1);
      if (end > index) {
        flush();
        nodes.push({ t: "code", v: source.slice(index + 1, end) });
        index = end + 1;
        continue;
      }
    }

    if (char === "[") {
      const close = findClosingBracket(source, index);
      if (close > index && source[close + 1] === "(") {
        const end = source.indexOf(")", close + 2);
        if (end > close) {
          flush();
          nodes.push({
            t: "link",
            href: source.slice(close + 2, end),
            children: parseInline(source.slice(index + 1, close)),
          });
          index = end + 1;
          continue;
        }
      }
    }

    if (source.startsWith("***", index)) {
      const end = findClose(source, "***", index + 3);
      if (end > index + 3) {
        flush();
        nodes.push({
          t: "strong",
          children: [{ t: "em", children: parseInline(source.slice(index + 3, end)) }],
        });
        index = end + 3;
        continue;
      }
    }

    for (const { open, type } of MARKS) {
      if (!source.startsWith(open, index)) continue;
      const end = findClose(source, open, index + open.length);
      if (end > index + open.length) {
        flush();
        nodes.push({ t: type, children: parseInline(source.slice(index + open.length, end)) });
        index = end + open.length;
        continue scan;
      }
    }

    buffer += char;
    index++;
  }

  flush();
  return nodes;
}
