import type { Config } from "tailwindcss";
import { animationTokens } from "./lib/tokens/animations";
import { colorTokens } from "./lib/tokens/colors";
import { spacingTokens } from "./lib/tokens/spacing";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: colorTokens,
      spacing: spacingTokens,
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      transitionDuration: animationTokens.duration,
      transitionTimingFunction: animationTokens.easing,
      keyframes: animationTokens.keyframes,
      animation: animationTokens.animation,
    },
  },
  plugins: [],
};

export default config;
