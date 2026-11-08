import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Background } from "@/components/background";
import GridHighlight from "./grid-highlight";

const meta = {
  title: "Components/GridHighlight",
  component: GridHighlight,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <>
        <Background />
        <Story />
        <p style={{ padding: 24, position: "relative" }}>Move your mouse over the grid.</p>
      </>
    ),
  ],
} satisfies Meta<typeof GridHighlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
