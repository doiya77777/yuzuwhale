import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FDE047",
        secondary: "#1D4ED8",
        accent: "#FFFFFF",
        text: "#0F172A",
        border: "#172554",
      },
    },
  },
  plugins: [],
};

export default config;
