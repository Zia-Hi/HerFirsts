import type { GameStateSnapshot } from "./game";
import type { InventorySnapshot } from "./inventory";
import type { KnowledgeCard } from "./knowledge";
import type { MissionStateSnapshot } from "./mission";
import type { RoomId } from "./apartment";

export interface FullSaveSnapshot {
  game: GameStateSnapshot;
  mission: MissionStateSnapshot;
  inventory: InventorySnapshot;
  knowledge: KnowledgeCard[];
  apartment: {
    currentRoom: RoomId;
    visitedRooms: RoomId[];
  };
}

export interface SaveData {
  version: number;
  timestamp: number;
  state: FullSaveSnapshot;
}

export interface SaveResult {
  success: boolean;
  error?: string;
}
