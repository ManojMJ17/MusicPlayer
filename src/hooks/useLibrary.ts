import { useEffect } from 'react';

import { useLibraryStore } from '@/store/library.store';

export function useLibrary() {
  const songs = useLibraryStore((state) => state.songs);
  const albums = useLibraryStore((state) => state.albums);
  const artists = useLibraryStore((state) => state.artists);
  const playlists = useLibraryStore((state) => state.playlists);
  const loading = useLibraryStore((state) => state.loading);
  const error = useLibraryStore((state) => state.error);
  const refreshLibrary = useLibraryStore((state) => state.refreshLibrary);
  const loadLibrary = useLibraryStore((state) => state.loadLibrary);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  return {
    songs,
    albums,
    artists,
    playlists,
    loading,
    error,
    refreshLibrary,
  };
}
