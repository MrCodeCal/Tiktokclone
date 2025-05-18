import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '@/types';
import { mockVideos } from '@/mocks/data';

interface VideoState {
  videos: Video[];
  likedVideos: string[];
  currentVideoIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  likeVideo: (videoId: string) => void;
  unlikeVideo: (videoId: string) => void;
  setCurrentVideoIndex: (index: number) => void;
  addVideo: (video: Video) => void;
  fetchVideos: () => Promise<void>;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      videos: [],
      likedVideos: [],
      currentVideoIndex: 0,
      isLoading: false,
      error: null,
      
      likeVideo: (videoId: string) => {
        set((state) => {
          // Update videos array
          const updatedVideos = state.videos.map(video => 
            video.id === videoId 
              ? { ...video, likes: video.likes + 1, isLiked: true } 
              : video
          );
          
          // Add to liked videos if not already there
          const updatedLikedVideos = state.likedVideos.includes(videoId)
            ? state.likedVideos
            : [...state.likedVideos, videoId];
            
          return { 
            videos: updatedVideos,
            likedVideos: updatedLikedVideos
          };
        });
      },
      
      unlikeVideo: (videoId: string) => {
        set((state) => {
          // Update videos array
          const updatedVideos = state.videos.map(video => 
            video.id === videoId 
              ? { ...video, likes: Math.max(0, video.likes - 1), isLiked: false } 
              : video
          );
          
          // Remove from liked videos
          const updatedLikedVideos = state.likedVideos.filter(id => id !== videoId);
            
          return { 
            videos: updatedVideos,
            likedVideos: updatedLikedVideos
          };
        });
      },
      
      setCurrentVideoIndex: (index: number) => {
        set({ currentVideoIndex: index });
      },
      
      addVideo: (video: Video) => {
        set((state) => ({
          videos: [video, ...state.videos]
        }));
      },
      
      fetchVideos: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just use our mock data with a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get existing videos
          const existingVideos = get().videos;
          
          // If we already have videos, don't overwrite with mock data
          if (existingVideos.length === 0) {
            // Mark videos as liked if they're in the likedVideos array
            const likedVideos = get().likedVideos;
            const videosWithLikeStatus = mockVideos.map(video => ({
              ...video,
              isLiked: likedVideos.includes(video.id)
            }));
            
            set({ videos: videosWithLikeStatus, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'video-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        likedVideos: state.likedVideos,
        videos: state.videos 
      }),
    }
  )
);