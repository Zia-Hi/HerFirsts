"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { SCENE_IDS } from "@/lib/game";
import { PostCard, ReplyModal, SearchBar, PostModal } from "../ui";
import { ForumPost, Reply } from "../types/forum";
import { getForumData, saveForumData, getOrCreateUserProfile } from "@/lib/forumStorage";

const MOCK_TAGS = ["生活技巧", "装修经验", "安全知识", "职场心得", "旅行分享", "情感交流", "美食烹饪", "宠物养护"];

export function ForumScene() {
  const { transitionToScene } = useSceneTransition();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [userProfile] = useState(() => getOrCreateUserProfile());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const forumData = getForumData();
    setPosts(forumData.posts);
    setTimeout(() => setShowContent(true), 300);
  }, []);

  useEffect(() => {
    saveForumData({ posts, userLikes: {} });
  }, [posts]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCreatePost = (newPost: Omit<ForumPost, "id" | "timestamp" | "likes" | "replies" | "isLiked">) => {
    const post: ForumPost = {
      ...newPost,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
    };
    setPosts((prev) => [post, ...prev]);
    setShowPostModal(false);
  };

  const handleReply = (postId: string, content: string) => {
    const reply: Reply = {
      id: crypto.randomUUID(),
      author: userProfile.name,
      avatar: userProfile.avatar,
      content,
      timestamp: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, replies: [...post.replies, reply] } : post
      )
    );
    setShowReplyModal(false);
    setSelectedPost(null);
  };

  const handleViewReplies = (post: ForumPost) => {
    setSelectedPost(post);
    setShowReplyModal(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src="/images/zhuyeback1.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "blur(16px) brightness(0.75)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B7355]/30 via-transparent to-[#5D4A37]/40"></div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -30 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-30"
      >
        <div className="bg-[#5D4A37]/80 backdrop-blur-md border-b border-[#8B7355]/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A97D67] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide">HER FIRSTS 论坛</h1>
                <p className="text-xs text-[#E9CFC3]/70">分享你的独居生活故事</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={() => setShowPostModal(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#A97D67] text-white shadow-lg hover:bg-[#966B57] transition-colors cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
                <span className="text-sm font-medium">发布帖子</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => void transitionToScene(SCENE_IDS.GAME_HOMEPAGE)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer border border-white/20"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-sm font-medium">返回 MENU</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-[14%] left-8 right-8 z-20"
      >
        <div className="bg-[#5D4A37]/60 backdrop-blur-md rounded-xl shadow-xl p-4 mb-4 border border-[#8B7355]/30">
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#E9CFC3]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h2 className="text-lg font-bold text-white">热门帖子</h2>
          </div>

          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          <div className="flex flex-wrap gap-2 mt-4">
            <motion.button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                !selectedTag
                  ? "bg-[#A97D67] text-white"
                  : "bg-white/10 text-[#E9CFC3] hover:bg-white/20 border border-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              全部
            </motion.button>
            {MOCK_TAGS.map((tag) => (
              <motion.button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? "bg-[#A97D67] text-white"
                    : "bg-white/10 text-[#E9CFC3] hover:bg-white/20 border border-white/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="h-[68vh] overflow-y-auto pr-2 scrollbar-thin">
          <div className="space-y-4">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onViewReplies={handleViewReplies}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-[#5D4A37]/50 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#A97D67]/50 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                <p className="text-white">没有找到相关帖子</p>
                <p className="text-sm text-[#E9CFC3]/70 mt-1">试试其他关键词或标签吧~</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPostModal && (
          <PostModal onClose={() => setShowPostModal(false)} onSubmit={handleCreatePost} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplyModal && selectedPost && (() => {
          const currentPostId = selectedPost.id;
          const currentPost = selectedPost;
          return (
            <ReplyModal
              key={currentPostId}
              post={currentPost}
              onClose={() => {
                setShowReplyModal(false);
                setSelectedPost(null);
              }}
              onReply={(replyContent: string) => handleReply(currentPostId, replyContent)}
            />
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
