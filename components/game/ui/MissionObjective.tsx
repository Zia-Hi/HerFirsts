"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MissionObjectiveProps {
  objective: string;
  visible: boolean;
  phase?: string;
}

export function MissionObjective({ objective, visible, phase }: MissionObjectiveProps) {
  return (
    <AnimatePresence>
      {visible && objective && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute right-6 top-6 z-30 max-w-xs"
        >
          <div className="border-l-2 border-sage-400/60 pl-4">
            {phase && (
              <p className="font-game-sans mb-1 text-[10px] uppercase tracking-[0.2em] text-sage-400/80">
                {phase}
              </p>
            )}
            <p className="font-game-serif text-sm leading-relaxed text-cream-100/85 md:text-base">
              {objective}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
