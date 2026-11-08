import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LinkCard from "./link-card";

const meta = {
  title: "Components/LinkCard",
  component: LinkCard,
  args: { url: "https://developers.notion.com", title: "Notion API docs" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bookmark: Story = {};
export const File: Story = {
  args: { url: "https://example.com/report.pdf", title: "report.pdf", kind: "file" },
};
