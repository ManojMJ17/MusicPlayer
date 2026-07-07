import { useMemo } from 'react';

import { useAsyncResource } from '@/hooks/useAsyncResource';
import { libraryService } from '@/services/library.service';
import { Album } from '@/types/music';

interface UseAlbumsReturn {
  albums: Album[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAlbums(): UseAlbumsReturn {
  const loader = useMemo(() => {
    return () => libraryService.getAlbums();
  }, []);

  const { data, loading, error, refresh } = useAsyncResource<Album[]>(loader);

  return {
    albums: data,
    loading,
    error,
    refresh,
  };
}
