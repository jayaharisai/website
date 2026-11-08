import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TodoList from "./todo-list";

const meta = {
  title: "Components/TodoList",
  component: TodoList,
  args: {
    items: [
      { text: "Write the note", checked: true },
      { text: "Share it with **everyone**", checked: false },
    ],
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
