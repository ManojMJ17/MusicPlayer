import { useCallback, useEffect, useState } from 'react';

export interface AsyncResourceResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAsyncResource<T>(
  loader: () => Promise<T>,
): AsyncResourceResult<T> {
  const [data, setData] = useState<T>({} as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await loader();

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refresh: load,
  };
}
