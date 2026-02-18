import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        "bg": "#0b0b0f",
        "panel": "#14141b",
        "primary": "#e50914",
        "muted": "#a1a1aa"
      }
    },
  },
  plugins: [],
};

export default config;
