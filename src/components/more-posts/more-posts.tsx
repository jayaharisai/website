import type { Post } from "@/data/entry";
import { PostList } from "@/components/post-list";
import "./more-posts.css";

type MorePostsProps = {
  posts: Post[];
  title?: string;
};

export default function MorePosts({ posts, title = "Keep reading" }: MorePostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="more-posts" aria-labelledby="more-posts-title">
      <h2 id="more-posts-title" className="more-posts__title">
        {title}
      </h2>
      <PostList posts={posts} headingLevel="h3" />
    </section>
  );
}
