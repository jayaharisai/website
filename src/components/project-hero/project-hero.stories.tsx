import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { storyProject } from "@/stories/fixtures";
import ProjectHero from "./project-hero";

const { title, description: summary, image, year, role, duration, stack } = storyProject;

const meta = {
  title: "Components/ProjectHero",
  component: ProjectHero,
  parameters: { layout: "padded" },
  args: { title, summary, image, year, role, duration, stack },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
