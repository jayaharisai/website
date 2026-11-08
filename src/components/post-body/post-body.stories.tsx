import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { sampleNotes } from "@/data/notes";
import PostBody from "./post-body";

const meta = {
  title: "Components/PostBody",
  component: PostBody,
  parameters: { layout: "padded" },
  args: { content: sampleNotes[0].content },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every block type Notion content can produce. */
export const AllBlocks: Story = {
  args: { content: sampleNotes.find((note) => note.slug === "everything-supported")!.content },
};
