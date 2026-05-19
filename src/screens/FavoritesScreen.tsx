import React from 'react';
import { Text, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { MediaRow } from '../components/MediaRow';
import { styles } from '../styles';
import { MediaFile } from '../types';

interface FavoritesScreenProps {
  activeMediaId: string;
  favorites: MediaFile[];
  onPlayAudio: (index: number) => void;
  onPlayVideo: (index: number) => void;
  onToggleFavorite: (id: string) => void;
  resolveMediaIndex: (media: MediaFile) => number;
}

export function FavoritesScreen({
  activeMediaId,
  favorites,
  onPlayAudio,
  onPlayVideo,
  onToggleFavorite,
  resolveMediaIndex,
}: FavoritesScreenProps) {
  return (
    <>
      <View style={styles.pageTitleBlock}>
        <Text style={styles.pageTitle}>Favorite</Text>
        <Text style={styles.pageSubtitle}>Videos and audios you saved for quick playback.</Text>
      </View>

      <View style={styles.videoList}>
        {favorites.length === 0 ? (
          <EmptyState title="No favorites yet" message="Tap the heart on any media to save it here." />
        ) : (
          favorites.map(item => {
            const index = resolveMediaIndex(item);

            return (
              <MediaRow
                key={item.id}
                isActive={activeMediaId === item.id}
                isFavorite
                item={item}
                onPress={() => {
                  if (item.mediaType === 'audio') {
                    onPlayAudio(index);
                  } else {
                    onPlayVideo(index);
                  }
                }}
                onToggleFavorite={() => onToggleFavorite(item.id)}
              />
            );
          })
        )}
      </View>
    </>
  );
}
