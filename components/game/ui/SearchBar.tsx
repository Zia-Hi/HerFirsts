"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-center bg-white/10 rounded-lg border border-white/20 overflow-hidden">
        <div className="pl-4 text-[#E9CFC3]/60">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索帖子标题、内容或标签..."
          className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-white placeholder-[#E9CFC3]/50"
        />
        {searchQuery && (
          <motion.button
            type="button"
            onClick={() => onSearchChange("")}
            className="pr-3 text-[#E9CFC3]/60 hover:text-white transition-colors cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
