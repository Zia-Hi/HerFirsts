import type { AudioClipId, AudioPlayOptions } from "@/types";

export type AudioClipDefinition = {
  id: AudioClipId;
  channel: AudioPlayOptions["channel"];
  description: string;
  loop?: boolean;
  defaultVolume?: number;
};

export const AUDIO_CLIPS: Record<string, AudioClipDefinition> = {
  "ambient-city": {
    id: "ambient-city",
    channel: "ambient",
    description: "Distant city traffic and evening atmosphere",
    loop: true,
    defaultVolume: 0.4,
  },
  "ambient-apartment": {
    id: "ambient-apartment",
    channel: "ambient",
    description: "Quiet apartment room tone with soft air",
    loop: true,
    defaultVolume: 0.35,
  },
  "ambient-bathroom": {
    id: "ambient-bathroom",
    channel: "ambient",
    description: "Bathroom echo and dripping water",
    loop: true,
    defaultVolume: 0.3,
  },
  "door-unlock": {
    id: "door-unlock",
    channel: "sfx",
    description: "Key turning in lock mechanism",
    defaultVolume: 0.3,
  },
  "door-open": {
    id: "door-open",
    channel: "sfx",
    description: "Wooden door creaking open slowly",
    defaultVolume: 0.25,
  },
  "door-creak": {
    id: "door-creak",
    channel: "sfx",
    description: "Drawer or small door creaking sound",
    defaultVolume: 0.3,
  },
  "door-close": {
    id: "door-close",
    channel: "sfx",
    description: "Door closing with soft latch",
    defaultVolume: 0.5,
  },
  "key-jingle": {
    id: "key-jingle",
    channel: "sfx",
    description: "Keys rattling in hand",
    defaultVolume: 0.4,
  },
  "water-spray": {
    id: "water-spray",
    channel: "sfx",
    description: "Shower water spraying uncontrollably",
    loop: true,
    defaultVolume: 0.65,
  },
  "water-drip": {
    id: "water-drip",
    channel: "sfx",
    description: "Single water droplet",
    defaultVolume: 0.3,
  },
  "water-off": {
    id: "water-off",
    channel: "sfx",
    description: "Water valve shutting off",
    defaultVolume: 0.5,
  },
  "footstep-wood": {
    id: "footstep-wood",
    channel: "sfx",
    description: "Soft footstep on wooden floor",
    defaultVolume: 0.35,
  },
  "footstep-tile": {
    id: "footstep-tile",
    channel: "sfx",
    description: "Footstep on bathroom tile",
    defaultVolume: 0.35,
  },
  "paper-rustle": {
    id: "paper-rustle",
    channel: "sfx",
    description: "Notebook page turning",
    defaultVolume: 0.4,
  },
  "box-shift": {
    id: "box-shift",
    channel: "sfx",
    description: "Cardboard moving box sliding",
    defaultVolume: 0.45,
  },
  "toolbox-open": {
    id: "toolbox-open",
    channel: "sfx",
    description: "Metal toolbox latch opening",
    defaultVolume: 0.5,
  },
  "tool-pickup": {
    id: "tool-pickup",
    channel: "sfx",
    description: "Picking up a tool from toolbox",
    defaultVolume: 0.4,
  },
  "wrench-turn": {
    id: "wrench-turn",
    channel: "sfx",
    description: "Adjustable wrench tightening",
    defaultVolume: 0.5,
  },
  "tape-wrap": {
    id: "tape-wrap",
    channel: "sfx",
    description: "Plumber tape wrapping thread",
    defaultVolume: 0.35,
  },
  "electric-shock": {
    id: "electric-shock",
    channel: "sfx",
    description: "Brief electrical shock feedback",
    defaultVolume: 0.6,
  },
  "ui-confirm": {
    id: "ui-confirm",
    channel: "sfx",
    description: "Soft confirmation tone for mission progress",
    defaultVolume: 0.3,
  },
  "ui-error": {
    id: "ui-error",
    channel: "sfx",
    description: "Error feedback sound for invalid actions",
    defaultVolume: 0.35,
  },
  "ui-cancel": {
    id: "ui-cancel",
    channel: "sfx",
    description: "Cancel/close action sound",
    defaultVolume: 0.25,
  },
  "mission-start": {
    id: "mission-start",
    channel: "sfx",
    description: "Gentle mission objective appear sound",
    defaultVolume: 0.35,
  },
  "mission-success": {
    id: "mission-success",
    channel: "sfx",
    description: "Warm completion chime",
    defaultVolume: 0.45,
  },
  "water-pour": {
    id: "water-pour",
    channel: "sfx",
    description: "Pouring liquid from bottle",
    defaultVolume: 0.5,
  },
  "clock-tick": {
    id: "clock-tick",
    channel: "sfx",
    description: "Clock ticking sound",
    loop: true,
    defaultVolume: 0.25,
  },
  "background-music": {
    id: "background-music",
    channel: "music",
    description: "Background music for apartment scene",
    loop: true,
    defaultVolume: 0.6,
  },
} as const;

export type RegisteredAudioClipId = keyof typeof AUDIO_CLIPS;

export function getAudioClip(id: AudioClipId): AudioClipDefinition | undefined {
  return AUDIO_CLIPS[id];
}

export function getAllAudioClips(): AudioClipDefinition[] {
  return Object.values(AUDIO_CLIPS);
}
