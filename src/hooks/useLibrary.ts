import { useEffect } from 'react';

import { useLibraryStore } from '@/store/library.store';

export function useLibrary() {
  const store = useLibraryStore();

  useEffect(() => {
    store.loadLibrary();
  }, []);

  return store;
}
