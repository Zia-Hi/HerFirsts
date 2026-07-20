import { create } from "zustand";
import { DEFAULT_SETTINGS } from "@/lib/game/constants";
import type { GamePhase, GameSettings, GameStateSnapshot, SceneId, TransitionState } from "@/types";

interface GameStoreState {
  currentScene: SceneId | null;
  gamePhase: GamePhase;
  transitionState: TransitionState;
  settings: GameSettings;
  saveLoaded: boolean;
  playerHasControl: boolean;
  welcomeShown: boolean;
  inventoryHintShown: boolean;
  completedMissions: string[];
  isFirstMenu: boolean;
  mission2Started: boolean;
  mission4Started: boolean;
  lightingEventShown: boolean;
  lightingToolsCollected: boolean;
  lightingPrecautionShown: boolean;
  chapter1LetterPending: boolean;
  chapter1LetterShown: boolean;
  devMode: boolean;
}

interface GameStoreActions {
  setCurrentScene: (scene: SceneId | null) => void;
  setGamePhase: (phase: GamePhase) => void;
  setTransitionState: (state: TransitionState) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setSaveLoaded: (loaded: boolean) => void;
  setPlayerHasControl: (hasControl: boolean) => void;
  setWelcomeShown: (shown: boolean) => void;
  setInventoryHintShown: (shown: boolean) => void;
  addCompletedMission: (missionId: string) => void;
  setIsFirstMenu: (isFirst: boolean) => void;
  setMission2Started: (started: boolean) => void;
  setMission4Started: (started: boolean) => void;
  setLightingEventShown: (shown: boolean) => void;
  setLightingToolsCollected: (collected: boolean) => void;
  setLightingPrecautionShown: (shown: boolean) => void;
  setChapter1LetterPending: (pending: boolean) => void;
  setChapter1LetterShown: (shown: boolean) => void;
  getSnapshot: () => GameStateSnapshot;
  hydrate: (state: Partial<GameStoreState>) => void;
  reset: () => void;
  toggleDevMode: () => void;
  completeAllMissions: () => void;
}

const initialState: GameStoreState = {
  currentScene: null,
  gamePhase: "idle",
  transitionState: "idle",
  settings: DEFAULT_SETTINGS,
  saveLoaded: false,
  playerHasControl: false,
  welcomeShown: false,
  inventoryHintShown: false,
  completedMissions: [],
  isFirstMenu: true,
  mission2Started: false,
  mission4Started: false,
  lightingEventShown: false,
  lightingToolsCollected: false,
  lightingPrecautionShown: false,
  chapter1LetterPending: false,
  chapter1LetterShown: false,
  devMode: false,
};

export const useGameStore = create<GameStoreState & GameStoreActions>((set, get) => ({
  ...initialState,

  setCurrentScene: (currentScene) => set({ currentScene }),

  setGamePhase: (gamePhase) => set({ gamePhase }),

  setTransitionState: (transitionState) => set({ transitionState }),

  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  setSaveLoaded: (saveLoaded) => set({ saveLoaded }),

  setPlayerHasControl: (playerHasControl) => set({ playerHasControl }),

  setWelcomeShown: (welcomeShown) => set({ welcomeShown }),

  setInventoryHintShown: (inventoryHintShown) => set({ inventoryHintShown }),

  addCompletedMission: (missionId) =>
    set((state) => ({
      completedMissions: [...new Set([...state.completedMissions, missionId])],
    })),

  setIsFirstMenu: (isFirstMenu) => set({ isFirstMenu }),

  setMission2Started: (mission2Started) => set({ mission2Started }),

  setMission4Started: (mission4Started) => set({ mission4Started }),

  setLightingEventShown: (lightingEventShown) => set({ lightingEventShown }),

  setLightingToolsCollected: (lightingToolsCollected) => set({ lightingToolsCollected }),

  setLightingPrecautionShown: (lightingPrecautionShown) => set({ lightingPrecautionShown }),

  setChapter1LetterPending: (chapter1LetterPending) => set({ chapter1LetterPending }),

  setChapter1LetterShown: (chapter1LetterShown) => set({ chapter1LetterShown }),

  getSnapshot: () => {
    const { currentScene, gamePhase, settings, completedMissions, isFirstMenu, inventoryHintShown, lightingEventShown, lightingToolsCollected, lightingPrecautionShown, mission4Started } = get();
    return { currentScene, gamePhase, settings, completedMissions, isFirstMenu, inventoryHintShown, lightingEventShown, lightingToolsCollected, lightingPrecautionShown, mission4Started };
  },

  hydrate: (state) =>
    set((current) => ({
      ...current,
      ...state,
      settings: { ...DEFAULT_SETTINGS, ...(state.settings || {}) },
    })),

  reset: () => set({ ...initialState }),

  toggleDevMode: () =>
    set((state) => {
      const newDevMode = !state.devMode;
      if (newDevMode) {
        console.log("🔧 Dev Mode enabled! All chapters and missions unlocked.");
      } else {
        console.log("🔧 Dev Mode disabled.");
      }
      return { devMode: newDevMode };
    }),

  completeAllMissions: () =>
    set({
      completedMissions: ["mission-1", "mission-2", "mission-3"],
    }),
}));
