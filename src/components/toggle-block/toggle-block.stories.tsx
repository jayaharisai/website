import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ToggleBlock from "./toggle-block";

const meta = {
  title: "Components/ToggleBlock",
  component: ToggleBlock,
  args: { title: "Click to expand", children: <p>Hidden content, revealed on click.</p> },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToggleBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
