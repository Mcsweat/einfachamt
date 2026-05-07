import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        trust: {
          50: "#f2f2f7",
          100: "#e5f0ff",
          200: "#c9defc",
          500: "#0a84ff",
          700: "#0066cc",
        },
      },
      boxShadow: {
        soft: "0 12px 32px rgba(17, 24, 39, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
