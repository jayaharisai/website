import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Footer from "./footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSocialLinks: Story = {
  args: {
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "Email", href: "mailto:hello@example.com" },
    ],
  },
};
