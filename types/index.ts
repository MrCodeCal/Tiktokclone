export interface User {
  id: string;
  username: string;
  avatar: string;
  followers: number;
  following: number;
  bio?: string;
}

export interface Video {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked?: boolean;
  isPrivate?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  text: string;
  likes: number;
  createdAt: string;
}