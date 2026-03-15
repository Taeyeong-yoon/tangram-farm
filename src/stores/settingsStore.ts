import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  language: 'ko' | 'en';
  reducedMotion: boolean;
  setSoundEnabled: (v: boolean) => void;
  setMusicEnabled: (v: boolean) => void;
  setDifficulty: (v: 'easy' | 'normal' | 'hard') => void;
  setLanguage: (v: 'ko' | 'en') => void;
  setReducedMotion: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      musicEnabled: false,
      difficulty: 'normal',
      language: 'ko',
      reducedMotion: false,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setLanguage: (language) => set({ language }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    { name: 'tangram-farm-settings-v1' }
  )
);
