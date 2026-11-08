import type { Block } from "@/lib/content";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: number;
  image: string;
  tags: string[];
  content: Block[];
};

/** Empty on purpose: posts will be loaded from Notion. */
export const posts: Post[] = [];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);
  return {
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getMorePosts(slug: string, count = 2) {
  return posts.filter((post) => post.slug !== slug).slice(0, count);
}
