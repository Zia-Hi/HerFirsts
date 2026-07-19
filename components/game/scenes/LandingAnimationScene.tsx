"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCENE_IDS, wait } from "@/lib/game";
import { useSceneTransition } from "@/hooks/useSceneTransition";

export function LandingAnimationScene() {
  const [showContent, setShowContent] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  const { transitionToScene } = useSceneTransition();

  useEffect(() => {
    const timings = [
      setTimeout(() => setShowContent(true), 500),
      setTimeout(() => setShowTitle(true), 2000),
      setTimeout(() => setShowSkip(true), 4000),
      setTimeout(async () => {
        setIsFading(true);
        await wait(1200);
        void transitionToScene(SCENE_IDS.GAME_HOMEPAGE);
      }, 10000),
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
        initial={{ scale: 1.08, opacity: 0, filter: "blur(10px)" }}
        animate={{ 
          scale: showContent ? 1 : 1.08, 
          opacity: showContent ? 1 : 0,
          filter: showContent ? "blur(0px)" : "blur(10px)",
        }}
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <motion.img
          src="/pinterest/landing1.png"
          alt="Landing"
          className="w-full h-full object-cover"
          animate={showContent ? {
            scale: [1, 1.015, 1],
            opacity: [0.98, 1, 0.98],
          } : {}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.3 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: showTitle ? 1 : 0, 
          y: showTitle ? 0 : 50 
        }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="absolute inset-0 flex flex-col items-center justify-start pt-28"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showTitle ? 1 : 0, scale: showTitle ? 1 : 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{ 
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 -z-10 blur-2xl"
            style={{ backgroundColor: "#8B9A7D" }}
          />
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1.2, 1.4, 1.2],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 -z-20 blur-3xl"
            style={{ backgroundColor: "#8B9A7D" }}
          />
          
          <h1 
            className="text-6xl md:text-7xl font-bold text-white tracking-[0.35em] uppercase"
            style={{ 
              fontFamily: "'Georgia', serif",
              textShadow: "0 4px 20px rgba(0,0,0,0.6), 0 0 80px rgba(139, 154, 125, 0.4), 0 0 150px rgba(139, 154, 125, 0.2)",
              letterSpacing: "0.35em"
            }}
          >
            HER FIRSTS
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showTitle ? 1 : 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center justify-center gap-6 mt-6"
        >
          <div className="w-24 h-1 bg-white/60 rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
          <div className="w-24 h-1 bg-white/60 rounded-full" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showTitle ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="text-white/90 text-base tracking-[0.25em] mt-5"
          style={{ 
            fontFamily: "'Georgia', serif",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)"
          }}
        >
          Every first deserves a safe place to practice.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.6 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
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
            className="absolute bottom-10 right-10 px-8 py-3 bg-white/10 backdrop-blur-md text-white/90 text-sm font-serif tracking-widest hover:bg-white/20 hover:text-white transition-colors rounded-full border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SKIP
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