export type { SceneId, GamePhase, TransitionState, GameSettings, GameStateSnapshot } from "./game";
export type { SceneDefinition } from "./scene";
export type { CameraState, CameraSwayOptions, CameraZoomOptions, CameraShakeOptions } from "./camera";
export type { AudioChannelId, AudioClipId, AudioChannelConfig, AudioPlayOptions } from "./audio";
export type { InteractableId, InteractionBounds, Interactable, InteractionHit } from "./interaction";
export type { SaveData, SaveResult, FullSaveSnapshot } from "./save";
export type {
  MissionId,
  MissionPhase,
  ShowerRepairStep,
  LightingRepairStep,
  ShowerPartId,
  ShowerPart,
  MissionState,
  MissionStateSnapshot,
  LightingPhaseType,
} from "./mission";
export type { ToolId, ToolDefinition, InventoryItem, InventoryState, InventorySnapshot } from "./inventory";
export type { KnowledgeCard, KnowledgeState } from "./knowledge";
export type { RoomId, RoomBounds, RoomDefinition, ApartmentState } from "./apartment";
export type { OpeningPhase } from "./opening";

export interface Vector2 {
  x: number;
  y: number;
}

export interface GameDimensions {
  width: number;
  height: number;
}
