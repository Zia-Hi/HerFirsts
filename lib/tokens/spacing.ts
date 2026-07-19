export const spacingTokens = {
  "game-xs": "0.25rem",
  "game-sm": "0.5rem",
  "game-md": "1rem",
  "game-lg": "1.5rem",
  "game-xl": "2rem",
  "game-2xl": "3rem",
  "game-3xl": "4rem",
  "game-4xl": "6rem",
  "scene-padding": "2.5rem",
  "hud-gap": "1.25rem",
  "panel-padding": "1.75rem",
} as const;

export type SpacingToken = keyof typeof spacingTokens;
