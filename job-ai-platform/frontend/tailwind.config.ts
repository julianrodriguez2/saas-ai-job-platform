import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--color-surface)",
        panel: "var(--color-panel)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        text: "var(--color-text)",
        muted: "var(--color-muted)"
      }
    }
  },
  plugins: []
};

export default config;

