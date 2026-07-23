export {
  GAME_STORAGE_KEY,
  SAVE_VERSION,
  DEFAULT_SETTINGS,
  FADE_DURATION_MS,
  SCENE_LOAD_DELAY_MS,
  CAMERA_DEFAULTS,
  CAMERA_TRANSITION,
} from "./constants";
export { registerScene, unregisterScene, getScene, getAllScenes, hasScene, clearScenes } from "./scene-registry";
export { getFadeDuration, getSceneLoadDelay, wait } from "./transition";
export { audioManager } from "./audio-manager";
export { interactionManager } from "./interaction-manager";
export { AUDIO_CLIPS, getAudioClip, getAllAudioClips } from "./audio-clips";
export {
  APARTMENT_ROOMS,
  SHOWER_REPAIR_ORDER,
  SHOWER_MISSION_OBJECTIVES,
  FAILURE_HINTS,
  SHOWER_PARTS,
  MAX_MISSION_FAILURES,
  getRoom,
  getConnectedRooms,
  canNavigate,
} from "./apartment-layout";
export { TOOL_DEFINITIONS, TOOLBOX_TOOLS, REQUIRED_SHOWER_TOOLS, getTool, isRequiredForShower } from "./tools";
export { inventoryManager } from "./inventory-manager";
export { knowledgeManager } from "./knowledge-manager";

export const SCENE_IDS = {
  LANDING_ANIMATION: "landing-animation",
  GAME_HOMEPAGE: "game-homepage",
  OPENING: "opening",
  APARTMENT: "apartment",
  SHOWER_MISSION: "shower-mission",
  KITCHEN: "kitchen",
  MISSION_COMPLETED: "mission-completed",
  WIFI_MISSION: "wifi-mission",
  WIFI_MISSION_COMPLETED: "wifi-mission-completed",
  LIGHTING_MISSION: "lighting-mission",
  LIGHTING_MISSION_COMPLETED: "lighting-mission-completed",
  LIVING_ROOM_TOOLBOX: "living-room-toolbox",
  OFFICE_OPENING: "office-opening",
  OFFICE: "office",
  OFFICE_MISSION: "office-mission",
  OFFICE_MISSION_COMPLETED: "office-mission-completed",
  HOTEL_OPENING: "hotel-opening",
  HOTEL: "hotel",
  HOTEL_ROOM: "hotel-room",
  HOTEL_MISSION: "hotel-mission",
  HOTEL_MISSION_COMPLETED: "hotel-mission-completed",
  FORUM: "forum",
} as const;
