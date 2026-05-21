import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@auraplay_favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(saved => {
        setFavoriteIds(saved ? (JSON.parse(saved) as string[]) : ['4']);
      })
      .catch(() => {
        setFavoriteIds(['4']);
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds)).catch(() => {});
  }, [favoriteIds, loaded]);

  const addFavorite = useCallback((id: string) => {
    setFavoriteIds(ids => (ids.includes(id) ? ids : [...ids, id]));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(ids =>
      ids.includes(id) ? ids.filter(fid => fid !== id) : [...ids, id]
    );
  }, []);

  return { addFavorite, favoriteIds, toggleFavorite };
}
