"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white/80 backdrop-blur-sm text-[#6B4C3B] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm">She is thinking...</span>
          <div className="flex gap-1">
            <motion.span
              className="w-2 h-2 bg-[#A97D67] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            />
            <motion.span
              className="w-2 h-2 bg-[#A97D67] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
            />
            <motion.span
              className="w-2 h-2 bg-[#A97D67] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}