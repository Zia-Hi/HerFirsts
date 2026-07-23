import { ForumPost, Reply } from "@/components/game/types/forum";
import initialData from "@/data/forum.json";

const STORAGE_KEY = "herfirsts_forum_data";

export interface ForumStorage {
  posts: ForumPost[];
  userLikes: Record<string, boolean>;
}

export function getForumData(): ForumStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("[Forum Storage] Failed to parse stored data:", error);
  }

  return {
    posts: initialData.posts.map(post => ({ ...post, isLiked: false })),
    userLikes: {},
  };
}

export function saveForumData(data: ForumStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("[Forum Storage] Failed to save data:", error);
  }
}

export function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return date.toLocaleDateString("zh-CN");
}

export function generateUserId(): string {
  let userId = localStorage.getItem("herfirsts_user_id");
  if (!userId) {
    userId = "user_" + crypto.randomUUID().slice(0, 8);
    localStorage.setItem("herfirsts_user_id", userId);
  }
  return userId;
}

export function getOrCreateUserProfile(): { name: string; avatar: string } {
  const profiles = [
    { name: "小太阳", avatar: "😊" },
    { name: "星星", avatar: "✨" },
    { name: "云朵", avatar: "☁️" },
    { name: "小花", avatar: "🌸" },
    { name: "守护者", avatar: "🛡️" },
    { name: "美食家", avatar: "🍳" },
    { name: "萌新", avatar: "🌱" },
    { name: "过来人", avatar: "💼" },
    { name: "咖啡控", avatar: "☕" },
    { name: "旅行者", avatar: "🌍" },
    { name: "月光", avatar: "🌙" },
    { name: "彩虹", avatar: "🌈" },
    { name: "清风", avatar: "🍃" },
    { name: "暖阳", avatar: "☀️" },
    { name: "星空", avatar: "⭐" },
  ];
  
  let profile = localStorage.getItem("herfirsts_user_profile");
  if (!profile) {
    const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
    profile = JSON.stringify(randomProfile);
    localStorage.setItem("herfirsts_user_profile", profile);
  }
  
  return JSON.parse(profile);
}
