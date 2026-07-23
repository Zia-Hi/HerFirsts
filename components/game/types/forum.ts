export interface ForumPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
  author: string;
  avatar: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
  isLiked: boolean;
}

export interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}