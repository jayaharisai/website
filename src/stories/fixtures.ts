import type { Entry } from "@/data/entry";

/**
 * Sample data used only by Storybook, so components can be previewed without real content.
 * The site itself reads no data from this file.
 */
const image = "/placeholder.svg";

export const storyProject: Entry = {
  slug: "sample-project",
  title: "Sample project",
  description: "A short description that shows how a project card looks.",
  image,
  date: "2024-03-20",
  tags: [],
  year: "2024",
  role: "Design & Development",
  duration: "4 weeks",
  stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  content: [{ type: "p", text: "The write-up of the project." }],
};

export const storyProjects: Entry[] = [
  storyProject,
  { ...storyProject, slug: "second-project", title: "Second project" },
  { ...storyProject, slug: "third-project", title: "Third project" },
];

export const storyPost: Entry = {
  slug: "sample-post",
  title: "A sample post title",
  description: "A short description that shows how a post card looks.",
  date: "2024-03-20",
  image,
  tags: ["Sample", "Notes"],
  content: [{ type: "p", text: "The body of the post." }],
};

export const storyPosts: Entry[] = [
  storyPost,
  { ...storyPost, slug: "second-post", title: "A second sample post" },
  { ...storyPost, slug: "third-post", title: "A third sample post" },
];
