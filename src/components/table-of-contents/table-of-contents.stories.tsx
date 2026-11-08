import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableOfContents from "./table-of-contents";

const meta = {
  title: "Components/TableOfContents",
  component: TableOfContents,
  args: {
    items: [
      { id: "what-is-a-container", label: "What is a container?" },
      { id: "your-first-dockerfile", label: "Your first Dockerfile" },
      { id: "build-and-run", label: "Build and run" },
      { id: "wrapping-up", label: "Wrapping up" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
