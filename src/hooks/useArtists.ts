import { useLibrary } from './useLibrary';

export function useArtists() {
  const { artists, loading, error, refreshLibrary } = useLibrary();

  return {
    artists,
    loading,
    error,
    refresh: refreshLibrary,
  };
}
