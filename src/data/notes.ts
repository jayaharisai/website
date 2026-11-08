import { PLACEHOLDER_IMAGE, type Note } from "@/data/entry";

export const NOTE_PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGE;

/** Shown until Notion is connected (see README → Notion). */
export const sampleNotes: Note[] = [
  {
    slug: "connect-notion",
    title: "Connect your Notion database",
    description: "Add your API key and database ID and your real notes appear here.",
    image: NOTE_PLACEHOLDER_IMAGE,
    date: "2024-03-22",
    tags: ["Notion", "Setup"],
    content: [
      {
        type: "p",
        text: "This is a sample note. Once `NOTION_API_KEY` and a database ID are set in `.env.local`, your own notes replace these.",
      },
      { type: "h2", text: "What gets synced" },
      {
        type: "ul",
        items: [
          "The page title becomes the note title.",
          "`Summary`, `Date`, `Tags`, `Slug` and `Published` properties are read when present.",
          "The page content is converted to headings, text, lists, code, quotes and images.",
        ],
      },
      {
        type: "callout",
        title: "Live updates",
        text: "Notes refresh automatically every few minutes, so edits in Notion show up without redeploying.",
      },
    ],
  },
  {
    slug: "writing-in-public",
    title: "Writing in public",
    description: "Why keeping short notes is the easiest way to learn faster.",
    image: NOTE_PLACEHOLDER_IMAGE,
    date: "2024-03-10",
    tags: ["Learning"],
    content: [
      {
        type: "p",
        text: "Short notes lower the bar for writing. A few honest paragraphs beat a polished article that never ships.",
      },
      { type: "h2", text: "A simple habit" },
      {
        type: "p",
        text: "Write down one thing you learned each day, even if it feels obvious. Later, the small notes become the raw material for longer posts.",
      },
      { type: "quote", text: "Notes are how future you says thank you to past you." },
    ],
  },
  {
    slug: "keyboard-shortcuts-i-use",
    title: "Keyboard shortcuts I actually use",
    description: "A tiny list of shortcuts that save me time every single day.",
    image: NOTE_PLACEHOLDER_IMAGE,
    date: "2024-02-26",
    tags: ["Productivity"],
    content: [
      { type: "p", text: "Not a complete list, just the ones that stuck." },
      {
        type: "ul",
        items: [
          "`Cmd + P` to jump to any file.",
          "`Cmd + Shift + P` for the command palette.",
          "`Cmd + D` to select the next match.",
        ],
      },
    ],
  },
  {
    slug: "everything-supported",
    title: "Everything you can write in Notion",
    description: "A tour of the formatting and blocks that show up on the site.",
    image: NOTE_PLACEHOLDER_IMAGE,
    date: "2024-03-20",
    tags: ["Reference"],
    childSlugs: ["nested-pages"],
    content: [
      {
        type: "p",
        text: "Write normally in Notion and it appears here. You can use **bold**, *italic*, ~~strikethrough~~, ++underline++, `inline code` and [links](https://nextjs.org) anywhere.",
      },
      { type: "h2", text: "Headings and sub-headings" },
      { type: "h3", text: "A sub-heading" },
      { type: "p", text: "Sub-headings help long notes stay easy to scan." },
      { type: "h4", text: "A smaller heading" },
      { type: "h2", text: "Lists" },
      {
        type: "ul",
        items: [
          "A bullet",
          {
            text: "A bullet with a sub-list",
            children: [{ type: "ul", items: ["Nested one", "Nested two"] }],
          },
        ],
      },
      { type: "ol", items: ["First", "Second", "Third"] },
      {
        type: "todo",
        items: [
          { text: "Write the note", checked: true },
          { text: "Share it", checked: false },
        ],
      },
      { type: "h2", text: "Callouts, quotes and toggles" },
      {
        type: "callout",
        icon: "💡",
        text: "Callouts keep their emoji from Notion.",
      },
      { type: "quote", text: "A quote can hold *formatting* too." },
      {
        type: "toggle",
        title: "Click to expand",
        children: [{ type: "p", text: "Toggles can hold any other blocks inside them." }],
      },
      { type: "divider" },
      { type: "h2", text: "Code, tables and links" },
      {
        type: "code",
        language: "ts",
        code: "const greeting: string = 'Hello, Notion';",
      },
      {
        type: "table",
        header: true,
        rows: [
          ["Block", "Supported"],
          ["Images", "Yes"],
          ["Videos", "YouTube, Vimeo and files"],
        ],
      },
      { type: "bookmark", url: "https://developers.notion.com", caption: "Notion API docs" },
      {
        type: "p",
        text: "Pages inside this note appear at the bottom, and linking to another note works too.",
      },
    ],
  },
  {
    slug: "nested-pages",
    title: "Nested pages",
    description: "A page inside another page, like a folder of notes.",
    image: NOTE_PLACEHOLDER_IMAGE,
    date: "2024-03-19",
    tags: [],
    parentSlug: "everything-supported",
    childSlugs: [],
    content: [
      {
        type: "p",
        text: "This page lives inside *Everything you can write in Notion*. Use the link at the top to go back up.",
      },
    ],
  },
];
