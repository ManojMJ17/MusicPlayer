import { useMemo } from 'react';

import { useAsyncResource } from '@/hooks/useAsyncResource';
import { libraryService } from '@/services/library.service';
import { Artist } from '@/types/music';

interface UseArtistsReturn {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useArtists(): UseArtistsReturn {
  const loader = useMemo(() => {
    return () => libraryService.getArtists();
  }, []);

  const { data, loading, error, refresh } = useAsyncResource<Artist[]>(loader);

  return {
    artists: data,
    loading,
    error,
    refresh,
  };
}
