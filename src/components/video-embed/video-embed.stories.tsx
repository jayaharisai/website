import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import VideoEmbed from "./video-embed";

const meta = {
  title: "Components/VideoEmbed",
  component: VideoEmbed,
  args: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", caption: "A YouTube video" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTube: Story = {};
/** Anything that can't be embedded safely falls back to a link card. */
export const UnknownSite: Story = {
  args: { url: "https://example.com/some-video", caption: "Other site" },
};
