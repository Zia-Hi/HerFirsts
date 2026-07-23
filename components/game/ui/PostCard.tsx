"use client";

import { motion } from "framer-motion";
import { ForumPost } from "../types/forum";
import { formatTimestamp } from "@/lib/forumStorage";

interface PostCardProps {
  post: ForumPost;
  onLike: (postId: string) => void;
  onViewReplies: (post: ForumPost) => void;
}

export function PostCard({ post, onLike, onViewReplies }: PostCardProps) {
  return (
    <motion.div
      className="bg-[#5D4A37]/70 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-[#8B7355]/30"
      whileHover={{ scale: 1.01, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#A97D67]/40 flex items-center justify-center text-xl flex-shrink-0 border border-[#A97D67]/50">
            {post.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">{post.author}</span>
              <span className="text-xs text-[#E9CFC3]/60">{formatTimestamp(post.timestamp)}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-[#A97D67]/30 text-[#E9CFC3] text-xs border border-[#A97D67]/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-[#E9CFC3]/80 text-sm leading-relaxed line-clamp-3">{post.content}</p>

        {post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 rounded-lg overflow-hidden border border-[#8B7355]/30"
          >
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-48 object-cover"
            />
          </motion.div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#8B7355]/30">
          <motion.button
            type="button"
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              post.isLiked
                ? "bg-[#E9CFC3] text-[#A97D67]"
                : "bg-white/10 text-[#E9CFC3] hover:bg-white/20 border border-white/10"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-sm font-medium">{post.likes}</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onViewReplies(post)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#E9CFC3] hover:bg-white/20 transition-colors cursor-pointer border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="text-sm font-medium">{post.replies.length} 回复</span>
          </motion.button>

          <motion.button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#E9CFC3] hover:bg-white/20 transition-colors cursor-pointer border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="text-sm font-medium">分享</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
