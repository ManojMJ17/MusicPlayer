import { useLibrary } from './useLibrary';

export function useAlbums() {
  const { albums, loading, error, refreshLibrary } = useLibrary();

  return {
    albums,
    loading,
    error,
    refresh: refreshLibrary,
  };
}
