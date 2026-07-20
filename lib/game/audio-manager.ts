import type { AudioChannelConfig, AudioChannelId, AudioClipId, AudioPlayOptions } from "@/types";
import { getAudioClip } from "./audio-clips";
import { DEFAULT_SETTINGS } from "./constants";

const CHANNEL_IDS: AudioChannelId[] = ["master", "music", "sfx", "ambient"];

function createChannel(id: AudioChannelId, volume: number): AudioChannelConfig {
  return { id, volume, muted: false };
}

interface ActiveSound {
  clipId: AudioClipId;
  options: AudioPlayOptions;
  nodes: AudioNode[];
  audioElement?: HTMLAudioElement;
  stopFn?: () => void;
}

class AudioManagerService {
  private channels = new Map<AudioChannelId, AudioChannelConfig>();
  private activeSounds = new Map<AudioClipId, ActiveSound>();
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private channelGains = new Map<AudioChannelId, GainNode>();
  private initialized = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmFadeTimer: number | null = null;

  initialize(): void {
    if (this.initialized) return;

    this.channels.set("master", createChannel("master", DEFAULT_SETTINGS.masterVolume));
    this.channels.set("music", createChannel("music", DEFAULT_SETTINGS.musicVolume));
    this.channels.set("sfx", createChannel("sfx", DEFAULT_SETTINGS.sfxVolume));
    this.channels.set("ambient", createChannel("ambient", DEFAULT_SETTINGS.ambientVolume));

    if (typeof window !== "undefined") {
      this.ensureContext();
    }

    this.initialized = true;
  }

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);

      for (const id of CHANNEL_IDS) {
        const gain = this.context.createGain();
        gain.connect(this.masterGain);
        this.channelGains.set(id, gain);
      }

      this.applyChannelVolumes();
    }
    return this.context;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getChannel(channelId: AudioChannelId): AudioChannelConfig | undefined {
    return this.channels.get(channelId);
  }

  setChannelVolume(channelId: AudioChannelId, volume: number): void {
    const channel = this.channels.get(channelId);
    if (!channel) return;

    this.channels.set(channelId, {
      ...channel,
      volume: Math.max(0, Math.min(1, volume)),
    });
    this.applyChannelVolumes();
  }

  setChannelMuted(channelId: AudioChannelId, muted: boolean): void {
    const channel = this.channels.get(channelId);
    if (!channel) return;
    this.channels.set(channelId, { ...channel, muted });
    this.applyChannelVolumes();
  }

  applySettings(settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    ambientVolume: number;
  }): void {
    this.setChannelVolume("master", settings.masterVolume);
    this.setChannelVolume("music", settings.musicVolume);
    this.setChannelVolume("sfx", settings.sfxVolume);
    this.setChannelVolume("ambient", settings.ambientVolume);
  }

  private applyChannelVolumes(): void {
    if (!this.context || !this.masterGain) return;

    const master = this.channels.get("master");
    this.masterGain.gain.value = master?.muted ? 0 : (master?.volume ?? 1);

    for (const id of CHANNEL_IDS) {
      const gain = this.channelGains.get(id);
      const channel = this.channels.get(id);
      if (gain && channel) {
        gain.gain.value = channel.muted ? 0 : channel.volume;
      }
    }
  }

  private getChannelGain(channelId: AudioChannelId): GainNode | null {
    this.ensureContext();
    return this.channelGains.get(channelId) ?? null;
  }

  unlock(): void {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
  }

  play(clipId: AudioClipId, options: AudioPlayOptions): void {
    if (typeof window === "undefined") return;

    this.initialize();
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const clipDef = getAudioClip(clipId);
    const channel = options.channel ?? clipDef?.channel ?? "sfx";
    const volume = options.volume ?? clipDef?.defaultVolume ?? 0.5;
    const loop = options.loop ?? clipDef?.loop ?? false;

    const channelGain = this.getChannelGain(channel);
    if (!channelGain) return;

    if (clipId === "background-music") {
      if (this.bgmAudio && !this.bgmAudio.paused) {
        return;
      }
      this.playBackgroundMusic(ctx, channelGain, volume, loop);
      return;
    }

    this.stop(clipId);

    const { nodes, stopFn } = this.synthesizeClip(clipId, ctx, channelGain, volume, loop);

    this.activeSounds.set(clipId, {
      clipId,
      options: { channel, loop, volume },
      nodes,
      stopFn,
    });
  }

  private playBackgroundMusic(
    ctx: AudioContext,
    destination: GainNode,
    volume: number,
    loop: boolean,
  ): void {
    try {
      if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio = null;
      }

      const audio = new Audio("/audio/music.mp4");
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";

      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      gain.gain.value = 0;

      source.connect(gain);
      gain.connect(destination);

      const fadeDuration = 2;

      const handleTimeUpdate = () => {
        if (!audio.duration) return;

        const remaining = audio.duration - audio.currentTime;

        if (remaining <= fadeDuration && remaining > 0) {
          const fadeProgress = (fadeDuration - remaining) / fadeDuration;
          gain.gain.setTargetAtTime(volume * (1 - fadeProgress), ctx.currentTime, 0.05);
        } else if (audio.currentTime < fadeDuration) {
          const fadeInProgress = audio.currentTime / fadeDuration;
          gain.gain.setTargetAtTime(volume * fadeInProgress, ctx.currentTime, 0.05);
        } else {
          gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
        }
      };

      const handleEnded = () => {
        if (!loop) return;
        
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
        
        setTimeout(() => {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }, fadeDuration * 1000);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.loop = false;

      audio.play().catch((error) => {
        console.warn("Auto-play blocked, waiting for user interaction:", error);
      });

      this.bgmAudio = audio;

      this.activeSounds.set("background-music", {
        clipId: "background-music",
        options: { channel: "music", loop, volume },
        nodes: [gain, source],
        audioElement: audio,
        stopFn: () => {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
          audio.removeEventListener("ended", handleEnded);
          audio.pause();
          audio.currentTime = 0;
          source.disconnect();
          gain.disconnect();
          this.bgmAudio = null;
        },
      });
    } catch (error) {
      console.warn("Failed to load background music:", error);
    }
  }

  private async playFileAudio(
    clipId: AudioClipId,
    ctx: AudioContext,
    destination: GainNode,
    volume: number,
    loop: boolean,
    filePath: string,
  ): Promise<{ nodes: AudioNode[]; stopFn?: () => void }> {
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(destination);
    const nodes: AudioNode[] = [gain];

    try {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = loop;
      source.connect(gain);
      source.start();
      nodes.push(source);

      return {
        nodes,
        stopFn: () => {
          source.stop();
          source.disconnect();
        },
      };
    } catch {
      return { nodes };
    }
  }

  private synthesizeClip(
    clipId: AudioClipId,
    ctx: AudioContext,
    destination: GainNode,
    volume: number,
    loop: boolean,
  ): { nodes: AudioNode[]; stopFn?: () => void } {
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(destination);
    const nodes: AudioNode[] = [gain];

    const now = ctx.currentTime;

    const playTone = (
      freq: number,
      duration: number,
      type: OscillatorType = "sine",
      attack = 0.02,
      release = 0.1,
    ) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(1, now + attack);
      env.gain.linearRampToValueAtTime(0, now + duration + release);
      osc.connect(env);
      env.connect(gain);
      osc.start(now);
      osc.stop(now + duration + release + 0.01);
      nodes.push(osc, env);
    };

    const playNoise = (duration: number, filterFreq = 800) => {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = filterFreq;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.4, now);
      env.gain.linearRampToValueAtTime(0, now + duration);
      source.connect(filter);
      filter.connect(env);
      env.connect(gain);
      source.start(now);
      source.stop(now + duration);
      nodes.push(source, filter, env);
    };

    switch (clipId) {
      case "ambient-city":
      case "ambient-apartment":
      case "ambient-bathroom": {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = clipId === "ambient-city" ? 80 : 60;
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = clipId === "ambient-city" ? 8 : 4;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        osc.start();
        lfo.start();
        playNoise(0.5, clipId === "ambient-bathroom" ? 1200 : 400);
        const interval = setInterval(() => playNoise(0.3, 600), 2000);
        nodes.push(osc, lfo, lfoGain);
        return {
          nodes,
          stopFn: () => {
            clearInterval(interval);
            osc.stop();
            lfo.stop();
          },
        };
      }
      case "water-spray": {
        const interval = setInterval(() => playNoise(0.4, 2000), 200);
        if (loop) {
          return { nodes, stopFn: () => clearInterval(interval) };
        }
        break;
      }
      case "door-unlock":
        playTone(200, 0.1, "triangle");
        playTone(350, 0.15, "triangle");
        break;
      case "door-open":
        playNoise(0.6, 300);
        playTone(120, 0.4, "sine");
        break;
      case "key-jingle":
        playTone(800, 0.05, "triangle");
        playTone(1200, 0.05, "triangle");
        playTone(600, 0.05, "triangle");
        break;
      case "water-off":
        playTone(150, 0.2, "sine");
        playNoise(0.2, 500);
        break;
      case "footstep-wood":
      case "footstep-tile":
        playNoise(0.08, clipId === "footstep-tile" ? 1500 : 600);
        playTone(100, 0.05, "sine");
        break;
      case "paper-rustle":
        playNoise(0.3, 3000);
        break;
      case "box-shift":
        playNoise(0.25, 400);
        playTone(80, 0.15, "sine");
        break;
      case "toolbox-open":
        playTone(300, 0.1, "square");
        playNoise(0.15, 800);
        break;
      case "tool-pickup":
        playTone(500, 0.08, "triangle");
        break;
      case "wrench-turn":
        playTone(180, 0.1, "sawtooth");
        playTone(200, 0.1, "sawtooth");
        break;
      case "tape-wrap":
        playNoise(0.2, 2500);
        break;
      case "electric-shock":
        playTone(60, 0.05, "square");
        playTone(120, 0.05, "square");
        playNoise(0.15, 4000);
        break;
      case "ui-confirm":
        playTone(440, 0.15, "sine");
        playTone(554, 0.2, "sine");
        break;
      case "mission-start":
        playTone(330, 0.2, "sine");
        playTone(392, 0.3, "sine");
        break;
      case "mission-success":
        playTone(392, 0.2, "sine");
        playTone(494, 0.2, "sine");
        playTone(587, 0.4, "sine");
        break;
      case "clock-tick": {
        const tickInterval = setInterval(() => {
          playTone(800, 0.03, "square");
        }, 1000);
        if (loop) {
          return { nodes, stopFn: () => clearInterval(tickInterval) };
        }
        break;
      }
      default:
        playTone(440, 0.1, "sine");
    }

    return { nodes };
  }

  stop(clipId: AudioClipId): void {
    const active = this.activeSounds.get(clipId);
    if (!active) return;

    if (active.audioElement) {
      try {
        active.audioElement.pause();
        active.audioElement.currentTime = 0;
      } catch {
        /* ignore */
      }
    }

    active.stopFn?.();
    for (const node of active.nodes) {
      try {
        if ("stop" in node && typeof node.stop === "function") {
          node.stop();
        }
        node.disconnect();
      } catch {
        /* already stopped */
      }
    }
    this.activeSounds.delete(clipId);
  }

  stopChannel(channelId: AudioChannelId): void {
    for (const [clipId, active] of this.activeSounds.entries()) {
      if (active.options.channel === channelId) {
        this.stop(clipId);
      }
    }
  }

  stopAll(): void {
    for (const clipId of this.activeSounds.keys()) {
      this.stop(clipId);
    }
  }

  isPlaying(clipId: AudioClipId): boolean {
    const active = this.activeSounds.get(clipId);
    if (!active) return false;
    if (active.audioElement) {
      return !active.audioElement.paused;
    }
    return true;
  }

  dispose(): void {
    this.stopAll();
    this.channels.clear();
    if (this.context) {
      void this.context.close();
      this.context = null;
      this.masterGain = null;
      this.channelGains.clear();
    }
    this.initialized = false;
  }
}

export const audioManager = new AudioManagerService();