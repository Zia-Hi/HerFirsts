"use client";

import { useEffect } from "react";
import { LandingAnimationScene } from "@/components/game/scenes/LandingAnimationScene";
import { GameHomepageScene } from "@/components/game/scenes/GameHomepageScene";
import { OpeningScene } from "@/components/game/scenes/OpeningScene";
import { ApartmentScene } from "@/components/game/scenes/ApartmentScene";
import { ShowerMissionScene } from "@/components/game/scenes/ShowerMissionScene";
import { KitchenScene } from "@/components/game/scenes/KitchenScene";
import { MissionCompletedScene } from "@/components/game/scenes/MissionCompletedScene";
import { WifiMissionScene } from "@/components/game/scenes/WifiMissionScene";
import { WifiMissionCompletedScene } from "@/components/game/scenes/WifiMissionCompletedScene";
import { LightingMissionScene } from "@/components/game/scenes/LightingMissionScene";
import { LightingMissionCompletedScene } from "@/components/game/scenes/LightingMissionCompletedScene";
import { LivingRoomToolboxScene } from "@/components/game/scenes/LivingRoomToolboxScene";
import { OfficeOpeningScene } from "@/components/game/scenes/OfficeOpeningScene";
import { OfficeScene } from "@/components/game/scenes/OfficeScene";
import { OfficeMissionScene } from "@/components/game/scenes/OfficeMissionScene";
import { OfficeMissionCompletedScene } from "@/components/game/scenes/OfficeMissionCompletedScene";
import { HotelOpeningScene } from "@/components/game/scenes/HotelOpeningScene";
import { HotelScene } from "@/components/game/scenes/HotelScene";
import { HotelRoomScene } from "@/components/game/scenes/HotelRoomScene";
import { HotelMissionScene } from "@/components/game/scenes/HotelMissionScene";
import { HotelMissionCompletedScene } from "@/components/game/scenes/HotelMissionCompletedScene";
import { registerScene, SCENE_IDS, GAME_STORAGE_KEY } from "@/lib/game";
import { audioManager } from "@/lib/game/audio-manager";
import { saveManager, useGameStore } from "@/store";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useSceneTransition } from "@/hooks/useSceneTransition";

function registerAllScenes() {
  registerScene({ id: SCENE_IDS.LANDING_ANIMATION, component: LandingAnimationScene });
  registerScene({ id: SCENE_IDS.GAME_HOMEPAGE, component: GameHomepageScene });
  registerScene({ id: SCENE_IDS.OPENING, component: OpeningScene });
  registerScene({ id: SCENE_IDS.APARTMENT, component: ApartmentScene });
  registerScene({ id: SCENE_IDS.SHOWER_MISSION, component: ShowerMissionScene });
  registerScene({ id: SCENE_IDS.KITCHEN, component: KitchenScene });
  registerScene({ id: SCENE_IDS.MISSION_COMPLETED, component: MissionCompletedScene });
  registerScene({ id: SCENE_IDS.WIFI_MISSION, component: WifiMissionScene });
  registerScene({ id: SCENE_IDS.WIFI_MISSION_COMPLETED, component: WifiMissionCompletedScene });
  registerScene({ id: SCENE_IDS.LIGHTING_MISSION, component: LightingMissionScene });
  registerScene({ id: SCENE_IDS.LIGHTING_MISSION_COMPLETED, component: LightingMissionCompletedScene });
  registerScene({ id: SCENE_IDS.LIVING_ROOM_TOOLBOX, component: LivingRoomToolboxScene });
  registerScene({ id: SCENE_IDS.OFFICE_OPENING, component: OfficeOpeningScene });
  registerScene({ id: SCENE_IDS.OFFICE, component: OfficeScene });
  registerScene({ id: SCENE_IDS.OFFICE_MISSION, component: OfficeMissionScene });
  registerScene({ id: SCENE_IDS.OFFICE_MISSION_COMPLETED, component: OfficeMissionCompletedScene });
  registerScene({ id: SCENE_IDS.HOTEL_OPENING, component: HotelOpeningScene });
  registerScene({ id: SCENE_IDS.HOTEL, component: HotelScene });
  registerScene({ id: SCENE_IDS.HOTEL_ROOM, component: HotelRoomScene });
  registerScene({ id: SCENE_IDS.HOTEL_MISSION, component: HotelMissionScene });
  registerScene({ id: SCENE_IDS.HOTEL_MISSION_COMPLETED, component: HotelMissionCompletedScene });
}

let scenesRegistered = false;
let audioInitialized = false;

export function GameBootstrap() {
  const saveLoaded = useGameStore((s) => s.saveLoaded);
  const setSaveLoaded = useGameStore((s) => s.setSaveLoaded);
  const toggleDevMode = useGameStore((s) => s.toggleDevMode);
  const completeAllMissions = useGameStore((s) => s.completeAllMissions);
  const { transitionToScene } = useSceneTransition();

  useAutoSave(saveLoaded);

  useEffect(() => {
    if (!scenesRegistered) {
      registerAllScenes();
      scenesRegistered = true;
    }

    saveManager.clear();
    localStorage.removeItem(GAME_STORAGE_KEY);
    
    const savedData = saveManager.load();
    if (savedData) {
      saveManager.applySave(savedData);
      console.log("📂 Save data loaded successfully");
    }
    setSaveLoaded(true);
    void transitionToScene(SCENE_IDS.LANDING_ANIMATION);

    const handleInteraction = (e: Event) => {
      if (!audioInitialized) {
        audioManager.initialize();
        audioInitialized = true;
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && e.shiftKey) {
        e.preventDefault();
        saveManager.clear();
        localStorage.removeItem(GAME_STORAGE_KEY);
        window.location.reload();
      }
      
      if (e.key === "`" && e.altKey) {
        e.preventDefault();
        toggleDevMode();
      }
      
      if (e.key === "0" && e.altKey) {
        e.preventDefault();
        completeAllMissions();
        console.log("🎯 All missions completed!");
      }
      
      handleInteraction(e);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [setSaveLoaded, transitionToScene, toggleDevMode, completeAllMissions]);

  return null;
}