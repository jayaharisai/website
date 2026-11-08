import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { storyPosts } from "@/stories/fixtures";
import MorePosts from "./more-posts";

const meta = {
  title: "Components/MorePosts",
  component: MorePosts,
  parameters: { layout: "padded" },
  args: { posts: storyPosts.slice(0, 2) },
} satisfies Meta<typeof MorePosts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
