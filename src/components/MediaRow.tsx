import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../styles';
import { MediaFile } from '../types';

interface MediaRowProps {
  index?: number;
  isActive?: boolean;
  isFavorite: boolean;
  item: MediaFile;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function MediaRow({
  index = 0,
  isActive,
  isFavorite,
  item,
  onPress,
  onToggleFavorite,
}: MediaRowProps) {
  const accent = item.mediaType === 'audio' ? '#5d94ff' : index % 2 ? '#3b66ff' : '#ff2f6d';

  return (
    <TouchableOpacity
      style={[styles.videoRow, isActive && styles.videoRowActive]}
      onPress={onPress}>
      <View style={styles.thumbnail}>
        <View style={[styles.thumbGlow, { backgroundColor: accent }]} />
        <Text style={styles.thumbnailPlay}>{item.mediaType === 'audio' ? '♪' : '▶'}</Text>
      </View>
      <View style={styles.videoCopy}>
        <Text style={styles.videoName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.videoLocation}>{item.location}</Text>
        <View style={styles.videoPills}>
          <Text style={styles.videoPill}>{item.duration}</Text>
          <Text style={styles.videoPill}>{item.size}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onToggleFavorite}>
        <Text style={[styles.favoriteMark, isFavorite && styles.favoriteMarkActive]}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
