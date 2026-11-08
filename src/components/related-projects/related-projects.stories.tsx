import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { storyProjects } from "@/stories/fixtures";
import RelatedProjects from "./related-projects";

const meta = {
  title: "Components/RelatedProjects",
  component: RelatedProjects,
  parameters: { layout: "padded" },
  args: { projects: storyProjects.slice(1) },
} satisfies Meta<typeof RelatedProjects>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
