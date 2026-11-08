import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DataTable from "./data-table";

const meta = {
  title: "Components/DataTable",
  component: DataTable,
  args: {
    header: true,
    rows: [
      ["Block", "Supported"],
      ["Images", "**Yes**"],
      ["Videos", "YouTube, Vimeo and files"],
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHeader: Story = {};
export const NoHeader: Story = { args: { header: false } };
