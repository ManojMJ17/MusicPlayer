import AsyncStorage from '@react-native-async-storage/async-storage';

import { Song } from '@/types/music';

const LIBRARY_CACHE_KEY = '@music/library';

class LibraryCacheService {
  async get(): Promise<Song[] | null> {
    const json = await AsyncStorage.getItem(LIBRARY_CACHE_KEY);

    if (!json) return null;

    return JSON.parse(json);
  }

  async set(songs: Song[]) {
    await AsyncStorage.setItem(LIBRARY_CACHE_KEY, JSON.stringify(songs));
  }

  async clear() {
    await AsyncStorage.removeItem(LIBRARY_CACHE_KEY);
  }
}

export const libraryCacheService = new LibraryCacheService();
