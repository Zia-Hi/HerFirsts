export type AudioChannelId = "master" | "music" | "sfx" | "ambient";

export type AudioClipId = string;

export interface AudioChannelConfig {
  id: AudioChannelId;
  volume: number;
  muted: boolean;
}

export interface AudioPlayOptions {
  channel: AudioChannelId;
  loop?: boolean;
  volume?: number;
}
