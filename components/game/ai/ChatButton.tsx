"use client";

import { motion } from "framer-motion";
import { MessageCircleHeart } from "lucide-react";

export interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#A97D67] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#8B6B56] transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <MessageCircleHeart className="w-6 h-6" />
      <span className="absolute -top-8 right-0 bg-[#F7E8E1] text-[#6B4C3B] text-xs px-2 py-1 rounded-full whitespace-nowrap">
        Ask Her
      </span>
    </motion.button>
  );
}