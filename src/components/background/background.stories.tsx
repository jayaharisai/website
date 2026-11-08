import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Background from "./background";

const meta = {
  title: "Components/Background",
  component: Background,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
