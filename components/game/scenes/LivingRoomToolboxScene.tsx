"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Home } from "lucide-react";
import { SCENE_IDS } from "@/lib/game";
import { useGameStore, useInventoryStore, saveManager } from "@/store";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameAudio } from "@/hooks/useGameAudio";
import { ConfirmDialog } from "@/components/game/ui";

const LIGHTING_TOOLS = [
  { id: "ladder", name: "人字梯", image: "/images/lighting/tizi.jpg" },
  { id: "voltage-pen", name: "数显测电笔", image: "/images/lighting/cedianbi.jpg" },
  { id: "screwdriver", name: "十字螺丝刀", image: "/images/lighting/luosidao.jpg" },
  { id: "storage-box", name: "小零件收纳盒", image: "/images/lighting/shounahe.jpg" },
  { id: "led-board", name: "全新LED灯珠板", image: "/images/lighting/dengzhuban.jpg" },
];

export function LivingRoomToolboxScene() {
  const { transitionToScene } = useSceneTransition();
  const { play, stop } = useGameAudio();

  const items = useInventoryStore((s) => s.items);
  const addItem = useInventoryStore((s) => s.addItem);
  const setLightingToolsCollected = useGameStore((s) => s.setLightingToolsCollected);

  const [showDrawer, setShowDrawer] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [allCollected, setAllCollected] = useState(false);

  const hasAllTools = LIGHTING_TOOLS.every((tool) => items.some((item) => item.id === tool.id));

  useEffect(() => {
    play("ambient-apartment", 0.3);
    return () => stop("ambient-apartment");
  }, [play, stop]);

  useEffect(() => {
    if (hasAllTools && !allCollected) {
      setAllCollected(true);
      setLightingToolsCollected(true);
      saveManager.save();
      setTimeout(() => {
        setShowFeedback("所有工具已收集完毕！");
        setTimeout(() => {
          setShowFeedback(null);
        }, 2000);
      }, 500);
    }
  }, [hasAllTools, allCollected, setLightingToolsCollected]);

  const handleBackToApartment = useCallback(async () => {
    await transitionToScene(SCENE_IDS.APARTMENT);
  }, [transitionToScene]);

  const handleBackToMenu = useCallback(async () => {
    setShowExitConfirm(true);
  }, []);

  const handleConfirmExit = useCallback(async () => {
    setShowExitConfirm(false);
    await transitionToScene(SCENE_IDS.OPENING);
  }, [transitionToScene]);

  const handleDrawerClick = useCallback(() => {
    setShowDrawer(true);
    play("door-creak");
  }, [play]);

  const handleCloseDrawer = useCallback(() => {
    setShowDrawer(false);
    play("door-creak");
  }, [play]);

  const handlePickItem = useCallback(
    (itemId: string, itemName: string) => {
      if (items.some((item) => item.id === itemId)) {
        setShowFeedback("已经有这个工具了");
        setTimeout(() => setShowFeedback(null), 1500);
        return;
      }

      addItem({ id: itemId, name: itemName, category: "tool" });
      play("ui-confirm");
      saveManager.save();

      setShowFeedback(`获得了 ${itemName}！`);
      setTimeout(() => setShowFeedback(null), 1500);
    },
    [items, addItem, play]
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Image
          src="/images/landing_page.png"
          alt="Apartment interior"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </motion.div>

      <motion.div
        className="absolute top-4 left-4 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="text-white/80 text-lg mb-2 font-bold">客厅</div>
          <div className="text-white text-xl">打开工具箱拿维修工具</div>
        </div>
      </motion.div>

      <div className="absolute right-4 top-4 bottom-4 w-20 bg-black/40 backdrop-blur-sm rounded-lg flex flex-col gap-2 p-2 z-30">
        <span className="text-white/60 text-xs uppercase tracking-wider text-center">工具</span>
        {items.map((item) => {
          const tool = LIGHTING_TOOLS.find((t) => t.id === item.id);
          return (
            <motion.div
              key={item.id}
              className="relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <button
                type="button"
                onClick={() => {}}
                className="w-full aspect-square rounded-lg flex items-center justify-center bg-[#5d4a37]/60 hover:bg-[#5d4a37] text-white text-xs font-serif"
              >
                {tool?.name.slice(0, 2)}
              </button>
            </motion.div>
          );
        })}
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white/30 text-[10px]">空</span>
          </div>
        )}
      </div>

      <motion.button
        type="button"
        onClick={handleDrawerClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute left-[45%] top-[70%] -translate-x-1/2 z-20 flex flex-col items-center hover:scale-105 transition-transform"
        style={{
          animation: "pulse-glow 2s infinite",
        }}
      >
        <div
          className="relative w-20 h-14 bg-[#5d4a37] border-2 border-[#3d2e1f] rounded-lg shadow-lg"
        >
          <div className="absolute inset-1 bg-[#4a3a2a] rounded-md" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#3d2e1f] rounded" />
          <div className="absolute top-4 left-2 w-3 h-3 bg-[#8b755c] rounded" />
          <div className="absolute top-4 right-2 w-3 h-3 bg-[#8b755c] rounded" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#3d2e1f] rounded" />
        </div>
        <span 
          className="font-game-sans mt-2 block text-center text-xs uppercase tracking-widest text-cream-100 opacity-90"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          工具箱
        </span>
      </motion.button>

      <motion.button
        type="button"
        onClick={handleBackToApartment}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-3 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors z-30 border border-white/20 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        返回公寓
      </motion.button>

      <motion.button
        type="button"
        onClick={handleBackToMenu}
        className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors z-30 border border-white/20 flex items-center gap-1.5"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home size={14} />
        返回主页
      </motion.button>

      <AnimatePresence mode="wait">
        {showFeedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm z-50"
          >
            {showFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showDrawer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[90%] max-w-md bg-[#f5e6d3] rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <div className="border-b border-[#dcc4a0] pb-3 mb-4">
                <h2 className="text-lg font-serif text-gray-800">工具箱</h2>
                <p className="text-xs text-gray-500 mt-1">找到需要的工具</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {LIGHTING_TOOLS.map((tool) => {
                  const hasTool = items.some((item) => item.id === tool.id);
                  return (
                    <motion.button
                      key={tool.id}
                      type="button"
                      onClick={() => handlePickItem(tool.id, tool.name)}
                      disabled={hasTool}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        hasTool
                          ? "bg-green-100 border-green-300 opacity-70"
                          : "bg-white/60 border-[#dcc4a0] hover:border-gray-400 hover:bg-white/80"
                      }`}
                      whileHover={!hasTool ? { scale: 1.02 } : {}}
                      whileTap={!hasTool ? { scale: 0.98 } : {}}
                    >
                      <div className="w-12 h-16 mx-auto bg-gray-100 rounded-lg mb-2 flex items-center justify-center relative">
                        <Image
                          src={tool.image}
                          alt={tool.name}
                          fill
                          className="object-contain"
                          quality={100}
                        />
                      </div>
                      <span className="text-sm font-serif text-gray-700 block">{tool.name}</span>
                      {hasTool && (
                        <span className="text-xs text-green-600 block mt-1">✓ 已获得</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {allCollected && (
                <motion.div
                  className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-green-700 font-serif">✓ 已收集所有工具！返回客厅继续维修吧~</p>
                </motion.div>
              )}

              <motion.button
                type="button"
                onClick={handleBackToApartment}
                className="w-full mt-6 py-3 bg-[#5d4a37] text-white rounded-xl hover:bg-[#4a3a2a] transition-colors font-serif"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                返回公寓
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={showExitConfirm}
        title="退出关卡"
        message="确定要退出当前关卡吗？进度不会保存哦~"
        confirmText="确定退出"
        cancelText="继续游戏"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
}