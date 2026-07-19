import { FADE_DURATION_MS, SCENE_LOAD_DELAY_MS } from "./constants";

export function getFadeDuration(reducedMotion: boolean): number {
  return reducedMotion ? 0 : FADE_DURATION_MS;
}

export function getSceneLoadDelay(reducedMotion: boolean): number {
  return reducedMotion ? 0 : SCENE_LOAD_DELAY_MS;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
