import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PrimaryButton from "./primary-button";

const meta = {
  title: "Components/PrimaryButton",
  component: PrimaryButton,
  args: { children: "Get in touch" },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  args: { children: "View all my projects and notes" },
};

export const AsLink: Story = {
  args: { href: "/about", children: "Go to About" },
};
