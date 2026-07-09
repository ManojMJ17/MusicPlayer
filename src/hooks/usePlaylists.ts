import { useLibrary } from './useLibrary';

export function usePlaylists() {
  const { playlists, loading, error, refreshLibrary } = useLibrary();

  return {
    playlists,
    loading,
    error,
    refresh: refreshLibrary,
  };
}
