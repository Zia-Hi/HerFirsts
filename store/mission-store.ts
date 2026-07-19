import { create } from "zustand";
import {
  FAILURE_HINTS,
  MAX_MISSION_FAILURES,
  SHOWER_MISSION_OBJECTIVES,
  SHOWER_REPAIR_ORDER,
} from "@/lib/game/apartment-layout";
import type {
  MissionId,
  MissionPhase,
  MissionState,
  MissionStateSnapshot,
  ShowerRepairStep,
} from "@/types";

const initialState: MissionState = {
  activeMission: null,
  phase: "idle",
  objective: "",
  failureCount: 0,
  lastFailureHint: null,
  completedSteps: [],
  showerObserved: false,
  showerInspected: false,
  waterSpraying: false,
  waterFixed: false,
  rubAttempts: 0,
  missionStarted: false,
  missionComplete: false,
  repairPhase: "idle" as "idle" | "rub" | "collect" | "prepare" | "pour-vinegar" | "remove-head" | "soaking" | "reinstall" | "test" | "success",
  currentShowerImage: 1,
  usedVinegar: false,
  usedPlasticBag: false,
};

interface MissionStoreActions {
  startShowerMission: () => void;
  setPhase: (phase: MissionPhase) => void;
  setObjective: (objective: string) => void;
  observeShower: () => void;
  inspectShower: () => void;
  setWaterSpraying: (spraying: boolean) => void;
  setWaterFixed: (fixed: boolean) => void;
  addRubAttempt: () => void;
  attemptRepairStep: (step: ShowerRepairStep) => { success: boolean; hint?: string };
  recordFailure: (hint: string) => boolean;
  clearFailureHint: () => void;
  completeMission: () => void;
  resetMission: () => void;
  getSnapshot: () => MissionStateSnapshot;
  hydrate: (state: Partial<MissionState>) => void;
  setRepairPhase: (phase: MissionState["repairPhase"]) => void;
  setCurrentShowerImage: (image: number) => void;
  setUsedVinegar: (used: boolean) => void;
  setUsedPlasticBag: (used: boolean) => void;
}

export const useMissionStore = create<MissionState & MissionStoreActions>((set, get) => ({
  ...initialState,

  startShowerMission: () =>
    set({
      ...initialState,
      activeMission: "shower",
      phase: "intro",
      objective: SHOWER_MISSION_OBJECTIVES.intro,
      missionStarted: true,
      waterSpraying: false,
    }),

  setPhase: (phase) => set({ phase }),

  setObjective: (objective) => set({ objective }),

  observeShower: () =>
    set({
      showerObserved: true,
      phase: "inspect",
      objective: SHOWER_MISSION_OBJECTIVES.inspect,
    }),

  inspectShower: () =>
    set({
      showerInspected: true,
      phase: "repair",
      objective: SHOWER_MISSION_OBJECTIVES.repair,
    }),

  setWaterSpraying: (waterSpraying) => set({ waterSpraying }),

  setWaterFixed: (waterFixed) => set({ waterFixed }),

  addRubAttempt: () =>
    set((state) => ({ rubAttempts: state.rubAttempts + 1 })),

  attemptRepairStep: (step) => {
    const state = get();
    const nextExpected = SHOWER_REPAIR_ORDER[state.completedSteps.length];

    if (step !== nextExpected) {
      return { success: false, hint: FAILURE_HINTS.wrongOrder };
    }

    const completedSteps = [...state.completedSteps, step];
    const isComplete = completedSteps.length === SHOWER_REPAIR_ORDER.length;

    set({
      completedSteps,
      phase: isComplete ? "success" : "repair",
      objective: isComplete
        ? SHOWER_MISSION_OBJECTIVES.success
        : SHOWER_MISSION_OBJECTIVES.repair,
      missionComplete: isComplete,
      waterFixed: step === "rinse-head",
    });

    return { success: true };
  },

  recordFailure: (hint) => {
    const failureCount = get().failureCount + 1;
    const shouldRestart = failureCount >= MAX_MISSION_FAILURES;

    if (shouldRestart) {
      set({
        ...initialState,
        activeMission: "shower",
        phase: "intro",
        objective: SHOWER_MISSION_OBJECTIVES.intro,
        missionStarted: true,
        waterSpraying: true,
        failureCount: 0,
        lastFailureHint: FAILURE_HINTS.maxFailures,
      });
      return true;
    }

    set({ failureCount, lastFailureHint: hint });
    return false;
  },

  clearFailureHint: () => set({ lastFailureHint: null }),

  completeMission: () =>
    set({
      phase: "success",
      missionComplete: true,
      waterSpraying: false,
      waterFixed: true,
      objective: SHOWER_MISSION_OBJECTIVES.success,
    }),

  resetMission: () => set({ ...initialState }),

  setRepairPhase: (repairPhase) => set({ repairPhase }),

  setCurrentShowerImage: (currentShowerImage) => set({ currentShowerImage }),

  setUsedVinegar: (usedVinegar) => set({ usedVinegar }),

  setUsedPlasticBag: (usedPlasticBag) => set({ usedPlasticBag }),

  getSnapshot: () => {
    const {
      activeMission,
      phase,
      objective,
      failureCount,
      completedSteps,
      showerObserved,
      showerInspected,
      waterSpraying,
      waterFixed,
      rubAttempts,
      missionStarted,
      missionComplete,
    } = get();
    return {
      activeMission,
      phase,
      objective,
      failureCount,
      completedSteps,
      showerObserved,
      showerInspected,
      waterSpraying,
      waterFixed,
      rubAttempts,
      missionStarted,
      missionComplete,
    };
  },

  hydrate: (state) => set((current) => ({ ...current, ...state })),
}));
