"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SCENE_IDS } from "@/lib/game";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameStore } from "@/store/game-store";
import { useKnowledgeStore } from "@/store/knowledge-store";
import { KnowledgeNotebook, SettingsButton, SettingsPanel } from "@/components/game/ui";

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
      imageUrl: "/pinterest/1house.png",
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
      imageUrl: "/pinterest/1office.png",
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
      imageUrl: "/pinterest/1hotel.png",
      unlocked: devMode,
      completed: false,
    },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF8] via-[#F5E6D3] to-[#E8D8C4]" />
      
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 154, 125, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 70%, rgba(196, 149, 122, 0.12) 0%, transparent 50%),
                              radial-gradient(circle at 50% 50%, rgba(123, 154, 181, 0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#8B9A7D]">
          <path d="M100 10C100 10 60 50 40 90C20 130 30 160 50 180C70 195 85 198 100 200C115 198 130 195 150 180C170 160 180 130 160 90C140 50 100 10 100 10Z" fill="currentColor" />
          <path d="M100 40C100 40 70 70 55 100C40 130 45 150 60 165C75 180 90 185 100 185C110 185 125 180 140 165C155 150 160 130 145 100C130 70 100 40 100 40Z" fill="#FDFBF8" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-80 h-80 opacity-15">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#C4957A]">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="absolute top-1/4 left-10 w-64 h-64 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#7B9AB5]">
          <path d="M50 0L61 35L98 35L68 57L79 91L50 70L21 91L32 57L2 35L39 35Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#E8D8C4] to-transparent rounded-b-[50%] -translate-y-1/2" />

      <div className="absolute top-6 left-6">
        <motion.button
          type="button"
          onClick={() => setShowSettings(true)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-10 h-10 rounded-lg bg-[#E8D8C4] flex items-center justify-center shadow-md hover:bg-[#DCC8B4] transition-colors cursor-pointer border border-[#DCC8B4]"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5D4A37]" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -30 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-16 w-full text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <svg viewBox="0 0 50 50" className="w-12 h-12 text-[#8B9A7D]">
            <path d="M25 2C25 2 18 12 15 22C12 28 12 34 15 38C18 42 22 44 25 44C28 44 32 42 35 38C38 34 38 28 35 22C32 12 25 2 25 2Z" fill="currentColor" />
            <path d="M25 10C25 10 21 18 18 26C16 30 16 34 18 36C20 38 23 40 25 40C27 40 30 38 32 36C34 34 34 30 32 26C29 18 25 10 25 10Z" fill="#F5E6D3" />
          </svg>
        </div>
        <h1 
          className="text-6xl md:text-7xl font-bold text-[#5D4A37] tracking-[0.3em] mb-4" 
          style={{ 
            fontFamily: "'Georgia', serif",
            textShadow: "0 4px 8px rgba(93,74,55,0.3), 0 2px 4px rgba(93,74,55,0.2)",
            letterSpacing: "0.3em"
          }}
        >
          HER FIRSTS
        </h1>
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="w-24 h-1 bg-[#8B9A7D] rounded-full" />
          <div className="w-3 h-3 rounded-full bg-[#8B9A7D]" />
          <div className="w-24 h-1 bg-[#8B9A7D] rounded-full" />
        </div>
        <p className="text-base text-[#8B7A6A] tracking-[0.2em]" style={{ fontFamily: "'Georgia', serif" }}>
          Every first deserves a safe place to practice.
        </p>
      </motion.div>

      <div className="absolute top-6 right-6 flex gap-3">
        <motion.button
          type="button"
          onClick={() => openNotebook()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8D8C4] border border-[#DCC8B4] shadow-md hover:bg-[#DCC8B4] transition-colors cursor-pointer"
        >
          <span className="text-[#5d4a37] font-game-serif text-xl">📖</span>
          <span className="text-sm text-[#5D4A37] font-medium">Notebook</span>
          {cards.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#8B9A7D] text-white text-xs flex items-center justify-center">
              {cards.length}
            </span>
          )}
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8D8C4] border border-[#DCC8B4] shadow-md hover:bg-[#DCC8B4] transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#C4957A] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            </svg>
          </div>
          <span className="text-sm text-[#5D4A37] font-medium">Player</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#8B7A6A]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute inset-0 flex items-start justify-center px-8 pt-[327px] pointer-events-none"
      >
        <div className="flex justify-center gap-[59px]">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
              className="w-[358px] bg-[#FDFBF8] rounded-2xl shadow-xl overflow-hidden border border-[#E8D8C4] pointer-events-auto"
            >
              <div className="relative">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                  <span className="text-xs font-bold text-[#5D4A37] tracking-widest uppercase">
                    {chapter.subtitle}
                  </span>
                </div>

                <div className="h-[252px] overflow-hidden rounded-t-2xl">
                  <img
                    src={chapter.imageUrl}
                    alt={chapter.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: chapter.color }}
                >
                  {chapter.id === "chapter-1" && (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
                  {chapter.id === "chapter-2" && (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  )}
                  {chapter.id === "chapter-3" && (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
                      <path d="M16 2l2 6-2 6" />
                      <path d="M8 2l-2 6 2 6" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="p-5 text-center pt-10">
                <h3 className="text-xl font-bold text-[#5D4A37] mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                  {chapter.title}
                </h3>
                <p className="text-xs text-[#8B7A6A] mb-6 leading-relaxed">
                  {chapter.description}
                </p>

                {chapter.unlocked ? (
                  <motion.button
                    type="button"
                    onClick={() => handleChapterClick(chapter.id)}
                    className="w-12 h-12 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: chapter.color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {chapter.completed ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </motion.button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-12 h-12 rounded-full shadow-md flex items-center justify-center cursor-not-allowed bg-[#D4D0CA]"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#A89888]" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-4 opacity-40">
        <svg viewBox="0 0 100 120" className="w-20 h-24 text-[#8B9A7D]">
          <path d="M50 120V10C50 10 30 30 20 50C10 70 15 90 25 100C30 105 40 115 50 120Z" fill="currentColor" />
          <path d="M50 60V10C50 10 70 25 80 45C85 55 85 70 75 85C70 95 60 105 50 110V60Z" fill="currentColor" />
          <path d="M50 120V100C50 100 60 90 55 80C50 70 45 75 45 85C45 95 48 105 50 120Z" fill="#F5E6D3" />
        </svg>
      </div>

      <div className="absolute bottom-4 right-4 opacity-40">
        <svg viewBox="0 0 100 120" className="w-20 h-24 text-[#8B9A7D]">
          <path d="M50 120V10C50 10 70 30 80 50C90 70 85 90 75 100C70 105 60 115 50 120Z" fill="currentColor" />
          <path d="M50 60V10C50 10 30 25 20 45C15 55 15 70 25 85C30 95 40 105 50 110V60Z" fill="currentColor" />
          <path d="M50 120V100C50 100 40 90 45 80C50 70 55 75 55 85C55 95 52 105 50 120Z" fill="#F5E6D3" />
        </svg>
      </div>

      <KnowledgeNotebook
        open={notebookOpen}
        card={null}
        onClose={closeNotebook}
      />
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}