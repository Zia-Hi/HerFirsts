import { GAME_STORAGE_KEY, SAVE_VERSION } from "@/lib/game/constants";
import { useApartmentStore } from "./apartment-store";
import { useGameStore } from "./game-store";
import { useInventoryStore } from "./inventory-store";
import { useKnowledgeStore } from "./knowledge-store";
import { useMissionStore } from "./mission-store";
import type { FullSaveSnapshot, SaveData, SaveResult } from "@/types";

class SaveManagerService {
  private storageKey = GAME_STORAGE_KEY;

  hasSave(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(this.storageKey) !== null;
  }

  collectSnapshot(): FullSaveSnapshot {
    return {
      game: useGameStore.getState().getSnapshot(),
      mission: useMissionStore.getState().getSnapshot(),
      inventory: useInventoryStore.getState().getSnapshot(),
      knowledge: useKnowledgeStore.getState().getSnapshot(),
      apartment: useApartmentStore.getState().getSnapshot(),
    };
  }

  save(): SaveResult {
    if (typeof window === "undefined") {
      return { success: false, error: "Storage unavailable" };
    }

    try {
      const data: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state: this.collectSnapshot(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown save error";
      return { success: false, error: message };
    }
  }

  load(): SaveData | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;

      const data = JSON.parse(raw) as SaveData;
      if (data.version !== SAVE_VERSION) return null;
      return data;
    } catch {
      return null;
    }
  }

  applySave(data: SaveData): void {
    const { state } = data;
    useGameStore.getState().hydrate(state.game);
    useMissionStore.getState().hydrate(state.mission);
    useInventoryStore.getState().hydrate(state.inventory);
    useKnowledgeStore.getState().hydrate(state.knowledge);
    useApartmentStore.getState().hydrate(state.apartment);
  }

  clear(): SaveResult {
    if (typeof window === "undefined") {
      return { success: false, error: "Storage unavailable" };
    }

    try {
      localStorage.removeItem(this.storageKey);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown clear error";
      return { success: false, error: message };
    }
  }

  getMetadata(): Pick<SaveData, "version" | "timestamp"> | null {
    const data = this.load();
    if (!data) return null;
    return { version: data.version, timestamp: data.timestamp };
  }
}

export const saveManager = new SaveManagerService();
