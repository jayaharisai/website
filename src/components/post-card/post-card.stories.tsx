import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostCard from "./post-card";

const meta = {
  title: "Components/PostCard",
  component: PostCard,
  parameters: { layout: "padded" },
  args: {
    title: "A sample post title",
    description: "Learn the fundamentals of Docker and containerization",
    date: "2024-03-20",
    readTime: 5,
    image: "/placeholder.svg",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720, padding: 8 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongDescription: Story = {
  args: {
    title: "Getting Started with Next.js 14",
    description: "A comprehensive guide to building modern web applications with Next.js 14",
    image: "/placeholder.svg",
  },
};
