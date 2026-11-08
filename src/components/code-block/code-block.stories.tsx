import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CodeBlock from "./code-block";

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  args: {
    language: "bash",
    code: "docker build -t my-app .\ndocker run -p 3000:3000 my-app",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithFilename: Story = {
  args: {
    language: "dockerfile",
    filename: "Dockerfile",
    code: 'FROM node:22-alpine\nWORKDIR /app\nCMD ["npm", "start"]',
  },
};
