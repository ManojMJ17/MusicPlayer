export function searchItems<T>(
  items: T[],
  query: string,
  getSearchFields: (item: T) => string[],
): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    getSearchFields(item).some((field) =>
      field.toLowerCase().includes(normalizedQuery),
    ),
  );
}
