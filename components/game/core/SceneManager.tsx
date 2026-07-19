"use client";

import { getScene } from "@/lib/game/scene-registry";
import { useCurrentScene } from "@/hooks/useGameStore";

export function SceneManager() {
  const currentScene = useCurrentScene();
  const scene = currentScene ? getScene(currentScene) : null;

  if (!scene) {
    return null;
  }

  const SceneComponent = scene.component;
  return <SceneComponent />;
}
