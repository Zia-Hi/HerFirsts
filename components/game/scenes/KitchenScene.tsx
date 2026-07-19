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

export function KitchenScene() {
  const { transitionToScene } = useSceneTransition();
  const { play, stop } = useGameAudio();
  const items = useInventoryStore((s) => s.items);
  const addItem = useInventoryStore((s) => s.addItem);
  const removeItem = useInventoryStore((s) => s.removeItem);
  
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const hasVinegar = items.some((item) => item.id === "vinegar");
  const hasPlasticBag = items.some((item) => item.id === "plastic-bag");

  useEffect(() => {
    play("ambient-kitchen", 0.3);
    return () => stop("ambient-kitchen");
  }, [play, stop]);

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

  const handlePickItem = useCallback((itemId: string, itemName: string) => {
    if (itemId === "vinegar" && hasVinegar) {
      setShowFeedback("已经拿到白醋了");
      setTimeout(() => setShowFeedback(null), 2000);
      return;
    }
    if (itemId === "plastic-bag" && hasPlasticBag) {
      setShowFeedback("已经拿到塑料袋了");
      setTimeout(() => setShowFeedback(null), 2000);
      return;
    }

    addItem({
      id: itemId,
      name: itemName,
      category: "mission",
    });
    play("ui-confirm");
    setSelectedItem(itemId);
    
    setShowFeedback(`已获得 ${itemName}`);
    setTimeout(() => setShowFeedback(null), 2000);
    
    saveManager.save();
  }, [addItem, hasVinegar, hasPlasticBag, play]);

  const handleRemoveItem = useCallback((itemId: string) => {
    setItemToRemove(itemId);
    setShowRemoveConfirm(true);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      play("ui-cancel");
      saveManager.save();
    }
    setShowRemoveConfirm(false);
    setItemToRemove(null);
  }, [itemToRemove, removeItem, play]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#2d3436]">
      <div className="relative h-full w-full">
        <Image
          src="/images/shower/kitchen.png"
          alt="Kitchen interior"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      <motion.div
        className="absolute inset-x-0 top-8 z-30 flex justify-center px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-4 relative">
          <div className="border-b border-[#dcc4a0] pb-2 mb-2">
            <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
          </div>
          <p className="text-gray-800 text-sm">请拾取塑料袋和白醋</p>
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-4 flex gap-2 z-30">
        <motion.button
          type="button"
          onClick={handleBackToMenu}
          className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors border border-white/20 flex items-center gap-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={14} />
          返回主页
        </motion.button>
        <motion.button
          type="button"
          onClick={handleBackToApartment}
          className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          返回公寓
        </motion.button>
      </div>

      <div className="absolute left-[58%] top-[72%] -translate-x-1/2 -translate-y-1/2 z-20">
        <button
          type="button"
          onClick={handleDrawerClick}
          className="w-40 h-20 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer border-2 border-white/40 transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{
            animation: "pulse-glow 2s infinite",
          }}
        />
      </div>

      <AnimatePresence>
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
                onClick={() => setShowDrawer(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <div className="border-b border-[#dcc4a0] pb-3 mb-4">
                <h2 className="text-lg font-serif text-gray-800">抽屉</h2>
                <p className="text-xs text-gray-500 mt-1">找到需要的工具</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => handlePickItem("vinegar", "白醋")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    hasVinegar
                      ? "bg-green-100 border-green-300 opacity-70"
                      : "bg-white/60 border-[#dcc4a0] hover:border-gray-400 hover:bg-white/80"
                  }`}
                  whileHover={!hasVinegar ? { scale: 1.02 } : {}}
                  whileTap={!hasVinegar ? { scale: 0.98 } : {}}
                >
                  <div className="w-12 h-16 mx-auto bg-yellow-100 rounded-lg mb-2 flex items-center justify-center relative">
                    <Image
                      src="/images/shower/vinegar.png"
                      alt="白醋"
                      fill
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span className="text-sm font-serif text-gray-700 block">白醋</span>
                  {hasVinegar && (
                    <span className="text-xs text-green-600 block mt-1">✓ 已获得</span>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => handlePickItem("plastic-bag", "塑料袋")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    hasPlasticBag
                      ? "bg-green-100 border-green-300 opacity-70"
                      : "bg-white/60 border-[#dcc4a0] hover:border-gray-400 hover:bg-white/80"
                  }`}
                  whileHover={!hasPlasticBag ? { scale: 1.02 } : {}}
                  whileTap={!hasPlasticBag ? { scale: 0.98 } : {}}
                >
                  <div className="w-12 h-16 mx-auto bg-gray-100 rounded-lg mb-2 flex items-center justify-center relative">
                    <Image
                      src="/images/shower/plastic_bag.png"
                      alt="塑料袋"
                      fill
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span className="text-sm font-serif text-gray-700 block">塑料袋</span>
                  {hasPlasticBag && (
                    <span className="text-xs text-green-600 block mt-1">✓ 已获得</span>
                  )}
                </motion.button>
              </div>

              {hasVinegar && hasPlasticBag && (
                <motion.div
                  className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-green-700 font-serif">✓ 已收集所有工具！</p>
                </motion.div>
              )}

              <motion.button
                type="button"
                onClick={handleBackToApartment}
                className="w-full mt-6 py-3 bg-[#5d4a37] text-white rounded-xl hover:bg-[#4a3a2a] transition-colors font-serif"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                返回浴室
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {showFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 bg-black/30 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-2 z-30">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="relative w-8 h-8 bg-white/80 rounded-md flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleRemoveItem(item.id)}
          >
            <span className="text-xs text-gray-700 font-bold">
              {item.id === "vinegar" ? "醋" : "袋"}
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <X size={10} className="text-white" />
            </span>
          </motion.div>
        ))}
        {items.length === 0 && (
          <span className="text-white/40 text-xs text-center">空</span>
        )}
      </div>

      <ConfirmDialog
        open={showExitConfirm}
        title="返回主页"
        message="确定要返回主页吗？当前进度不会保存哦~"
        confirmText="确定返回"
        cancelText="继续游戏"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      <ConfirmDialog
        open={showRemoveConfirm}
        title="确认丢弃"
        message="确定要丢弃这个工具吗？丢弃后将无法找回哦~"
        confirmText="确认丢弃"
        cancelText="保留工具"
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowRemoveConfirm(false)}
      />
    </div>
  );
}