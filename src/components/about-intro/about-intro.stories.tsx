import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { aboutParagraphs } from "@/data/about";
import AboutIntro from "./about-intro";

const meta = {
  title: "Components/AboutIntro",
  component: AboutIntro,
  parameters: { layout: "padded" },
  args: {
    paragraphs: aboutParagraphs,
    image: "/about/portrait.jpg",
    imageAlt: "Portrait",
  },
} satisfies Meta<typeof AboutIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
