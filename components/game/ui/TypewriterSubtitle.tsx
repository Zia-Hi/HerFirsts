"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameAudio } from "@/hooks/useGameAudio";

interface TypewriterSubtitleProps {
  text: string | null;
}

export function TypewriterSubtitle({ text }: TypewriterSubtitleProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { play } = useGameAudio();

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      setIsTyping(false);
      return;
    }

    setDisplayText("");
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        play("paper-rustle", 0.08);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [text, play]);

  return (
    <AnimatePresence>
      {text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 max-w-lg px-6"
        >
          <div 
            className="rounded-2xl shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 50%, #dcc4a0 100%)",
              border: "2px solid rgba(139, 90, 43, 0.3)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
            }}
          >
            <p 
              className="font-game-serif text-base md:text-lg text-gray-800 py-5 px-6 leading-relaxed"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontStyle: "italic",
                letterSpacing: "0.02em",
              }}
            >
              {displayText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  |
                </motion.span>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}