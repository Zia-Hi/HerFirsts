"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameAudio } from "@/hooks/useGameAudio";

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoOpen?: boolean;
}

const LETTER_CONTENT = [
  "女孩",
  "第一次，总会有一点手忙脚乱。",
  "有时候，我们害怕开始，其实并不是因为事情太难，只是因为我们太早相信了\"自己不会\"。",
  "可很多能力，从来都不是天生拥有的。",
  "它们只是一次又一次尝试之后，慢慢长出来的。",
  "今天，你或许只是解决了一次网络故障。",
  "但更重要的是，你开始相信:",
  "原来很多事情，我也可以做到。",
  "希望未来，当你面对新的未知时",
  "不会第一时间说\"我不行\"",
  "而是愿意告诉自己:",
  "让我试试看。",
];

export function LetterModal({ isOpen, onClose, autoOpen = false }: LetterModalProps) {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpenComplete, setIsOpenComplete] = useState(false);
  const { play } = useGameAudio();

  const handleClose = () => {
    play("ui-cancel");
    onClose();
  };

  const handleOpenLetter = useCallback(() => {
    play("ui-confirm");
    setIsOpening(true);
    setTimeout(() => {
      setIsOpenComplete(true);
    }, 1500);
  }, [play]);

  useEffect(() => {
    if (isOpen) {
      setIsOpenAnimation(true);
      if (autoOpen) {
        setTimeout(() => {
          handleOpenLetter();
        }, 1500);
      } else {
        setIsOpenComplete(true);
      }
    }
  }, [isOpen, autoOpen, handleOpenLetter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: isOpenAnimation ? 1 : 0, 
              scale: isOpenAnimation ? 1 : 0.8,
              y: isOpenAnimation ? 0 : 50 
            }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!isOpenComplete && (
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpening ? -160 : 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative cursor-pointer"
                onClick={!isOpening ? handleOpenLetter : undefined}
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
                    initial={{ height: 0 }}
                    animate={{ height: isOpening ? 0 : "100%" }}
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
                    animate={!isOpening ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 left-0 right-0 text-center"
                  >
                    <p className="text-[#8b7d6b] font-serif text-lg tracking-wider opacity-80">
                      点击打开信封
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {isOpenComplete && (
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
                    {LETTER_CONTENT.map((line, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className="text-[#4a3a2a] leading-relaxed text-lg"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {line}
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
                    onClick={handleClose}
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

          {isOpenAnimation && !isOpenComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-16 text-white/60 font-serif text-sm tracking-wider"
            >
              来自你的第一封信
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}