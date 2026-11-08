import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { tools } from "@/data/about";
import LogoMarquee from "./logo-marquee";

const meta = {
  title: "Components/LogoMarquee",
  component: LogoMarquee,
  parameters: { layout: "fullscreen" },
  args: { items: tools, duration: 32 },
} satisfies Meta<typeof LogoMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Fast: Story = { args: { duration: 14 } };
