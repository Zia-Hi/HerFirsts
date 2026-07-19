"use client";

import { useCallback } from "react";
import { useFade } from "@/hooks/useFade";
import { getScene, hasScene } from "@/lib/game/scene-registry";
import { getSceneLoadDelay } from "@/lib/game/transition";
import { useGameStore } from "@/store";
import type { SceneId } from "@/types";

export function useSceneTransition() {
  const { fadeOut, fadeIn } = useFade();
  const setCurrentScene = useGameStore((state) => state.setCurrentScene);
  const setTransitionState = useGameStore((state) => state.setTransitionState);
  const reducedMotion = useGameStore((state) => state.settings.reducedMotion);
  const currentScene = useGameStore((state) => state.currentScene);

  const transitionToScene = useCallback(
    async (sceneId: SceneId | null) => {
      if (sceneId !== null && !hasScene(sceneId)) {
        return;
      }

      setTransitionState("fade-out");
      await fadeOut();
      setTransitionState("loading");
      setCurrentScene(sceneId);
      await new Promise((resolve) => {
        setTimeout(resolve, getSceneLoadDelay(reducedMotion));
      });
      setTransitionState("fade-in");
      await fadeIn();
      setTransitionState("idle");
    },
    [fadeIn, fadeOut, reducedMotion, setCurrentScene, setTransitionState],
  );

  const activeScene = currentScene ? getScene(currentScene) : null;

  return {
    currentScene,
    activeScene,
    transitionToScene,
  };
}
