import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dirección A — Boutique cálido
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        surface: "var(--surface)",
        "hero-bg": "var(--hero-bg)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        blush: "var(--blush)",
      },
      fontFamily: {
        ui: ["var(--ui-font)"],
        head: ["var(--head-fam)"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        card: "var(--radius)",
        sm: "var(--radius-sm)",
        btn: "var(--btn-radius)",
      },
      boxShadow: {
        card: "var(--shadow)",
        "card-hover": "var(--shadow-hover)",
      },
      maxWidth: {
        wrap: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
