import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/author-card";
import { MorePosts } from "@/components/more-posts";
import { PostBody } from "@/components/post-body";
import { PostHeader } from "@/components/post-header";
import { PostNav } from "@/components/post-nav";
import { TableOfContents } from "@/components/table-of-contents";
import { PLACEHOLDER_IMAGE } from "@/data/entry";
import { estimateReadTime, tableOfContents } from "@/lib/content";
import { getEntries, getEntry } from "@/lib/notion/entries";
import "@/components/shared/layout.css";

// Detail pages read live Notion content, so they are allowed to wait for it on the server
// instead of being validated as instant navigations (a dev-only check).
export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { entries } = await getEntries("posts");
  // Cache Components needs at least one prerendered param, even while there is no content.
  // The placeholder is not a real page: it renders a 404, like any unknown address.
  return entries.length > 0 ? entries.map(({ slug }) => ({ slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getEntry("posts", slug);
  return post ? { title: post.title, description: post.description || undefined } : {};
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getEntry("posts", slug);
  if (!post) notFound();

  // Neighbouring posts, newest first: "newer" is the one before this in the list.
  const { entries } = await getEntries("posts");
  const topLevel = entries.filter((entry) => !entry.parentSlug);
  const index = topLevel.findIndex((entry) => entry.slug === post.slug);
  const newer = index > 0 ? topLevel[index - 1] : undefined;
  const older = index >= 0 ? topLevel[index + 1] : undefined;
  const more = topLevel.filter((entry) => entry.slug !== post.slug).slice(0, 2);

  return (
    <main id="main-content" className="page-container page-container--lg">
      <article className="post-article">
        <PostHeader
          title={post.title}
          description={post.descriptionFromBody ? undefined : post.description}
          date={post.date}
          readTime={estimateReadTime(post.content)}
          tags={post.tags}
          image={post.image === PLACEHOLDER_IMAGE ? undefined : post.image}
        />
        <TableOfContents items={tableOfContents(post.content)} />
        <PostBody content={post.content} />
        <AuthorCard
          name="Jayaharisai"
          bio="Frontend developer who enjoys building simple, well-designed interfaces and writing down what he learns along the way."
        />
        <PostNav
          previous={newer && { title: newer.title, href: `/posts/${newer.slug}` }}
          next={older && { title: older.title, href: `/posts/${older.slug}` }}
        />
      </article>

      <MorePosts posts={more} />
    </main>
  );
}
