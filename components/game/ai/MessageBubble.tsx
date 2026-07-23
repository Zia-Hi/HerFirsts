"use client";

import { motion } from "framer-motion";

export interface MessageBubbleProps {
  message: string;
  isUser: boolean;
}

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-[#A97D67] text-white rounded-tr-sm"
            : "bg-white/80 backdrop-blur-sm text-[#6B4C3B] rounded-tl-sm shadow-sm"
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}