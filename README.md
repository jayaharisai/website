# website

My personal engineering portfolio — showcasing projects, technical notes, experiments, learnings, and ideas. A space to build, explore, document, and share knowledge.

## Stack

Next.js (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide · Framer Motion · Storybook · Notion API and Supabase (optional, not wired up yet)

## Getting started

```bash
pnpm install
pnpm dev           # http://localhost:3000
pnpm storybook     # component workshop on http://localhost:6006
```

| Script                 | What it does                    |
| ---------------------- | ------------------------------- |
| `pnpm dev`             | Start the dev server            |
| `pnpm build`           | Production build                |
| `pnpm typecheck`       | Type-check without emitting     |
| `pnpm lint`            | ESLint                          |
| `pnpm format`          | Format everything with Prettier |
| `pnpm build-storybook` | Static Storybook build          |

Copy `.env.example` to `.env` and fill in your keys (`.env` is git-ignored).

## Notion

Projects, posts and notes are all loaded from Notion, one database for each. Until a database is connected its page shows an empty state (notes show a few built-in samples).

1. Create an integration at <https://www.notion.so/profile/integrations> and copy its secret into `NOTION_API_KEY` in `.env`.
2. For each database: open it as a full page → `…` menu → **Connections** → add your integration.
3. Paste each database's ID (the 32-character part of its link) into `.env`:

| Section  | Variable                      |
| -------- | ----------------------------- |
| Projects | `NOTION_PROJECTS_DATABASE_ID` |
| Posts    | `NOTION_POSTS_DATABASE_ID`    |
| Notes    | `NOTION_NOTES_DATABASE_ID`    |

4. Restart `pnpm dev` (`.env` is only read at startup).

**Each row is a page.** The row's page body is the content. Only the title column (`Name`) is required. Optional columns (rename them in `src/lib/notion/config.ts`):

| Column      | Type         | Used for                                              |
| ----------- | ------------ | ----------------------------------------------------- |
| `Summary`   | Text         | Card text (falls back to the page's first paragraph)  |
| `Date`      | Date         | Sorting and display (falls back to the created date)  |
| `Tags`      | Multi-select | Tags on posts and notes                               |
| `Slug`      | Text         | URL (generated from the title if empty)               |
| `Published` | Checkbox     | Unchecked rows are hidden                             |
| `Image`     | Files        | Card image (falls back to the page cover, then image) |
| `Year`      | Text/Number  | Projects only: shown under the title                  |
| `Role`      | Text/Select  | Projects only                                         |
| `Duration`  | Text         | Projects only                                         |
| `Stack`     | Multi-select | Projects only: technology pills                       |

Blank rows are skipped. A page inside a page becomes its own entry (up to 4 levels deep), listed under "Pages in this …" on its parent.

**What gets shown:** headings and sub-headings, paragraphs with **bold**, _italic_, strikethrough, underline, `code` and links (links to your other pages become internal links), nested bulleted/numbered lists, to-dos, toggles, callouts (with their emoji), quotes, dividers, code blocks, images, videos (YouTube, Vimeo and files), bookmarks/embeds, files and tables. Columns are shown one after another. Comments are not shown.

**How fast do edits appear?** While running `pnpm dev`, within a couple of seconds (just reload). On the live site, within about a minute. For an immediate update after saving in Notion, open `/api/revalidate?secret=YOUR_REVALIDATE_SECRET` once (the secret is `REVALIDATE_SECRET` in `.env`), then reload the page. No redeploy is ever needed.

## Structure

```
src/
  app/            routes: /, /projects, /posts, /notes (each with [slug] pages), /about
  components/     one folder per component (tsx + css + stories + index)
    shared/       styles and primitives reused by several components
  data/           the shared Entry type, sample notes, and About content
  lib/            helpers; lib/notion = server-only Notion client
```

Theme colours, spacing helpers and the day/night tokens live in `src/app/globals.css`. Components use those tokens instead of hard-coded colours.

## Notes

- Unknown project/post URLs return a real `404`.
- Security headers are set in `next.config.ts`.
- Day/night mode is stored in `localStorage` and applied before first paint.
