"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterModal, SettingsButton, SettingsPanel, TypewriterSubtitle } from "@/components/game/ui";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameStore } from "@/store";
import { SCENE_IDS } from "@/lib/game";

export function OfficeScene() {
  const [showSettings, setShowSettings] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [showMissionTitle, setShowMissionTitle] = useState(false);
  const [currentMissionNumber, setCurrentMissionNumber] = useState(1);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [showStoryIntro, setShowStoryIntro] = useState(false);
  const [subtitleComplete, setSubtitleComplete] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isLetterAutoOpen, setIsLetterAutoOpen] = useState(false);

  const { play } = useGameAudio();
  const { transitionToScene } = useSceneTransition();
  const completedMissions = useGameStore((s) => s.completedMissions);
  const mission4Started = useGameStore((s) => s.mission4Started);
  const chapter2LetterPending = useGameStore((s) => s.chapter2LetterPending);
  const chapter2LetterShown = useGameStore((s) => s.chapter2LetterShown);
  const setChapter2LetterShown = useGameStore((s) => s.setChapter2LetterShown);
  const setChapter2LetterPending = useGameStore((s) => s.setChapter2LetterPending);

  const isChapter2Completed = completedMissions.includes("mission-4");

  useEffect(() => {
    play("ambient-apartment");
    setSubtitle("Welcome to your new office.");
  }, [play]);

  useEffect(() => {
    if (chapter2LetterPending && !chapter2LetterShown) {
      setTimeout(() => {
        setShowLetter(true);
        setIsLetterAutoOpen(true);
        setChapter2LetterShown(true);
        setChapter2LetterPending(false);
      }, 2000);
    }
  }, [chapter2LetterPending, chapter2LetterShown, setChapter2LetterShown, setChapter2LetterPending]);

  useEffect(() => {
    if (subtitleComplete) {
      setTimeout(() => {
        setShowStoryIntro(true);
      }, 1000);
    }
  }, [subtitleComplete]);

  const handleStartMission = () => {
    play("ui-confirm");
    setFadeToBlack(true);
    setTimeout(() => {
      setCurrentMissionNumber(4);
      setShowMissionTitle(true);
      setTimeout(() => {
        setShowMissionTitle(false);
        setTimeout(() => {
          setFadeToBlack(false);
          void transitionToScene(SCENE_IDS.OFFICE_MISSION);
        }, 500);
      }, 2000);
    }, 800);
  };

  const handleCloseStoryIntro = () => {
    play("ui-confirm");
    setShowStoryIntro(false);
  };

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

        <motion.button
          type="button"
          onClick={() => {
            play("ui-confirm");
            setShowStoryIntro(true);
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="查看关卡"
        >
          <div className="w-12 h-12 bg-[#5d4a37] border-2 border-[#3d2e1f] rounded-lg shadow-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5e6d3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <line x1="9" x2="9" y1="15" y2="15" />
              <line x1="15" x2="15" y1="15" y2="15" />
            </svg>
          </div>
          <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
            关卡
          </span>
        </motion.button>

        {isChapter2Completed && (
          <motion.button
            type="button"
            onClick={() => {
              play("ui-confirm");
              setShowLetter(true);
              setIsLetterAutoOpen(false);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
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

        <SettingsButton
          onClick={() => setShowSettings(true)}
          className="relative flex flex-col items-center hover:scale-110 transition-transform"
        />
      </div>

      <TypewriterSubtitle 
        text={subtitle} 
        onComplete={() => setSubtitleComplete(true)} 
      />

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />

      <AnimatePresence>
        {showStoryIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#f5e6d3] rounded-xl shadow-2xl max-w-lg w-full mx-4 p-8 relative"
              style={{
                background: "linear-gradient(135deg, #f5e6d3 0%, #e8d8c4 100%)",
                border: "2px solid #dcc4a0",
              }}
            >
              <div className="mt-4 space-y-5">
                <h2 className="font-game-serif text-2xl font-bold text-[#5d4a37] text-center mb-6">
                  Mission 4: Storage Crisis
                </h2>

                <div className="space-y-4 text-[#4a3a2a] leading-relaxed">
                  <p className="text-lg">
                    入职第二周，你正在准备下午的汇报PPT。
                  </p>
                  <p className="text-lg">
                    距离会议开始还有 <span className="font-bold text-[#7B9AB5]">18分钟</span>，
                    突然弹出警告：
                  </p>
                  <div className="bg-[#e8d8c4]/80 rounded-lg p-4 border-l-4 border-[#c4a77d]">
                    <p className="text-lg font-semibold text-[#5d4a37]">
                      Storage Almost Full
                    </p>
                    <p className="text-lg">
                      Only 1.3 GB remaining.
                    </p>
                  </div>
                  <p className="text-lg">
                    Word 自动保存失败、微信无法发送文件、浏览器越来越卡...
                  </p>
                  <p className="text-lg">
                    Leader 正在会议中，同事们都在忙。你必须自己解决这个问题。
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleStartMission}
                    className="w-full py-4 bg-[#5d4a37] text-[#f5e6d3] text-lg font-game-serif tracking-wider uppercase hover:bg-[#4a3a2a] transition-colors rounded-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    开始任务
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseStoryIntro}
                    className="w-full py-3 bg-transparent text-[#5d4a37] text-sm font-game-serif tracking-wider uppercase hover:bg-[#e8d8c4] transition-colors rounded-lg border border-[#c4a77d]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    稍后再开始
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMissionTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 className="font-game-serif text-4xl md:text-6xl font-bold text-white mb-4">
                Chapter 2
              </h2>
              <h3 className="font-game-serif text-3xl md:text-5xl font-bold text-[#f5e6d3]">
                Mission {currentMissionNumber}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fadeToBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black"
          />
        )}
      </AnimatePresence>

      <LetterModal 
        isOpen={showLetter} 
        onClose={() => {
          setShowLetter(false);
          setIsLetterAutoOpen(false);
        }}
        autoOpen={isLetterAutoOpen}
        chapter={2}
      />
    </div>
  );
}