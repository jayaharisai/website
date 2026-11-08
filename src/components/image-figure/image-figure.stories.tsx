import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ImageFigure from "./image-figure";

const meta = {
  title: "Components/ImageFigure",
  component: ImageFigure,
  args: {
    src: "/placeholder.svg",
    caption: "Early wireframe of the main screen.",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Wide: Story = {
  args: { src: "/placeholder.svg", ratio: "16/9", caption: undefined },
};
