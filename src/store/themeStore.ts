import { create } from 'zustand';

export type ThemeId = 'warm' | 'ocean' | 'earth' | 'sunset' | 'glass';

interface ThemeState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'warm',
  setTheme: (t) => {
    document.documentElement.setAttribute('data-theme', t);
    set({ theme: t });
  }
}));
