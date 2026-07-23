"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ForumPost } from "../types/forum";

interface PostModalProps {
  onClose: () => void;
  onSubmit: (post: Omit<ForumPost, "id" | "timestamp" | "likes" | "replies" | "isLiked">) => void;
}

const AVAILABLE_TAGS = ["生活技巧", "装修经验", "安全知识", "职场心得", "旅行分享", "情感交流", "美食烹饪", "宠物养护"];

export function PostModal({ onClose, onSubmit }: PostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [avatar, setAvatar] = useState("😊");

  const avatars = ["😊", "✨", "☁️", "🌸", "🌱", "💼", "☕", "🍳", "🛡️", "🌍", "👩‍💻", "🎨"];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !author.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      image: imageUrl.trim() || undefined,
      tags: selectedTags,
      author: author.trim(),
      avatar,
    });

    setTitle("");
    setContent("");
    setImageUrl("");
    setSelectedTags([]);
    setAuthor("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-[90%] max-w-lg bg-[#F7E8E1] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#A97D67] to-[#E9CFC3] px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">发布新帖子</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5D4A37] mb-2">你的昵称</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="输入昵称"
              className="w-full px-4 py-2 rounded-xl bg-white/70 border border-[#E9CFC3] focus:outline-none focus:border-[#A97D67] text-[#5D4A37]"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5D4A37] mb-2">选择头像</label>
            <div className="flex gap-2 flex-wrap">
              {avatars.map((a) => (
                <motion.button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors cursor-pointer ${
                    avatar === a
                      ? "bg-[#A97D67] text-white"
                      : "bg-white/70 text-[#5D4A37] hover:bg-white"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {a}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5D4A37] mb-2">帖子标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="写一个吸引人的标题..."
              className="w-full px-4 py-2 rounded-xl bg-white/70 border border-[#E9CFC3] focus:outline-none focus:border-[#A97D67] text-[#5D4A37]"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5D4A37] mb-2">标签</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <motion.button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    selectedTags.includes(tag)
                      ? "bg-[#A97D67] text-white"
                      : "bg-white/70 text-[#5D4A37] hover:bg-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  #{tag}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5D4A37] mb-2">帖子内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的故事、经验或问题..."
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-white/70 border border-[#E9CFC3] focus:outline-none focus:border-[#A97D67] text-[#5D4A37] resize-none"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5D4A37] mb-2">图片链接（可选）</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="输入图片URL..."
              className="w-full px-4 py-2 rounded-xl bg-white/70 border border-[#E9CFC3] focus:outline-none focus:border-[#A97D67] text-[#5D4A37]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E9CFC3]/50">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-white/70 text-[#5D4A37] hover:bg-white transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              取消
            </motion.button>
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || !author.trim()}
              className="px-6 py-2 rounded-xl bg-[#A97D67] text-white hover:bg-[#966B57] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              发布
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}