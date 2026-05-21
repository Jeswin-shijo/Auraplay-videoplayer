import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { MediaRow } from '../components/MediaRow';
import { folders } from '../data/media';
import { useThemeStyles } from '../theme';
import { LibraryCard, MediaFile } from '../types';

interface HomeScreenProps {
  dashboardCards: LibraryCard[];
  favoriteIds: string[];
  isLoadingMedia: boolean;
  mediaError: string;
  permissionStatus: string;
  totalFiles: number;
  videos: MediaFile[];
  onCardPress: (card: LibraryCard) => void;
  onLoadPhoneMedia: () => void;
  onOpenLibrary: () => void;
  onPlayVideo: (index: number) => void;
  onToggleFavorite: (id: string) => void;
}

export function HomeScreen({
  dashboardCards,
  favoriteIds,
  isLoadingMedia,
  mediaError,
  onCardPress,
  onLoadPhoneMedia,
  onOpenLibrary,
  onPlayVideo,
  onToggleFavorite,
  permissionStatus,
  totalFiles,
  videos,
}: HomeScreenProps) {
  const styles = useThemeStyles();

  return (
    <>
      <View style={styles.permissionCard}>
        <View>
          <Text style={styles.permissionTitle}>
            {permissionStatus === 'granted' ? 'Phone media connected' : 'Phone media access'}
          </Text>
          <Text style={styles.permissionText}>
            {isLoadingMedia
              ? 'Asking permission and scanning this phone...'
              : mediaError || 'Showing audio and video files from this phone.'}
          </Text>
        </View>
        <TouchableOpacity style={styles.permissionButton} onPress={onLoadPhoneMedia}>
          <Text style={styles.permissionButtonText}>
            {permissionStatus === 'granted' ? 'Refresh' : 'Allow'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.libraryGrid}>
        {dashboardCards.map(card => (
          <TouchableOpacity
            key={card.title}
            style={styles.libraryCard}
            onPress={() => onCardPress(card)}>
            <View style={[styles.libraryIcon, { backgroundColor: card.color }]}>
              <Text style={styles.libraryIconText}>{card.icon}</Text>
            </View>
            <Text style={styles.libraryTitle}>{card.title}</Text>
            <Text style={styles.libraryCount}>{card.count}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Frequently Used</Text>
        <Text style={styles.sectionMeta}>{totalFiles} files</Text>
      </View>

      <View style={styles.folderList}>
        {folders.map(folder => (
          <TouchableOpacity key={folder.name} style={styles.folderRow} onPress={onOpenLibrary}>
            <View style={[styles.folderIcon, { backgroundColor: folder.color }]} />
            <View style={styles.folderCopy}>
              <Text style={styles.folderName}>{folder.name}</Text>
              <Text style={styles.folderCount}>{folder.count}</Text>
            </View>
            <Text style={styles.more}>...</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Videos</Text>
        <TouchableOpacity onPress={onOpenLibrary}>
          <Text style={styles.sectionAction}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoList}>
        {videos.length === 0 ? (
          <EmptyState
            title="No videos found"
            message="Grant media permission or add videos to this phone."
          />
        ) : (
          videos.map((item, index) => (
            <MediaRow
              key={item.id}
              index={index}
              isFavorite={favoriteIds.includes(item.id)}
              item={item}
              onPress={() => onPlayVideo(index)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          ))
        )}
      </View>
    </>
  );
}
