import type { Metadata } from "next";
import { NotionNotice } from "@/components/notion-notice";
import { PageHeader } from "@/components/page-header";
import { PostList } from "@/components/post-list";
import { getEntries } from "@/lib/notion/entries";
import "@/components/shared/layout.css";

export const metadata: Metadata = {
  title: "Posts",
};

export default async function PostsPage() {
  const { entries, status } = await getEntries("posts");
  const posts = entries.filter((entry) => !entry.parentSlug);

  return (
    <main id="main-content" className="page-container page-container--md">
      <PageHeader
        title="Posts"
        description="Short write-ups about what I am learning and building, and the ideas behind it."
      />
      <NotionNotice collection="posts" status={status} />
      <PostList
        posts={posts}
        emptyMessage={
          status === "error"
            ? "Posts couldn't be loaded right now. Please try again in a moment."
            : "No posts yet."
        }
      />
    </main>
  );
}
