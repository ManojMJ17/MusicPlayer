import { useMemo } from 'react';

import { useAsyncResource } from '@/hooks/useAsyncResource';
import { musicService } from '@/services/music.service';
import { Song } from '@/types/music';

interface UseSongsReturn {
  songs: Song[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSongs(): UseSongsReturn {
  const loader = useMemo(() => {
    return () => musicService.getSongs();
  }, []);

  const { data, loading, error, refresh } = useAsyncResource<Song[]>(loader);

  return {
    songs: data,
    loading,
    error,
    refresh,
  };
}
