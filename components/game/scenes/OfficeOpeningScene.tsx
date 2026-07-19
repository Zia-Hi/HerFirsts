"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubtitleOverlay } from "@/components/game/ui";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { SCENE_IDS, wait } from "@/lib/game";
import { audioManager } from "@/lib/game/audio-manager";
import { useGameStore } from "@/store";

export function OfficeOpeningScene() {
  const [phase, setPhase] = useState<"black" | "subtitle" | "city-view" | "brightening" | "office-reveal" | "complete" | "fade-to-black">("black");
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [showWalkText, setShowWalkText] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { transitionToScene } = useSceneTransition();
  const { play, stop } = useGameAudio();

  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const setPlayerHasControl = useGameStore((s) => s.setPlayerHasControl);
  const setCurrentScene = useGameStore((s) => s.setCurrentScene);
  const setTransitionState = useGameStore((s) => s.setTransitionState);

  const runSequence = useCallback(async () => {
    setGamePhase("office-opening");

    setPhase("black");
    await wait(1500);

    setPhase("subtitle");
    setSubtitle("Three months later.");
    await wait(500);
    await wait(1000);
    await wait(2000);
    setSubtitle(null);
    await wait(800);

    setPhase("city-view");
    play("ambient-city", 0.3);
    await wait(2000);

    setShowWalkText(true);
    setSubtitle("You've started your first job.");
    await wait(2000);
    setSubtitle("A new chapter begins.");
    await wait(2500);

    setPhase("brightening");
    setSubtitle(null);
    setShowWalkText(false);
    await wait(1500);

    stop("ambient-city");
    audioManager.setChannelVolume("music", 0.6);

    setPhase("office-reveal");
    play("ambient-apartment");
    await wait(2000);

    setShowMenu(true);
  }, [play, setGamePhase, stop]);

  useEffect(() => {
    void runSequence();
  }, [runSequence]);

  useEffect(() => {
    if (phase === "city-view") {
      const interval = setInterval(() => {
        play("footstep-wood", 0.2);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [phase, play]);

  const handleStart = useCallback(async () => {
    setShowMenu(false);
    await wait(500);
    setPhase("complete");
    setPlayerHasControl(true);
    setGamePhase("office");
    setCurrentScene(SCENE_IDS.OFFICE);
    setTransitionState("idle");
  }, [setGamePhase, setPlayerHasControl, setCurrentScene, setTransitionState]);

  return (
    <>
      <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {(phase === "black" || phase === "subtitle") && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black"
          />
        )}

        {phase === "brightening" && (
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(232, 216, 196, 0.9) 0%, rgba(232, 216, 196, 0.5) 30%, rgba(232, 216, 196, 0) 70%)",
            }}
            animate={{
              scale: [1, 2, 3],
              opacity: [0, 0.5, 1],
            }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
        )}

        {phase === "fade-to-black" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>

      <SubtitleOverlay text={subtitle} />

      <AnimatePresence mode="wait">
        {phase === "city-view" && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{
              opacity: { duration: 3, ease: [0.25, 0.1, 0.25, 1] },
              scale: { duration: 8, ease: "easeInOut" },
            }}
            className="absolute inset-0 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.25],
                y: [0, -5],
              }}
              transition={{
                scale: { duration: 8, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              }}
            >
              <div className="relative h-full w-full">
                <img
                  src="/pinterest/office/city.png"
                  alt="City office view"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: [0.1, 0.15, 0.1, 0.18, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.15) 100%)",
              }}
            />

            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: [0.2, 0.35, 0.25, 0.4, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "radial-gradient(ellipse at 55% 25%, rgba(139, 154, 181, 0.08) 0%, transparent 50%)",
              }}
            />

            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 70}%`,
                  width: 1 + Math.random() * 2,
                  height: 1 + Math.random() * 2,
                }}
                animate={{
                  y: [0, -35],
                  x: [0, 8],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  delay: Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}

            <AnimatePresence>
              {showWalkText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 font-game-serif text-sm tracking-widest text-white/50"
                >
                  Walking to the office...
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "office-reveal" && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <img
                src="/pinterest/office/office_map.jpg"
                alt="Office interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 25% 15%, rgba(139, 154, 181, 0.3) 0%, transparent 55%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-game-serif text-6xl md:text-8xl font-bold text-cream-100 tracking-[0.3em] uppercase mb-12"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}
            >
              OFFICE
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <motion.button
                type="button"
                onClick={handleStart}
                className="px-16 py-4 bg-[#7B9AB5] text-white text-2xl font-serif tracking-[0.2em] uppercase hover:bg-[#5B7A95] transition-colors rounded-full shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  </>
);
}