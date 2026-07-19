import { useGameStore } from "@/store";

export function useGameState() {
  return useGameStore();
}

export function useCurrentScene() {
  return useGameStore((state) => state.currentScene);
}

export function useGamePhase() {
  return useGameStore((state) => state.gamePhase);
}

export function useTransitionState() {
  return useGameStore((state) => state.transitionState);
}

export function useGameSettings() {
  return useGameStore((state) => state.settings);
}
