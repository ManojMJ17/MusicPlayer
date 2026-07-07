import { useMemo } from 'react';

import { useAsyncResource } from '@/hooks/useAsyncResource';
import { musicService } from '@/services/music.service';
import { Album } from '@/types/music';

interface UseAlbumsReturn {
  albums: Album[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAlbums(): UseAlbumsReturn {
  const loader = useMemo(() => {
    return () => musicService.getAlbums();
  }, []);

  const { data, loading, error, refresh } = useAsyncResource<Album[]>(loader);

  return {
    albums: data,
    loading,
    error,
    refresh,
  };
}
