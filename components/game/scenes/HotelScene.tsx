"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KnowledgeNotebook, LetterModal, SettingsButton, SettingsPanel, TypewriterSubtitle } from "@/components/game/ui";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameStore, useKnowledgeStore } from "@/store";
import { SCENE_IDS } from "@/lib/game";

export function HotelScene() {
  const [showSettings, setShowSettings] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const [isLetterAutoOpen, setIsLetterAutoOpen] = useState(false);

  const { play } = useGameAudio();
  const { transitionToScene } = useSceneTransition();
  const completedMissions = useGameStore((s) => s.completedMissions);
  const chapter3LetterPending = useGameStore((s) => s.chapter3LetterPending);
  const chapter3LetterShown = useGameStore((s) => s.chapter3LetterShown);
  const setChapter3LetterShown = useGameStore((s) => s.setChapter3LetterShown);
  const setChapter3LetterPending = useGameStore((s) => s.setChapter3LetterPending);

  const notebookOpen = useKnowledgeStore((s) => s.notebookOpen);
  const openNotebook = useKnowledgeStore((s) => s.openNotebook);
  const closeNotebook = useKnowledgeStore((s) => s.closeNotebook);

  const isChapter3Completed = completedMissions.includes("mission-5") && completedMissions.includes("mission-6");

  useEffect(() => {
    play("ambient-apartment");
    setSubtitle("Welcome to your hotel.");
  }, [play]);

  useEffect(() => {
    if (chapter3LetterPending && !chapter3LetterShown) {
      setTimeout(() => {
        setShowLetter(true);
        setIsLetterAutoOpen(true);
        setChapter3LetterShown(true);
        setChapter3LetterPending(false);
      }, 2000);
    }
  }, [chapter3LetterPending, chapter3LetterShown, setChapter3LetterShown, setChapter3LetterPending]);

  const handleEnterRoom = () => {
    play("ui-confirm");
    void transitionToScene(SCENE_IDS.HOTEL_ROOM);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full">
        <img
          src="/pinterest/hotel/hotel.png"
          alt="Hotel"
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

        <motion.button
          type="button"
          onClick={() => {
            play("ui-confirm");
            openNotebook();
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="查看技能卡"
        >
          <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-[#5d4a37] font-game-serif text-xl">📖</span>
          </div>
          <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
            Notebook
          </span>
        </motion.button>

        {isChapter3Completed && (
          <motion.button
            type="button"
            onClick={() => {
              play("ui-confirm");
              setShowLetter(true);
              setIsLetterAutoOpen(false);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center hover:scale-110 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="查看信件"
          >
            <div className="w-12 h-12 bg-[#d4a574] border-2 border-[#b89467] rounded-lg shadow-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5d4a37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M3 10h18" />
                <path d="M3 14h18" />
                <path d="M3 8h18" />
              </svg>
            </div>
            <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
              信件
            </span>
          </motion.button>
        )}
      </div>

      <TypewriterSubtitle text={subtitle} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-48 left-1/2 -translate-x-1/2"
      >
        <motion.button
          type="button"
          onClick={handleEnterRoom}
          className="px-8 py-2 bg-[#5d4a37]/90 text-white text-lg font-serif tracking-[0.2em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-lg border border-[#dcc4a0]/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ENTER ROOM
        </motion.button>
      </motion.div>

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />

      <LetterModal 
        isOpen={showLetter} 
        onClose={() => {
          setShowLetter(false);
          setIsLetterAutoOpen(false);
        }}
        autoOpen={isLetterAutoOpen}
        chapter={3}
      />

      <KnowledgeNotebook
        open={notebookOpen}
        card={null}
        onClose={closeNotebook}
      />
    </div>
  );
}
