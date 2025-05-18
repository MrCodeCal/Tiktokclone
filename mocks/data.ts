import { User, Video, Comment } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'dancingqueen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    followers: 1200000,
    following: 125,
    bio: 'Professional dancer | Content creator | Living my best life ✨'
  },
  {
    id: '2',
    username: 'travelguy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    followers: 850000,
    following: 342,
    bio: 'Exploring the world one video at a time 🌎'
  },
  {
    id: '3',
    username: 'foodielicious',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    followers: 2300000,
    following: 231,
    bio: 'Cooking up delicious content | Food enthusiast | Recipe creator 🍕'
  },
  {
    id: '4',
    username: 'fitnessguru',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    followers: 1500000,
    following: 89,
    bio: 'Fitness coach | Healthy lifestyle | Motivation 💪'
  },
  {
    id: '5',
    username: 'comedyking',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    followers: 3200000,
    following: 156,
    bio: 'Making you laugh since 2018 😂'
  }
];

export const mockVideos: Video[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-happily-in-a-field-4702-large.mp4',
    description: 'Dancing in the sunset ✨ #dance #sunset #vibes',
    likes: 245000,
    comments: 1200,
    shares: 18000,
    createdAt: '2023-09-15T14:30:00Z'
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    description: 'City lights never get old 🌃 #travel #cityscape #nightlife',
    likes: 189000,
    comments: 890,
    shares: 12000,
    createdAt: '2023-09-14T18:45:00Z'
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-with-a-pan-on-a-stove-2753-large.mp4',
    description: 'Easy pasta recipe you NEED to try! 🍝 #food #recipe #cooking',
    likes: 320000,
    comments: 2100,
    shares: 45000,
    createdAt: '2023-09-13T12:15:00Z'
  },
  {
    id: '4',
    userId: '4',
    user: mockUsers[3],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-exercises-at-home-4027-large.mp4',
    description: '5-minute morning workout routine 💪 #fitness #workout #morning',
    likes: 278000,
    comments: 1500,
    shares: 32000,
    createdAt: '2023-09-12T08:20:00Z'
  },
  {
    id: '5',
    userId: '5',
    user: mockUsers[4],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32809-large.mp4',
    description: 'When the beat drops 🎵 #funny #dance #comedy',
    likes: 412000,
    comments: 3200,
    shares: 56000,
    createdAt: '2023-09-11T20:10:00Z'
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers[1],
    text: "This is amazing! Can't stop watching 😍",
    likes: 1200,
    createdAt: '2023-09-15T15:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers[2],
    text: "You're so talented! Keep it up 👏",
    likes: 890,
    createdAt: '2023-09-15T16:45:00Z'
  },
  {
    id: '3',
    userId: '4',
    user: mockUsers[3],
    text: "This just made my day better ❤️",
    likes: 750,
    createdAt: '2023-09-15T17:20:00Z'
  },
  {
    id: '4',
    userId: '5',
    user: mockUsers[4],
    text: "I need to learn how to do this!",
    likes: 620,
    createdAt: '2023-09-15T18:10:00Z'
  },
  {
    id: '5',
    userId: '1',
    user: mockUsers[0],
    text: "Perfect vibes for the weekend 🔥",
    likes: 980,
    createdAt: '2023-09-15T19:05:00Z'
  }
];