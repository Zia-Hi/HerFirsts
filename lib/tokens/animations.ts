export const animationTokens = {
  duration: {
    instant: "100ms",
    fast: "200ms",
    normal: "400ms",
    slow: "600ms",
    deliberate: "900ms",
    scene: "1200ms",
  },
  easing: {
    soft: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0.0, 1, 1)",
    weighted: "cubic-bezier(0.45, 0.05, 0.15, 0.95)",
  },
  keyframes: {
    "fade-in": {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
    "fade-out": {
      "0%": { opacity: "1" },
      "100%": { opacity: "0" },
    },
    "soft-rise": {
      "0%": { opacity: "0", transform: "translateY(8px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "gentle-pulse": {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.7" },
    },
  },
  animation: {
    "fade-in": "fade-in 600ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
    "fade-out": "fade-out 400ms cubic-bezier(0.4, 0.0, 1, 1) forwards",
    "soft-rise": "soft-rise 900ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
    "gentle-pulse": "gentle-pulse 2s cubic-bezier(0.45, 0.05, 0.15, 0.95) infinite",
  },
} as const;

export type AnimationDuration = keyof typeof animationTokens.duration;
export type AnimationEasing = keyof typeof animationTokens.easing;
