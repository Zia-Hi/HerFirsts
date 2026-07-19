export type SceneId = string;

export type GamePhase =
  | "idle"
  | "opening"
  | "apartment"
  | "mission"
  | "knowledge-card"
  | "transition";

export type TransitionState = "idle" | "fade-out" | "fade-in" | "loading";

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  reducedMotion: boolean;
}

export interface GameStateSnapshot {
  currentScene: SceneId | null;
  gamePhase: GamePhase;
  settings: GameSettings;
  completedMissions?: string[];
  isFirstMenu?: boolean;
  inventoryHintShown?: boolean;
  lightingEventShown?: boolean;
}
