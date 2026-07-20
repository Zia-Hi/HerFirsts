"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKnowledgeStore, useGameStore } from "@/store";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameAudio } from "@/hooks/useGameAudio";
import { SCENE_IDS } from "@/lib/game";

export function HotelMissionCompletedScene() {
  const [showImage, setShowImage] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSkillCard, setShowSkillCard] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const { unlockHotelCard, openNotebook, closeNotebook } = useKnowledgeStore();
  const addCompletedMission = useGameStore((s) => s.addCompletedMission);
  const setChapter3LetterPending = useGameStore((s) => s.setChapter3LetterPending);
  const { transitionToScene } = useSceneTransition();
  const { play } = useGameAudio();

  useEffect(() => {
    play("mission-success", 0.5);
    addCompletedMission("hotel-mission");

    setTimeout(() => {
      setShowImage(true);
    }, 300);

    setTimeout(() => {
      setShowTitle(true);
    }, 1500);

    setTimeout(() => {
      setShowOptions(true);
    }, 2500);
  }, [play, addCompletedMission]);

  const handleViewSkillCard = useCallback(() => {
    play("ui-confirm");
    setShowSkillCard(true);
  }, [play]);

  const handleSaveToNotebook = useCallback(() => {
    play("ui-confirm");
    const card = unlockHotelCard();
    openNotebook(card.id);
    setShowSkillCard(false);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 1500);
  }, [unlockHotelCard, openNotebook, play]);

  const handleBackToMenu = useCallback(() => {
    play("ui-confirm");
    closeNotebook();
    void transitionToScene(SCENE_IDS.GAME_HOMEPAGE);
  }, [play, closeNotebook, transitionToScene]);

  const handleBackToHotel = useCallback(() => {
    play("ui-confirm");
    closeNotebook();
    setChapter3LetterPending(true);
    void transitionToScene(SCENE_IDS.HOTEL);
  }, [play, closeNotebook, setChapter3LetterPending, transitionToScene]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence>
        {showImage && (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/pinterest/hotel/flower.jpg"
              alt="Mission completed"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute inset-0 bg-black"
            />
          </motion.div>
        )}

        {showTitle && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 text-center"
          >
            <h1
              className="font-game-serif text-5xl md:text-7xl font-bold text-white tracking-[0.2em]"
              style={{
                textShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)",
              }}
            >
              Mission Complete
            </h1>
          </motion.div>
        )}

        {showOptions && !showSkillCard && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-[20%] z-30 flex flex-col gap-4"
          >
            <motion.button
              type="button"
              onClick={handleViewSkillCard}
              className="px-12 py-4 bg-[#5d4a37] text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Skill Card
            </motion.button>

            <motion.button
              type="button"
              onClick={handleBackToHotel}
              className="px-12 py-4 bg-white/10 text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-white/20 transition-colors rounded-full shadow-xl border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              返回酒店
            </motion.button>

            <motion.button
              type="button"
              onClick={handleBackToMenu}
              className="px-12 py-4 bg-white/10 text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-white/20 transition-colors rounded-full shadow-xl border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              返回 MENU
            </motion.button>
          </motion.div>
        )}

        {showSkillCard && (
          <motion.div
            key="skill-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
              style={{
                background:
                  "linear-gradient(135deg, #fdfbf7 0%, #f5e6d3 50%, #e8d5b7 100%)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowSkillCard(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#5d4a37]/80 text-white rounded-full hover:bg-[#5d4a37] transition-colors"
              >
                ✕
              </button>

              <div className="flex-1 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-8 border-4 border-[#8b7d6b]/20 flex flex-col h-full" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 28px, rgba(139,125,107,0.06) 28px, rgba(139,125,107,0.06) 29px)" }}>
                  <div className="flex-1 overflow-y-auto pr-2" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#c4a77d #f5e6d3'
                  }}>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#8b7d6b]/30">
                      <h2 className="font-game-serif text-3xl font-bold text-[#4a3a2a]">
                        防偷拍检查技能卡
                      </h2>
                      <span className="text-sm text-[#8b7d6b] uppercase tracking-widest">
                        Hotel Mission
                      </span>
                    </div>

                    <div className="space-y-6 pb-4">
                      <div>
                        <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                          问题
                        </h3>
                        <p className="text-[#4a3a2a] leading-relaxed text-lg">
                          入住酒店时担心房间存在偷拍设备
                        </p>
                      </div>

                      <div>
                        <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                          原因
                        </h3>
                        <p className="text-[#4a3a2a] leading-relaxed text-lg">
                          不法分子可能在酒店房间安装隐蔽摄像头
                        </p>
                      </div>

                      <div>
                        <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-3">
                          检查方法
                        </h3>
                        <ol className="list-decimal list-inside space-y-3">
                          <li className="text-[#4a3a2a] leading-relaxed text-lg">
                            关闭房间主灯，拉上窗帘，保持房间较暗
                          </li>
                          <li className="text-[#4a3a2a] leading-relaxed text-lg">
                            打开手机相机，缓慢移动镜头检查各个角落
                          </li>
                          <li className="text-[#4a3a2a] leading-relaxed text-lg">
                            重点检查：插座面板、电视、空调、烟雾报警器、浴室等
                          </li>
                          <li className="text-[#4a3a2a] leading-relaxed text-lg">
                            如发现红色发光点、异常小孔等可疑设备，保留现场
                          </li>
                          <li className="text-[#4a3a2a] leading-relaxed text-lg">
                            联系酒店前台，如怀疑涉及偷拍可报警处理
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t-2 border-[#8b7d6b]/30 flex justify-end">
                    <motion.button
                      type="button"
                      onClick={handleSaveToNotebook}
                      className="px-8 py-3 bg-[#5d4a37] text-white text-base font-serif tracking-wider hover:bg-[#4a3a2a] transition-colors rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      保存至 Notebook
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-32 bg-[#c4a77d] rounded-l-lg" />
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-28 bg-[#a68b5b]" />
            </motion.div>
          </motion.div>
        )}

        {showSavedToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[60] flex items-center justify-center"
          >
            <div className="bg-white/70 text-black px-8 py-4 rounded-lg">
              <p className="text-xl font-serif">已保存至 Notebook</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
