export type MissionId = "shower" | "lighting" | null;

export type MissionPhase =
  | "idle"
  | "intro"
  | "observe"
  | "inspect"
  | "collect"
  | "repair"
  | "success"
  | "failed";

export type ShowerRepairStep =
  | "rub-nozzle"
  | "find-vinegar"
  | "soak-head"
  | "rinse-head";

export type LightingRepairStep =
  | "check-power"
  | "collect-tools"
  | "test-voltage"
  | "remove-lampshade"
  | "verify-power-off"
  | "diagnose-led"
  | "remove-old-board"
  | "install-new-board"
  | "reinstall-lampshade"
  | "power-on";

export type ShowerPartId = "shower-head" | "water-valve" | "hose" | "nozzle" | null;

export interface ShowerPart {
  id: ShowerPartId;
  name: string;
  description: string;
  function: string;
}

export type RepairPhaseType = "idle" | "rub" | "collect" | "prepare" | "pour-vinegar" | "remove-head" | "soaking" | "reinstall" | "test" | "success";

export type LightingPhaseType = 
  | "idle"
  | "check-power"
  | "neighbor-check"
  | "circuit-box"
  | "power-off"
  | "collect-tools"
  | "tools-collected"
  | "prepare-ladder"
  | "ladder-ready"
  | "test-pen"
  | "pen-tested"
  | "remove-lampshade"
  | "lampshade-off"
  | "verify-power-off"
  | "diagnose-led"
  | "remove-old-board"
  | "old-board-removed"
  | "install-new-board"
  | "board-installed"
  | "reinstall-lampshade"
  | "power-on"
  | "success";

export interface MissionState {
  activeMission: MissionId;
  phase: MissionPhase;
  objective: string;
  failureCount: number;
  lastFailureHint: string | null;
  completedSteps: string[];
  showerObserved: boolean;
  showerInspected: boolean;
  waterSpraying: boolean;
  waterFixed: boolean;
  rubAttempts: number;
  missionStarted: boolean;
  missionComplete: boolean;
  repairPhase: RepairPhaseType;
  currentShowerImage: number;
  usedVinegar: boolean;
  usedPlasticBag: boolean;
}

export interface MissionStateSnapshot {
  activeMission: MissionId;
  phase: MissionPhase;
  objective: string;
  failureCount: number;
  completedSteps: string[];
  showerObserved: boolean;
  showerInspected: boolean;
  waterSpraying: boolean;
  missionStarted: boolean;
  missionComplete: boolean;
}
