"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneTransition } from "@/hooks/useSceneTransition";
  import { useGameAudio } from "@/hooks/useGameAudio";
  import { useGameStore } from "@/store/game-store";
  import { SCENE_IDS } from "@/lib/game";

const ENDING_LETTER_CONTENT = [
  "亲爱的女孩，生活依然会不断出现新的第一次。",
  "",
  "愿下一次面对未知时，",
  "你不再慌张无措。",
  "",
  "而是知道",
  "自己可以从哪里开始。",
];

type EndingPhase = "video" | "video-fade" | "title";

export function GameEndingScene() {
  const [phase, setPhase] = useState<EndingPhase>("video");
  const [showLetter, setShowLetter] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [showBackToHomeButton, setShowBackToHomeButton] = useState(false);
  const [videoPoster, setVideoPoster] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { transitionToScene } = useSceneTransition();
  const { play } = useGameAudio();
  const { setEndingShown } = useGameStore();

  useEffect(() => {
    play("mission-success", 0.5);
  }, [play]);

  const handleVideoEnded = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setVideoPoster(canvas.toDataURL("image/jpeg"));
      }
    }
    // 标记结束画面已播放，防止重复播放
    setEndingShown(true);
    setPhase("video-fade");
    setTimeout(() => {
      setPhase("title");
    }, 1500);
  };

  const handleViewLetter = () => {
    play("ui-confirm");
    setShowLetter(true);
  };

  const handleOpenLetter = () => {
    play("ui-confirm");
    setLetterOpened(true);
  };

  const handleCloseLetter = () => {
    play("ui-cancel");
    setShowLetter(false);
    setLetterOpened(false);
    setTimeout(() => {
      setShowBackToHomeButton(true);
    }, 500);
  };

  const handleBackToHome = () => {
    play("ui-confirm");
    void transitionToScene(SCENE_IDS.GAME_HOMEPAGE);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence>
        {(phase === "video" || phase === "video-fade") && (
          <motion.div
            key="video"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "video-fade" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src="/images/end.mp4"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        )}

        {phase === "title" && !showLetter && !showBackToHomeButton && (
          <motion.div
            key="title-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {videoPoster && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 0.5, filter: "blur(8px)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={videoPoster}
                  alt="Video last frame"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-black"
            />

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-game-serif text-5xl md:text-8xl font-bold text-white tracking-[0.05em] whitespace-nowrap mb-20 z-10"
              style={{
                textShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)",
              }}
            >
              恭喜您完成了所有挑战
            </motion.h1>

            <motion.button
              type="button"
              onClick={handleViewLetter}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              className="px-12 py-4 bg-white/20 backdrop-blur-sm text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-white/30 transition-all rounded-full shadow-xl border border-white/30 z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              查看最后一封信
            </motion.button>
          </motion.div>
        )}

        {showBackToHomeButton && !showLetter && (
          <motion.div
            key="back-home-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {videoPoster && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 0.5, filter: "blur(8px)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={videoPoster}
                  alt="Video last frame"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-black"
            />

            <motion.button
              type="button"
              onClick={handleBackToHome}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="px-12 py-4 bg-white/20 backdrop-blur-sm text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-white/30 transition-all rounded-full shadow-xl border border-white/30 z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              返回 HOME
            </motion.button>
          </motion.div>
        )}

        {showLetter && (
          <motion.div
            key="letter-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleCloseLetter}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0 
              }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {!letterOpened && (
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: -160 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative cursor-pointer"
                  onClick={handleOpenLetter}
                >
                  <div
                    className="w-80 h-56 relative"
                    style={{ perspective: "1000px" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4b594] via-[#c4a67a] to-[#a68b5b] rounded-xl shadow-2xl" />
                    
                    <div className="absolute inset-2 bg-[#f5e6d3] rounded-lg" />
                    
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <motion.div
                        animate={{ rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 opacity-20"
                      >
                        <div className="w-full h-full border-4 border-[#8b7d6b] rounded-full" />
                        <div className="absolute inset-4 border-2 border-[#8b7d6b] rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#8b7d6b] rounded-full" />
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ height: "100%" }}
                      animate={{ height: 0 }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 right-0 h-full origin-top"
                      style={{ transformOrigin: "top" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#e8d4b8] via-[#d4b594] to-[#c4a67a] rounded-t-xl shadow-lg" />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#8b7d6b] rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-[#8b7d6b] rounded-full" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-8 left-0 right-0 text-center"
                    >
                      <p className="text-[#8b7d6b] font-serif text-lg tracking-wider opacity-80">
                        点击打开信封
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {letterOpened && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="relative max-w-lg w-full mx-4"
                  style={{
                    background: "linear-gradient(135deg, #fdfbf7 0%, #f5e6d3 50%, #e8d5b7 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="p-10 border-4 border-[#8b7d6b]/20" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 28px, rgba(139,125,107,0.06) 28px, rgba(139,125,107,0.06) 29px)" }}>
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-px bg-[#8b7d6b]/40" />
                        <div className="w-3 h-3 rounded-full bg-[#c4a67a]" />
                        <div className="w-16 h-px bg-[#8b7d6b]/40" />
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                      {ENDING_LETTER_CONTENT.map((line, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="text-[#4a3a2a] leading-relaxed text-lg"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {line || "\u00A0"}
                        </motion.p>
                      ))}
                    </div>

                    <div className="flex justify-center mt-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-px bg-[#8b7d6b]/40" />
                        <div className="w-3 h-3 rounded-full bg-[#c4a67a]" />
                        <div className="w-16 h-px bg-[#8b7d6b]/40" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-40 bg-[#c4a77d] rounded-l-lg" />
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-34 bg-[#a68b5b]" />

                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-40 bg-[#c4a77d] rounded-r-lg" />
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-34 bg-[#a68b5b]" />

                  <div className="p-6 flex justify-center">
                    <motion.button
                      type="button"
                      onClick={handleCloseLetter}
                      className="px-8 py-3 bg-[#5d4a37] text-white text-base font-serif tracking-wider hover:bg-[#4a3a2a] transition-colors rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      收起信件
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
