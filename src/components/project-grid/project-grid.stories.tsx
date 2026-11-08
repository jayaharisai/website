import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { storyProjects } from "@/stories/fixtures";
import ProjectGrid from "./project-grid";

const meta = {
  title: "Components/ProjectGrid",
  component: ProjectGrid,
  parameters: { layout: "padded" },
  args: { projects: storyProjects },
} satisfies Meta<typeof ProjectGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
