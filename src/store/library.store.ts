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
      const songs = await libraryService.getSongs();

      const albums = libraryService.buildAlbums(songs);

      const artists = libraryService.buildArtists(songs);

      const playlists = libraryService.buildPlaylists(songs);

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
    set({
      loading: true,
      hasLoaded: false,
      error: null,
    });

    try {
      const songs = await libraryService.getSongs(true);

      const albums = libraryService.buildAlbums(songs);

      const artists = libraryService.buildArtists(songs);

      const playlists = libraryService.buildPlaylists(songs);

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
          error instanceof Error ? error.message : 'Failed to refresh library',
      });
    }
  },
}));
