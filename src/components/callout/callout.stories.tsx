import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Callout from "./callout";

const meta = {
  title: "Components/Callout",
  component: Callout,
  args: {
    title: "Copy dependencies first",
    children: "Copying package files and installing first lets Docker reuse the cached layer.",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
