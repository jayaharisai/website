import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AuthorCard from "./author-card";

const meta = {
  title: "Components/AuthorCard",
  component: AuthorCard,
  args: {
    name: "Jayaharisai",
    bio: "Frontend developer who enjoys building simple, well-designed interfaces.",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
