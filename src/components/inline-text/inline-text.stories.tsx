import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import InlineText from "./inline-text";

const meta = {
  title: "Components/InlineText",
  component: InlineText,
  args: {
    text: "**Bold**, *italic*, ***both***, ~~strike~~, ++underline++, `code` and a [link](https://nextjs.org).",
  },
} satisfies Meta<typeof InlineText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** `javascript:` links are shown as plain text, never as a link. */
export const UnsafeLinkIsBlocked: Story = { args: { text: "[click me](javascript:alert(1))" } };
