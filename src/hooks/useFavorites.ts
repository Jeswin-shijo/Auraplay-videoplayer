import { useCallback, useState } from 'react';

export function useFavorites(initialIds: string[] = ['4']) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(initialIds);

  const addFavorite = useCallback((id: string) => {
    setFavoriteIds(ids => (ids.includes(id) ? ids : [...ids, id]));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(ids =>
      ids.includes(id) ? ids.filter(favoriteId => favoriteId !== id) : [...ids, id]
    );
  }, []);

  return { addFavorite, favoriteIds, toggleFavorite };
}
