import type { SceneDefinition, SceneId } from "@/types";

const scenes = new Map<SceneId, SceneDefinition>();

export function registerScene(scene: SceneDefinition): void {
  scenes.set(scene.id, scene);
}

export function unregisterScene(sceneId: SceneId): void {
  scenes.delete(sceneId);
}

export function getScene(sceneId: SceneId): SceneDefinition | undefined {
  return scenes.get(sceneId);
}

export function getAllScenes(): SceneDefinition[] {
  return Array.from(scenes.values());
}

export function hasScene(sceneId: SceneId): boolean {
  return scenes.has(sceneId);
}

export function clearScenes(): void {
  scenes.clear();
}
