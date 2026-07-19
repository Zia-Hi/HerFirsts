"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SubtitleOverlayProps {
  text: string | null;
  visible?: boolean;
}

export function SubtitleOverlay({ text, visible = true }: SubtitleOverlayProps) {
  return (
    <AnimatePresence>
      {visible && text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="pointer-events-none absolute inset-0 z-40 flex items-end justify-center pb-44 px-8"
        >
          <p 
            className="font-game-serif max-w-xl text-center text-2xl font-light tracking-wider text-cream-100 md:text-3xl"
            style={{
              textShadow: "0 0 10px rgba(245, 230, 200, 0.5), 0 0 20px rgba(245, 230, 200, 0.3), 0 0 30px rgba(245, 230, 200, 0.2)",
            }}
          >
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}