import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SecondaryButton from "./secondary-button";

const meta = {
  title: "Components/SecondaryButton",
  component: SecondaryButton,
  args: { children: "Read notes" },
} satisfies Meta<typeof SecondaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  args: { children: "View all my projects and notes" },
};

export const AsLink: Story = {
  args: { href: "/about", children: "Go to About" },
};
