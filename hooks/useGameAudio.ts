"use client";

import { useCallback } from "react";
import { audioManager } from "@/lib/game/audio-manager";
import { getAudioClip } from "@/lib/game/audio-clips";
import type { AudioClipId } from "@/types";

export function useGameAudio() {
  const play = useCallback((clipId: AudioClipId, volumeOverride?: number) => {
    const clip = getAudioClip(clipId);
    if (!clip) return;

    audioManager.play(clipId, {
      channel: clip.channel,
      loop: clip.loop,
      volume: volumeOverride ?? clip.defaultVolume,
    });
  }, []);

  const stop = useCallback((clipId: AudioClipId) => {
    audioManager.stop(clipId);
  }, []);

  const stopChannel = useCallback((channel: "master" | "music" | "sfx" | "ambient") => {
    audioManager.stopChannel(channel);
  }, []);

  return { play, stop, stopChannel };
}
