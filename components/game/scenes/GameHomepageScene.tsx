"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SCENE_IDS } from "@/lib/game";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameStore } from "@/store/game-store";
import { useKnowledgeStore } from "@/store/knowledge-store";
import { KnowledgeNotebook, SettingsPanel } from "@/components/game/ui";
import { audioManager } from "@/lib/game/audio-manager";

export function GameHomepageScene() {
  const [showContent, setShowContent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const { transitionToScene } = useSceneTransition();
  const { completedMissions, devMode } = useGameStore();
  const { openNotebook, closeNotebook, notebookOpen, cards } = useKnowledgeStore();

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, 300);

    const handleInteraction = () => {
      audioManager.unlock();
      if (!audioManager.isPlaying("background-music")) {
        audioManager.play("background-music", { channel: "music", loop: true, volume: 0.6 });
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const chapter1Completed = completedMissions.includes("mission-1") && 
                            completedMissions.includes("mission-2") && 
                            completedMissions.includes("mission-3");
  const chapter2Completed = completedMissions.includes("mission-4");
  const chapter3Completed = completedMissions.includes("mission-5");

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
      completed: chapter2Completed,
    },
    {
      id: "chapter-3",
      title: "Her First Journey",
      subtitle: "CHAPTER 3",
      description: "Stay safe, explore more, and handle the unexpected.",
      color: "#C4957A",
      accentColor: "#A4755A",
      imageUrl: "/images/zhuye3.png",
      unlocked: devMode || chapter2Completed,
      completed: chapter3Completed,
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

        <motion.button
          type="button"
          onClick={() => setShowAbout(true)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:bg-white transition-colors cursor-pointer"
        >
          <span className="text-[#5d4a37] font-game-serif text-xl">ℹ️</span>
          <span className="text-sm text-[#5D4A37] font-medium">About</span>
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

      {showAbout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowAbout(false)}
        >
          <motion.div
            className="relative w-[90%] max-w-2xl bg-[#f5e6d3] rounded-2xl shadow-2xl p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-2 border-[#dcc4a0] pb-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#5d4a37]">关于 Her Firsts</h2>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6 text-[#5d4a37] text-base leading-relaxed">
              <p>
                离开校园、背井离乡来到陌生城市，作为刚毕业的年轻女性，你签下人生第一份租房合同。当钥匙插入门锁、推开出租屋大门的那一刻，望着陌生的家具与空间，你突然意识到：曾经由父母、家庭替你承担的一切，正在成为属于你自己的「生存时间」。
              </p>
              <p>
                这是一段充满未知、意外与挑战的时间。
              </p>
              <p>
                花洒突然漏水、房间灯具失灵、路由器断网，面对出租屋里的突发故障，第一次独自生活的你措手不及，却不知道该向谁求助；进入职场后，电脑卡顿、磁盘爆满、系统故障，又成为新人必须面对的问题；独自出差入住酒店时，也可能因为担心隐藏摄像头等安全隐患，而无法真正放松。
              </p>
              <p>
                这些看似微小的瞬间，却构成了无数年轻女性走向独立过程中真实存在的焦虑。
              </p>
              <p>
                在我们的理解里，「生存时间」是为了维持生活而不得不付出的时间。它常常由外部需求驱动，伴随着被动感、压力感和「不知道该怎么办」的无力感：你并不是主动选择去处理这些问题，而是生活把它们推到你面前，逼着你在有限的经验里迅速应对。
              </p>
              <p>
                而我们希望探索的问题是：
              </p>
              <p>
                如果这些人生第一次，都能在真正到来之前先演练一次呢？当原本只能被动面对的生活挑战，能够提前在安全环境中被体验、被拆解、被学习，关于「第一次」的焦虑，是否就能逐渐转化为面对未知的信心？
              </p>
              <p>
                于是，我们创造了Her Firsts。
              </p>
              <p>
                Her Firsts 是一款女性向生活情境模拟游戏，通过数字化交互与沉浸式体验构建一个安全、低成本、可反复试错的虚拟成长空间，让女性能够在面对现实生活之前，提前体验那些曾经令人害怕的「第一次」。
              </p>
              <p>
                我们希望将生存时间，从被迫应对的焦虑时刻，转化为主动掌握的成长过程。
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#dcc4a0] flex justify-end">
              <motion.button
                type="button"
                onClick={() => setShowAbout(false)}
                className="px-6 py-2 bg-[#5d4a37] text-white rounded-lg hover:bg-[#4a3a2a] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                关闭
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}