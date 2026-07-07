import { useMemo } from 'react';

import { useAsyncResource } from '@/hooks/useAsyncResource';
import { libraryService } from '@/services/library.service';
import { Song } from '@/types/music';

interface UseSongsReturn {
  songs: Song[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSongs(): UseSongsReturn {
  const loader = useMemo(() => {
    return () => libraryService.getSongs();
  }, []);

  const {
    data: songs,
    loading,
    error,
    refresh,
  } = useAsyncResource<Song[]>(loader);

  return {
    songs,
    loading,
    error,
    refresh,
  };
}
