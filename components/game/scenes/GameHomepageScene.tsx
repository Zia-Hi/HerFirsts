"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SCENE_IDS } from "@/lib/game";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameStore } from "@/store/game-store";
import { useKnowledgeStore } from "@/store/knowledge-store";
import { KnowledgeNotebook, SettingsPanel } from "@/components/game/ui";

export function GameHomepageScene() {
  const [showContent, setShowContent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { transitionToScene } = useSceneTransition();
  const { completedMissions, devMode } = useGameStore();
  const { openNotebook, closeNotebook, notebookOpen, cards } = useKnowledgeStore();

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  }, []);

  const chapter1Completed = completedMissions.includes("mission-1") && 
                            completedMissions.includes("mission-2") && 
                            completedMissions.includes("mission-3");

  const handleChapterClick = (chapterId: string) => {
    if (chapterId === "chapter-1") {
      void transitionToScene(SCENE_IDS.OPENING);
    } else if (chapterId === "chapter-2") {
      void transitionToScene(SCENE_IDS.OFFICE_OPENING);
    } else if (chapterId === "chapter-3") {
      void transitionToScene(SCENE_IDS.HOTEL_OPENING);
    }
  };

  const chapters = [
    {
      id: "chapter-1",
      title: "Her First Home",
      subtitle: "CHAPTER 1",
      description: "Learn essential life skills and fix things on your own.",
      color: "#8B9A7D",
      accentColor: "#6B7A5D",
      imageUrl: "/images/zhuye1.png",
      unlocked: true,
      completed: chapter1Completed,
    },
    {
      id: "chapter-2",
      title: "Her First Office",
      subtitle: "CHAPTER 2",
      description: "Navigate work challenges and grow with confidence.",
      color: "#7B9AB5",
      accentColor: "#5B7A95",
      imageUrl: "/images/zhuye2.png",
      unlocked: devMode || chapter1Completed,
      completed: false,
    },
    {
      id: "chapter-3",
      title: "Her First Journey",
      subtitle: "CHAPTER 3",
      description: "Stay safe, explore more, and handle the unexpected.",
      color: "#C4957A",
      accentColor: "#A4755A",
      imageUrl: "/images/zhuye3.png",
      unlocked: devMode,
      completed: false,
    },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src="/images/shouyeback1.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover blur-sm"
        style={{ filter: "blur(4px) brightness(0.95)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -20 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute top-[13%] left-0 right-0 z-30 text-center px-4"
      >
        <h1 
          className="text-white font-game-serif tracking-[0.2em] uppercase"
          style={{ 
            fontSize: "clamp(1.3rem, 3vw, 2.8rem)",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.2)"
          }}
        >
          Every first time deserves confidence
        </h1>
      </motion.div>

      <div className="absolute top-6 left-6 z-30">
        <motion.button
          type="button"
          onClick={() => setShowSettings(true)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer border border-white/50"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5D4A37]" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </motion.button>
      </div>

      <div className="absolute top-6 right-6 flex gap-3 z-30">
        <motion.button
          type="button"
          onClick={() => openNotebook()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:bg-white transition-colors cursor-pointer"
        >
          <span className="text-[#5d4a37] font-game-serif text-xl">📖</span>
          <span className="text-sm text-[#5D4A37] font-medium">Notebook</span>
          {cards.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#8B9A7D] text-white text-xs flex items-center justify-center">
              {cards.length}
            </span>
          )}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none pt-[10%]"
      >
        <div className="grid grid-cols-3 gap-6 md:gap-8 lg:gap-12 w-full max-w-5xl px-4">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
              className="flex items-center justify-center pointer-events-auto aspect-square"
            >
              <motion.button
                type="button"
                onClick={() => chapter.unlocked && handleChapterClick(chapter.id)}
                className={`w-full h-full relative ${chapter.unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                whileHover={chapter.unlocked ? { scale: 1.08 } : {}}
                whileTap={chapter.unlocked ? { scale: 0.97 } : {}}
                transition={{ duration: 0.2 }}
                disabled={!chapter.unlocked}
              >
                <img
                  src={chapter.imageUrl + "?v=" + Math.random().toString(36).substr(2, 9)}
                  alt={chapter.title}
                  className={`w-full h-full object-contain ${!chapter.unlocked ? "grayscale opacity-50" : ""}`}
                  style={{ transform: "scale(1.5)" }}
                />
                
                {!chapter.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                )}

                {chapter.completed && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <KnowledgeNotebook
        open={notebookOpen}
        card={null}
        onClose={closeNotebook}
      />
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}