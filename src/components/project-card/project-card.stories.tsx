import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProjectCard from "./project-card";

const meta = {
  title: "Components/ProjectCard",
  component: ProjectCard,
  args: {
    title: "Project One",
    description:
      "A brief description of your first project. Explain what it does and the problem it solves.",
    image: "/placeholder.svg",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Blue: Story = {
  args: { title: "Project Two", image: "/placeholder.svg" },
};
