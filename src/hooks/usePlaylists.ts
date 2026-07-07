import { useMemo } from 'react';

import { useAsyncResource } from '@/hooks/useAsyncResource';
import { libraryService } from '@/services/library.service';
import { Playlist } from '@/types/music';

interface UsePlaylistsReturn {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePlaylists(): UsePlaylistsReturn {
  const loader = useMemo(() => {
    return () => libraryService.getPlaylists();
  }, []);

  const { data, loading, error, refresh } =
    useAsyncResource<Playlist[]>(loader);

  return {
    playlists: data,
    loading,
    error,
    refresh,
  };
}
