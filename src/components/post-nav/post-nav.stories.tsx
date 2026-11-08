import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostNav from "./post-nav";

const meta = {
  title: "Components/PostNav",
  component: PostNav,
  args: {
    previous: { title: "Docker Basics for Developers", href: "#" },
    next: { title: "TypeScript Tips and Tricks", href: "#" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OnlyNext: Story = { args: { previous: undefined } };
