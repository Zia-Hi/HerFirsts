"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCENE_IDS, wait } from "@/lib/game";
import { useSceneTransition } from "@/hooks/useSceneTransition";

export function LandingAnimationScene() {
  const [showContent, setShowContent] = useState(false);
  const [showTextLayer, setShowTextLayer] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  const { transitionToScene } = useSceneTransition();

  useEffect(() => {
    const timings = [
      setTimeout(() => setShowContent(true), 300),
      setTimeout(() => setShowTextLayer(true), 1200),
      setTimeout(() => setShowSkip(true), 3500),
      setTimeout(async () => {
        setIsFading(true);
        await wait(1200);
        void transitionToScene(SCENE_IDS.GAME_HOMEPAGE);
      }, 9000),
    ];

    return () => {
      timings.forEach(clearTimeout);
    };
  }, [transitionToScene]);

  const handleSkip = async () => {
    setIsFading(true);
    await wait(1000);
    void transitionToScene(SCENE_IDS.GAME_HOMEPAGE);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ 
          scale: showContent ? 1 : 1.15, 
          opacity: showContent ? 1 : 0,
        }}
        transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <motion.img
          src="/images/shouyeback.png"
          alt="Landing Background"
          className="w-full h-full object-cover"
          animate={showContent ? {
            scale: [1, 1.03, 1],
          } : {}}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.img
        src="/images/shouyewenzi1.png?v=2"
        alt="HER FIRSTS Text"
        className="absolute inset-0 w-full h-full object-contain object-left pointer-events-none"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ 
          opacity: showTextLayer ? 1 : 0, 
          scale: showTextLayer ? 1 : 0.9,
          y: showTextLayer ? 0 : 30,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.15 : 0 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.4 : 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
        }}
      />

      <AnimatePresence>
        {showSkip && !isFading && (
          <motion.button
            type="button"
            onClick={handleSkip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-10 right-10 px-8 py-3 bg-white/15 backdrop-blur-md text-white/90 text-sm font-serif tracking-widest hover:bg-white/25 hover:text-white transition-colors rounded-full border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            开始
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-50"
            style={{
              background: "linear-gradient(to bottom, rgba(245, 230, 211, 0) 0%, rgba(245, 230, 211, 1) 100%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}