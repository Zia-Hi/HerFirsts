"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { KnowledgeNotebook, SubtitleOverlay } from "@/components/game/ui";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { SCENE_IDS, wait } from "@/lib/game";
import { audioManager } from "@/lib/game/audio-manager";
import { useApartmentStore, useGameStore, useKnowledgeStore } from "@/store";
import type { OpeningPhase } from "@/types";

type KeyPhase = "idle" | "insert" | "turn" | "done";

export function OpeningScene() {
  const [phase, setPhase] = useState<OpeningPhase>("black");
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [keyPhase, setKeyPhase] = useState<KeyPhase>("idle");
  const [doorOpen, setDoorOpen] = useState(false);
  const [showWalkText, setShowWalkText] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotebookHint, setShowNotebookHint] = useState(false);

  const { transitionToScene } = useSceneTransition();
  const { play, stop } = useGameAudio();

  const openNotebook = useKnowledgeStore((s) => s.openNotebook);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const enableMovement = useApartmentStore((s) => s.enableMovement);
  const setPlayerHasControl = useGameStore((s) => s.setPlayerHasControl);
  const setCurrentScene = useGameStore((s) => s.setCurrentScene);
  const setTransitionState = useGameStore((s) => s.setTransitionState);
  const cards = useKnowledgeStore((s) => s.cards);
  const notebookOpen = useKnowledgeStore((s) => s.notebookOpen);
  const activeCardId = useKnowledgeStore((s) => s.activeCardId);
  const closeNotebook = useKnowledgeStore((s) => s.closeNotebook);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const isFirstMenu = useGameStore((s) => s.isFirstMenu);
  const setIsFirstMenu = useGameStore((s) => s.setIsFirstMenu);
  const setMission2Started = useGameStore((s) => s.setMission2Started);

  const runSequence = useCallback(async () => {
    setGamePhase("opening");

    if (!isFirstMenu) {
      setPhase("apartment-reveal");
      play("ambient-apartment");
      await wait(500);
      setShowMenu(true);
      return;
    }

    setPhase("black");
    await wait(1500);

    setPhase("subtitle");
    setSubtitle("One month after graduation.");
    await wait(500);
    await wait(1000);
    await wait(2000);
    setSubtitle(null);
    await wait(800);

    setPhase("street-view");
    play("ambient-city", 0.3);
    await wait(2000);

    setShowWalkText(true);
    setSubtitle("You've come to the city.");
    await wait(2000);
    setSubtitle("Your first home awaits.");
    await wait(2500);

    setPhase("brightening");
    setSubtitle(null);
    setShowWalkText(false);
    await wait(1500);

    stop("ambient-city");
    audioManager.setChannelVolume("music", 0.6);
    setPhase("key-hold");
  }, [play, setGamePhase, stop, isFirstMenu]);

  useEffect(() => {
    void runSequence();
  }, [runSequence]);

  useEffect(() => {
    if (phase === "street-view") {
      const interval = setInterval(() => {
        play("footstep-wood", 0.2);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [phase, play]);

  const handleKeyClick = useCallback(async () => {
    if (phase !== "key-hold" && phase !== "door-exterior") return;
    if (keyPhase !== "idle") return;

    audioManager.play("background-music", { channel: "music", loop: true, volume: 0.6 });

    setKeyPhase("insert");
    play("key-jingle");
    await wait(600);

    setKeyPhase("turn");
    play("door-unlock");
    await wait(800);

    setKeyPhase("done");
    setPhase("door-open");
    play("door-open");
    setDoorOpen(true);
    await wait(2000);

    setPhase("apartment-reveal");
    play("ambient-apartment");
    await wait(1500);

    setShowMenu(true);
  }, [keyPhase, phase, play, enableMovement, setGamePhase, setPlayerHasControl, setCurrentScene, setTransitionState]);

  const handleStart = useCallback(async () => {
    setShowMenu(false);
    if (isFirstMenu) {
      setIsFirstMenu(false);
    } else if (completedMissions.length > 0) {
      setMission2Started(true);
    }
    await wait(500);
    setPhase("complete");
    enableMovement(true);
    setPlayerHasControl(true);
    setGamePhase("apartment");
    setCurrentScene(SCENE_IDS.APARTMENT);
    setTransitionState("idle");
  }, [enableMovement, setGamePhase, setPlayerHasControl, setCurrentScene, setTransitionState, isFirstMenu, setIsFirstMenu, completedMissions, setMission2Started]);

  const handleNotebook = useCallback(() => {
    if (cards.length === 0) {
      setShowNotebookHint(true);
      setTimeout(() => {
        setShowNotebookHint(false);
      }, 1500);
    } else {
      openNotebook();
    }
  }, [cards, openNotebook]);

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
              background: "radial-gradient(circle at 50% 50%, rgba(245, 230, 200, 0.9) 0%, rgba(245, 230, 200, 0.5) 30%, rgba(245, 230, 200, 0) 70%)",
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
        {phase === "street-view" && (
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
                <Image
                  src="/images/open_scene.png"
                  alt="City street at sunset"
                  fill
                  className="object-cover"
                  priority
                  quality={100}
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
                background: "radial-gradient(ellipse at 55% 25%, rgba(255,180,100,0.08) 0%, transparent 50%)",
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
                  Walking home...
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {(phase === "door-exterior" || phase === "key-hold" || phase === "door-open") && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #2a241e 0%, #1f1b18 40%, #151311 100%)",
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-beige-900/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-center mb-8"
              >
                <h1 className="font-game-cursive text-7xl md:text-9xl font-bold text-cream-100" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
                  HER FIRSTS
                </h1>
                <p className="font-game-serif text-xl md:text-2xl mt-4 text-cream-200/80 tracking-[0.4em] italic">
                  Every first time deserves confidence.
                </p>
              </motion.div>

              <motion.div className="relative" style={{ height: "50vh", width: "auto" }}>
                <motion.div
                  className="relative h-[50vh] w-[35vh] origin-left"
                  animate={{
                    rotateY: doorOpen ? -75 : 0,
                  }}
                  transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ transformStyle: "preserve-3d", perspective: 800 }}
                >
                  <div
                    className="absolute inset-0 border-2 border-oak-500/40"
                    style={{ backgroundColor: "#5a4a38" }}
                  >
                    <div className="absolute right-6 top-1/2 h-3 w-3 rounded-full bg-gold-400/70" />
                    <p className="font-game-serif absolute bottom-8 left-0 right-0 text-center text-lg tracking-widest text-cream-200/60">
                      302
                    </p>
                    <div className="absolute top-6 left-4 right-4 h-12 bg-oak-600/20" />
                  </div>
                </motion.div>

                {doorOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -right-32 top-0 h-full w-64"
                    style={{
                      background: "radial-gradient(ellipse at left, rgba(217, 194, 142, 0.6) 0%, rgba(255,212,128,0.3) 40%, transparent 70%)",
                    }}
                  />
                )}

                {(phase === "key-hold" || keyPhase !== "idle") && !doorOpen && (
                  <motion.button
                    type="button"
                    onClick={() => void handleKeyClick()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute -bottom-20 -left-24 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="h-28 w-20 rounded-t-full bg-cream-200/25 blur-sm" />
                      <div className="absolute bottom-4 left-5 h-14 w-10">
                        <div className="h-5 w-5 rounded-full border-3 border-gold-400/70 bg-gold-500/40" />
                        <div className="ml-2 h-8 w-1 bg-gold-400/70" />
                      </div>
                    </div>
                    <p className="font-game-sans mt-3 text-sm uppercase tracking-widest text-cream-200/50">
                      Click to use key
                    </p>
                  </motion.button>
                )}
              </motion.div>
            </div>

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`dust-${i}`}
                className="absolute rounded-full bg-cream-100/15"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 50}%`,
                  width: 1 + Math.random() * 1.5,
                  height: 1 + Math.random() * 1.5,
                }}
                animate={{
                  y: [0, -15],
                  x: [0, 5],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  delay: Math.random() * 4,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        )}

        {phase === "apartment-reveal" && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/landing_page.png"
                alt="Apartment interior"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 25% 15%, rgba(217, 194, 142, 0.3) 0%, transparent 55%)",
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
              className="font-game-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-cream-100 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-8 sm:mb-12"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}
            >
              Home
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col gap-4 sm:gap-6"
            >
              <motion.button
                type="button"
                onClick={handleStart}
                className="px-8 sm:px-12 md:px-16 py-3 sm:py-4 bg-[#5d4a37] text-white text-lg sm:text-xl md:text-2xl font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!isFirstMenu && completedMissions.length > 0 ? "CONTINUE" : "START"}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleNotebook}
                className="px-8 sm:px-12 md:px-16 py-3 sm:py-4 bg-white/10 text-white text-lg sm:text-xl md:text-2xl font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase hover:bg-white/20 transition-colors rounded-full shadow-xl border border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                NOTEBOOK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotebookHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[100] flex items-end justify-center pb-20"
          >
            <div className="bg-[#f5e6d3] px-8 py-6 rounded-lg shadow-2xl border-2 border-[#5d4a37]">
              <p className="text-[#5d4a37] text-xl font-serif text-center">
                还未收集技能卡哦~先去完成任务吧！
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

    <KnowledgeNotebook
      open={notebookOpen}
      card={activeCardId ? cards.find((c) => c.id === activeCardId) ?? null : null}
      onClose={closeNotebook}
    />
  </>
);
}