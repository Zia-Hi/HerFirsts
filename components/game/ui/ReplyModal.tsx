"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ForumPost } from "../types/forum";
import { formatTimestamp } from "@/lib/forumStorage";

interface ReplyModalProps {
  post: ForumPost;
  onClose: () => void;
  onReply: (content: string) => void;
}

export function ReplyModal({ post, onClose, onReply }: ReplyModalProps) {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = () => {
    if (!replyContent.trim()) return;
    onReply(replyContent.trim());
    setReplyContent("");
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
        className="relative w-[90%] max-w-lg bg-[#F7E8E1] rounded-3xl shadow-2xl overflow-hidden max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#A97D67] to-[#E9CFC3] px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">帖子详情</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#E9CFC3] flex items-center justify-center text-xl flex-shrink-0">
              {post.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#5D4A37]">{post.author}</span>
                <span className="text-xs text-[#8B7A6A]">{formatTimestamp(post.timestamp)}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-[#E9CFC3]/60 text-[#8B6B5B] text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#5D4A37] mb-2">{post.title}</h3>
          <p className="text-[#6B5A4A] leading-relaxed mb-4">{post.content}</p>

          {post.image && (
            <div className="rounded-xl overflow-hidden mb-4">
              <img src={post.image} alt="Post image" className="w-full h-48 object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-[#8B7A6A]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {post.likes} 赞
            </span>
            <span className="text-sm text-[#8B7A6A]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {post.replies.length} 回复
            </span>
          </div>

          <div className="border-t border-[#E9CFC3]/50 pt-4">
            <h4 className="font-semibold text-[#5D4A37] mb-3">评论 ({post.replies.length})</h4>

            <AnimatePresence>
              {post.replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 mb-4"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E9CFC3] flex items-center justify-center text-lg flex-shrink-0">
                    {reply.avatar}
                  </div>
                  <div className="flex-1 bg-white/70 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#5D4A37] text-sm">{reply.author}</span>
                      <span className="text-xs text-[#8B7A6A]">{formatTimestamp(reply.timestamp)}</span>
                    </div>
                    <p className="text-[#6B5A4A] text-sm">{reply.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {post.replies.length === 0 && (
              <div className="text-center py-8 text-[#8B7A6A]">
                <svg viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-sm">暂无评论，快来抢沙发~</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#E9CFC3]/50 bg-white/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="写下你的评论..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/70 border border-[#E9CFC3] focus:outline-none focus:border-[#A97D67] text-[#5D4A37]"
              maxLength={200}
            />
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!replyContent.trim()}
              className="px-4 py-2 rounded-xl bg-[#A97D67] text-white hover:bg-[#966B57] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
