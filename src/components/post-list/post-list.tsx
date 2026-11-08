import type { Post } from "@/data/entry";
import { PostCard } from "@/components/post-card";
import "../shared/typography.css";
import "./post-list.css";

type PostListProps = {
  posts: Post[];
  headingLevel?: "h2" | "h3";
  emptyMessage?: string;
};

export default function PostList({
  posts,
  headingLevel,
  emptyMessage = "No posts yet.",
}: PostListProps) {
  if (posts.length === 0) {
    return <p className="description">{emptyMessage}</p>;
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <PostCard
            title={post.title}
            description={post.description}
            date={post.date}
            readTime={post.readTime}
            image={post.image}
            href={`/posts/${post.slug}`}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
