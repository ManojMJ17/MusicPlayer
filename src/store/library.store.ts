import { create } from 'zustand';

import { libraryService } from '@/services/library.service';
import { libraryMetadataService } from '@/services/libraryMetadataService';
import { Album, Artist, Playlist, Song } from '@/types/music';
import { usePlayerStore } from './player.store';

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
  toggleFavorite: (songId: string) => Promise<void>;
  incrementPlay: (songId: string) => Promise<void>;
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

  toggleFavorite: async (songId: string) => {
    try {
      const isFavorite = await libraryMetadataService.toggleFavorite(songId);

      const { songs } = get();
      const updatedSongs = songs.map((song) =>
        song.id === songId ? { ...song, isFavorite } : song
      );

      const albums = libraryService.buildAlbums(updatedSongs);
      const artists = libraryService.buildArtists(updatedSongs);
      const playlists = libraryService.buildPlaylists(updatedSongs);

      set({
        songs: updatedSongs,
        albums,
        artists,
        playlists,
      });

      // Synchronize player store if the active song is modified
      const playerStore = usePlayerStore.getState();
      if (playerStore.currentSong && playerStore.currentSong.id === songId) {
        usePlayerStore.setState({
          currentSong: { ...playerStore.currentSong, isFavorite },
        });
      }

      // Synchronize active playback queue
      if (playerStore.queue && playerStore.queue.songs) {
        const updatedQueueSongs = playerStore.queue.songs.map((song) =>
          song.id === songId ? { ...song, isFavorite } : song
        );
        usePlayerStore.setState({
          queue: {
            ...playerStore.queue,
            songs: updatedQueueSongs,
          },
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  },

  incrementPlay: async (songId: string) => {
    try {
      await libraryMetadataService.incrementPlay(songId);

      const { songs } = get();
      const updatedSongs = songs.map((song) => {
        if (song.id === songId) {
          return {
            ...song,
            playCount: (song.playCount ?? 0) + 1,
            lastPlayedAt: new Date().toISOString(),
          };
        }
        return song;
      });

      const albums = libraryService.buildAlbums(updatedSongs);
      const artists = libraryService.buildArtists(updatedSongs);
      const playlists = libraryService.buildPlaylists(updatedSongs);

      set({
        songs: updatedSongs,
        albums,
        artists,
        playlists,
      });

      // Sync active playing song details in PlayerStore
      const playerStore = usePlayerStore.getState();
      if (playerStore.currentSong && playerStore.currentSong.id === songId) {
        usePlayerStore.setState({
          currentSong: {
            ...playerStore.currentSong,
            playCount: (playerStore.currentSong.playCount ?? 0) + 1,
            lastPlayedAt: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error('Failed to increment play count:', error);
    }
  },
}));
