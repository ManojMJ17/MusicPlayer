import { searchItems } from '@/utils/search';
import { useMemo, useState } from 'react';

export function useSearch<T>(
  items: T[],
  getSearchFields: (item: T) => string[],
) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    return searchItems(items, query, getSearchFields);
  }, [items, query, getSearchFields]);

  const clearQuery = () => setQuery('');

  return {
    query,
    setQuery,
    clearQuery,
    filteredItems,
    isSearching: query.length > 0,
  };
}
