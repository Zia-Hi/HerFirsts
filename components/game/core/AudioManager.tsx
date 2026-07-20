"use client";

import { useEffect } from "react";
import { audioManager } from "@/lib/game/audio-manager";
import { useGameSettings } from "@/hooks/useGameStore";

export function AudioManager() {
  const settings = useGameSettings();

  useEffect(() => {
    audioManager.initialize();
    return () => {
      audioManager.dispose();
    };
  }, []);

  useEffect(() => {
    if (!audioManager.isInitialized()) {
      return;
    }

    audioManager.applySettings({
      masterVolume: settings.masterVolume,
      musicVolume: settings.musicVolume,
      sfxVolume: settings.sfxVolume,
      ambientVolume: settings.ambientVolume,
    });
  }, [settings]);

  return null;
}
