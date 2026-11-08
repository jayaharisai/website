import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PullQuote from "./pull-quote";

const meta = {
  title: "Components/PullQuote",
  component: PullQuote,
  args: {
    text: "Good design is as little design as possible.",
    author: "Dieter Rams",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PullQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
