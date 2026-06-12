import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#020617",
        panel: "#0f172a",
        line: "#1e293b",
      },
    },
  },
  plugins: [],
};

export default config;
