import { create } from 'zustand';

import { libraryService } from '@/services/library.service';
import { Album, Artist, Playlist, Song } from '@/types/music';

interface LibraryState {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];

  loading: boolean;
  hasLoaded: boolean;
  error: string | null;

  loadLibrary: () => Promise<void>;
  refreshLibrary: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  songs: [],
  albums: [],
  artists: [],
  playlists: [],

  loading: false,
  hasLoaded: false,
  error: null,

  loadLibrary: async () => {
    if (get().loading || get().hasLoaded) return;

    set({ loading: true, error: null });

    try {
      const [songs, albums, artists, playlists] = await Promise.all([
        libraryService.getSongs(),
        libraryService.getAlbums(),
        libraryService.getArtists(),
        libraryService.getPlaylists(),
      ]);

      set({
        songs,
        albums,
        artists,
        playlists,
        loading: false,
        hasLoaded: true,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to load library',
      });
    }
  },

  refreshLibrary: async () => {
    set({ hasLoaded: false });

    await get().loadLibrary();
  },
}));
