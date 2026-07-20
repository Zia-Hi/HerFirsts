"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getScene } from "@/lib/game/scene-registry";
import { useCurrentScene } from "@/hooks/useGameStore";

export function SceneManager() {
  const currentScene = useCurrentScene();
  const scene = currentScene ? getScene(currentScene) : null;

  if (!scene) {
    return null;
  }

  const SceneComponent = scene.component;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScene}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0"
      >
        <SceneComponent />
      </motion.div>
    </AnimatePresence>
  );
}
