import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { ThemeName } from '@/theme/types';

const STORAGE_KEY = 'music-player-theme';

interface ThemeStore {
  theme: ThemeName;
  isLoaded: boolean;

  setTheme: (theme: ThemeName) => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'amoled',
  isLoaded: false,

  async setTheme(theme) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, theme);

      set({
        theme,
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },

  async loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);

      if (
        savedTheme === 'dark' ||
        savedTheme === 'amoled' ||
        savedTheme === 'ocean' ||
        savedTheme === 'forest' ||
        savedTheme === 'gruvbox'
      ) {
        set({
          theme: savedTheme,
          isLoaded: true,
        });

        return;
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }

    set({
      theme: 'amoled',
      isLoaded: true,
    });
  },
}));

// Load theme immediately on store creation
void useThemeStore.getState().loadTheme();

