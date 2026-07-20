import type { GameSettings } from "@/types";

export const GAME_STORAGE_KEY = "her-firsts-save";
export const SAVE_VERSION = 1;

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 1,
  musicVolume: 1,
  sfxVolume: 0.5,
  ambientVolume: 0,
  reducedMotion: false,
};

export const FADE_DURATION_MS = 600;
export const SCENE_LOAD_DELAY_MS = 100;

export const CAMERA_DEFAULTS = {
  offset: { x: 0, y: 0 },
  zoom: 1,
  shakeIntensity: 0,
} as const;

export const CAMERA_TRANSITION = {
  duration: 0.6,
  easing: [0.25, 0.1, 0.25, 1],
} as const;
