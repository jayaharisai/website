import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { storyPost } from "@/stories/fixtures";
import PostHeader from "./post-header";

const { title, description, date, tags, image } = storyPost;
const readTime = 5;

const meta = {
  title: "Components/PostHeader",
  component: PostHeader,
  parameters: { layout: "padded" },
  args: { title, description, date, readTime, tags, image },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
