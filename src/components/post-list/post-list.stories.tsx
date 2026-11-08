import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { storyPosts } from "@/stories/fixtures";
import PostList from "./post-list";

const meta = {
  title: "Components/PostList",
  component: PostList,
  parameters: { layout: "padded" },
  args: { posts: storyPosts },
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
