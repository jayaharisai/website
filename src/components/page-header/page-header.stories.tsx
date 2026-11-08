import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageHeader from "./page-header";

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  args: {
    title: "Our Projects",
    description:
      "Here you can showcase your best work. Each project should include a brief description, the technologies used, and any notable achievements.",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = { args: { description: undefined } };
