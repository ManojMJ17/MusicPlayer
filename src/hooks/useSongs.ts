import { useLibrary } from './useLibrary';

export function useSongs() {
  const { songs, loading, error, refreshLibrary } = useLibrary();

  return {
    songs,
    loading,
    error,
    refresh: refreshLibrary,
  };
}
