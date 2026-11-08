import type { Preview } from "@storybook/nextjs-vite";
import { DM_Sans } from "next/font/google";
import "../src/app/globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const preview: Preview = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add(dmSans.variable);
      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
