"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Volume2, VolumeX, X } from "lucide-react";
import { audioManager } from "@/lib/game/audio-manager";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [musicVolume, setMusicVolume] = useState(0.6);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
    audioManager.setChannelVolume("music", value);
  };

  const toggleMusicMute = () => {
    setIsMusicMuted(!isMusicMuted);
    audioManager.setChannelMuted("music", !isMusicMuted);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-md bg-[#f5e6d3] rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-game-serif text-[#4a3a2a] flex items-center gap-2">
                <Settings size={20} />
                设置
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-game-serif text-[#5d4a37]">背景音乐</span>
                  <button
                    type="button"
                    onClick={toggleMusicMute}
                    className={`p-2 rounded-lg transition-colors ${
                      isMusicMuted ? "bg-gray-200" : "bg-[#5d4a37]/20"
                    }`}
                  >
                    {isMusicMuted ? (
                      <VolumeX className="text-gray-500" size={20} />
                    ) : (
                      <Volume2 className="text-[#5d4a37]" size={20} />
                    )}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMusicMuted ? 0 : musicVolume}
                  onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5d4a37]"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>静音</span>
                  <span>{Math.round((isMusicMuted ? 0 : musicVolume) * 100)}%</span>
                  <span>最大</span>
                </div>
              </div>

              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-game-serif text-[#5d4a37]">音效</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  defaultValue={0.7}
                  onChange={(e) => audioManager.setChannelVolume("sfx", parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5d4a37]"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>静音</span>
                  <span>50%</span>
                  <span>最大</span>
                </div>
              </div>

              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-game-serif text-[#5d4a37]">环境音</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  defaultValue={0.4}
                  onChange={(e) => audioManager.setChannelVolume("ambient", parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5d4a37]"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>静音</span>
                  <span>50%</span>
                  <span>最大</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-6 py-3 bg-[#5d4a37] text-white rounded-xl hover:bg-[#4a3a2a] transition-colors font-game-serif"
            >
              关闭
            </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function SettingsButton({ onClick, className = "absolute right-4 top-20 z-30 flex flex-col items-center hover:scale-110 transition-transform" }: { onClick: () => void; className?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
        <Settings className="text-[#5d4a37]" size={20} />
      </div>
      <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
        Settings
      </span>
    </motion.button>
  );
}