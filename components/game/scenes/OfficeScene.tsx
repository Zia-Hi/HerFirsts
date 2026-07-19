"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SettingsButton, SettingsPanel, TypewriterSubtitle } from "@/components/game/ui";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { SCENE_IDS } from "@/lib/game";

export function OfficeScene() {
  const [showSettings, setShowSettings] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  const { play } = useGameAudio();
  const { transitionToScene } = useSceneTransition();

  useEffect(() => {
    play("ambient-apartment");
    setSubtitle("Welcome to your new office.");
  }, [play]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full">
        <img
          src="/pinterest/office/office_map.jpg"
          alt="Office"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 100%)",
      }} />

      <div className="absolute top-4 right-4 z-30 flex flex-col gap-4 items-center">
        <motion.button
          type="button"
          onClick={() => {
            play("ui-confirm");
            void transitionToScene(SCENE_IDS.GAME_HOMEPAGE);
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="返回主页"
        >
          <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5d4a37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
            Home
          </span>
        </motion.button>

        <SettingsButton
          onClick={() => setShowSettings(true)}
          className="relative flex flex-col items-center hover:scale-110 transition-transform"
        />
      </div>

      <TypewriterSubtitle text={subtitle} />

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}