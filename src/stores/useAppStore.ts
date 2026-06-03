// ============================================
// CodeQuest — App Store (Zustand)
// General application state
// ============================================

import { create } from 'zustand';

interface AppState {
  // Onboarding
  hasCompletedOnboarding: boolean;
  selectedLanguage: string | null;
  dailyGoalMinutes: number;

  // UI State
  isTabBarVisible: boolean;
  activeTab: string;

  // Actions
  completeOnboarding: () => void;
  setSelectedLanguage: (lang: string) => void;
  setDailyGoal: (minutes: number) => void;
  setTabBarVisible: (visible: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  selectedLanguage: null,
  dailyGoalMinutes: 15,
  isTabBarVisible: true,
  activeTab: 'home',

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
  setTabBarVisible: (visible) => set({ isTabBarVisible: visible }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
