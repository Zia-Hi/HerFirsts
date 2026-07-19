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

  useEffect(() => {
    const handlePlay = () => {
      if (!audioManager.isPlaying("background-music")) {
        audioManager.play("background-music", {
          channel: "music",
          loop: true,
          volume: 0.6,
        });
      }
    };

    const handleFirstInteraction = () => {
      handlePlay();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  return null;
}
