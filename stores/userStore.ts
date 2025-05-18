import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { mockUsers } from '@/mocks/data';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: mockUsers[0], // For demo purposes, we'll start logged in
      isAuthenticated: true,     // For demo purposes
      
      login: (user: User) => {
        set({ currentUser: user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      updateProfile: (updates: Partial<User>) => {
        set((state) => ({
          currentUser: state.currentUser 
            ? { ...state.currentUser, ...updates }
            : null
        }));
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);