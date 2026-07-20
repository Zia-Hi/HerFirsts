"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useKnowledgeStore, useGameStore } from "@/store";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameAudio } from "@/hooks/useGameAudio";
import { SCENE_IDS } from "@/lib/game";

export function LightingMissionCompletedScene() {
  const [showImage, setShowImage] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSkillCard, setShowSkillCard] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const { unlockLightingCard, openNotebook, closeNotebook } = useKnowledgeStore();
  const addCompletedMission = useGameStore((s) => s.addCompletedMission);
  const setChapter1LetterPending = useGameStore((s) => s.setChapter1LetterPending);
  const { transitionToScene } = useSceneTransition();
  const { play } = useGameAudio();

  useEffect(() => {
    play("mission-success", 0.5);
    addCompletedMission("mission-3");
    setChapter1LetterPending(true);

    setTimeout(() => {
      setShowImage(true);
    }, 300);

    setTimeout(() => {
      setShowTitle(true);
    }, 1500);

    setTimeout(() => {
      setShowOptions(true);
    }, 2500);
  }, [play, addCompletedMission, setChapter1LetterPending]);

  const handleViewSkillCard = useCallback(() => {
    play("ui-confirm");
    setShowSkillCard(true);
  }, [play]);

  const handleSaveToNotebook = useCallback(() => {
    play("ui-confirm");
    const card = unlockLightingCard();
    openNotebook(card.id);
    setShowSkillCard(false);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 1500);
  }, [unlockLightingCard, openNotebook, play]);

  const handleNextMission = useCallback(() => {
    play("ui-confirm");
    closeNotebook();
    void transitionToScene(SCENE_IDS.APARTMENT);
  }, [play, closeNotebook, transitionToScene]);

  const handleBackToMenu = useCallback(() => {
    play("ui-confirm");
    closeNotebook();
    void transitionToScene(SCENE_IDS.OPENING);
  }, [play, closeNotebook, transitionToScene]);

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
            <Image
              src="/images/lighting/mission_3_completed.png"
              alt="Mission completed"
              fill
              className="object-cover"
              quality={100}
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
              Mission 3 Completed
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
              onClick={handleNextMission}
              className="px-12 py-4 bg-white/10 text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-white/20 transition-colors rounded-full shadow-xl border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              返回公寓
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
              className="relative max-w-2xl w-full max-h-[90vh] flex flex-col mx-4"
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

              <div className="flex-1 overflow-y-auto p-8 border-4 border-[#8b7d6b]/20" style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 28px, rgba(139,125,107,0.06) 28px, rgba(139,125,107,0.06) 29px)",
                scrollbarWidth: 'thin',
                scrollbarColor: '#c4a77d #f5e6d3'
              }}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#8b7d6b]/30">
                  <h2 className="font-game-serif text-3xl font-bold text-[#4a3a2a]">
                    LED吸顶灯维修技能卡
                  </h2>
                  <span className="text-sm text-[#8b7d6b] uppercase tracking-widest">
                    Mission 3
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                      问题
                    </h3>
                    <p className="text-[#4a3a2a] leading-relaxed text-lg">
                      客厅吸顶灯突然不亮，邻居家有电说明非停电
                    </p>
                  </div>

                  <div>
                    <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                      原因
                    </h3>
                    <p className="text-[#4a3a2a] leading-relaxed text-lg">
                      单颗LED灯珠短路导致整块灯板断路保护
                    </p>
                  </div>

                  <div>
                    <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-3">
                      解决方法
                    </h3>
                    <ol className="list-decimal list-inside space-y-3">
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        检查配电箱，确认照明回路空开未跳闸后手动拉下断电
                      </li>
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        准备人字梯、测电笔、十字螺丝刀、收纳盒和新LED灯珠板
                      </li>
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        测试测电笔功能，确保工具正常
                      </li>
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        登梯拆卸灯罩，用测电笔验电确认断电
                      </li>
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        观察灯珠表面，确认故障位置
                      </li>
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        拔开连接线，拧下螺丝，拆除旧灯珠板
                      </li>
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        安装新灯珠板，拧紧螺丝，插紧连接线
                      </li>
                      <li className="text-[#4a3a2a] leading-relaxed text-lg">
                        装回灯罩，恢复供电，测试灯光
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                      需要工具
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-[#4a3a2a] leading-relaxed">人字梯</li>
                      <li className="text-[#4a3a2a] leading-relaxed">数显测电笔</li>
                      <li className="text-[#4a3a2a] leading-relaxed">十字螺丝刀</li>
                      <li className="text-[#4a3a2a] leading-relaxed">小零件收纳盒</li>
                      <li className="text-[#4a3a2a] leading-relaxed">全新LED灯珠板</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                      安全提示
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-[#4a3a2a] leading-relaxed">维修前务必关闭电源</li>
                      <li className="text-[#4a3a2a] leading-relaxed">使用测电笔双重确认断电</li>
                      <li className="text-[#4a3a2a] leading-relaxed">梯子放置要平稳</li>
                      <li className="text-[#4a3a2a] leading-relaxed">更换灯珠板时注意极性</li>
                    </ul>
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