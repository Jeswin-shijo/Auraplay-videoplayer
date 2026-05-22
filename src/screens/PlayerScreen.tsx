import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { MediaRow } from '../components/MediaRow';
import { PlayerPanel } from '../components/PlayerPanel';
import { useThemeStyles } from '../theme';
import { MediaFile, MediaMode, PlaybackProgress } from '../types';

interface PlayerScreenProps {
  activeMedia: MediaFile;
  favoriteIds: string[];
  featuredTitle: string;
  isPlaying: boolean;
  mediaMode: MediaMode;
  progress: PlaybackProgress;
  playbackSpeed: number;
  watched: number;
  onPlaybackDuration: (duration: number) => void;
  onPlaybackProgress: (currentTime: number, duration?: number) => void;
  onPlaybackStateChange: (isPlaying: boolean) => void;
  visibleMedia: MediaFile[];
  onModeChange: (mode: MediaMode) => void;
  onNext: () => void;
  onPlayAudio: (index: number) => void;
  onPlayVideo: (index: number) => void;
  onPrevious: () => void;
  onRefresh: () => void;
  onToggleFavorite: (id: string) => void;
  onTogglePlay: () => void;
}

export function PlayerScreen({
  activeMedia,
  favoriteIds,
  featuredTitle,
  isPlaying,
  mediaMode,
  onModeChange,
  onNext,
  onPlayAudio,
  onPlayVideo,
  onPlaybackDuration,
  onPlaybackProgress,
  onPlaybackStateChange,
  onPrevious,
  onRefresh,
  onToggleFavorite,
  onTogglePlay,
  playbackSpeed,
  progress,
  visibleMedia,
  watched,
}: PlayerScreenProps) {
  const styles = useThemeStyles();
  const isCompact = Dimensions.get('window').width < 390;

  return (
    <>
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          style={[styles.modeButton, mediaMode === 'video' && styles.modeButtonActive]}
          onPress={() => onModeChange('video')}>
          <Text style={[styles.modeText, mediaMode === 'video' && styles.modeTextActive]}>
            Video Player
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mediaMode === 'audio' && styles.modeButtonActive]}
          onPress={() => onModeChange('audio')}>
          <Text style={[styles.modeText, mediaMode === 'audio' && styles.modeTextActive]}>
            Audio Player
          </Text>
        </TouchableOpacity>
      </View>

      <PlayerPanel
        activeMedia={activeMedia}
        featuredTitle={featuredTitle}
        isCompact={isCompact}
        isPlaying={isPlaying}
        mediaMode={mediaMode}
        onNext={onNext}
        onPlaybackDuration={onPlaybackDuration}
        onPlaybackProgress={onPlaybackProgress}
        onPlaybackStateChange={onPlaybackStateChange}
        onPrevious={onPrevious}
        onTogglePlay={onTogglePlay}
        playbackSpeed={playbackSpeed}
        progress={progress}
        watched={watched}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {mediaMode === 'audio' ? 'Phone Audio' : 'Phone Videos'}
        </Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.sectionAction}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoList}>
        {visibleMedia.length === 0 ? (
          <EmptyState
            title={`No ${mediaMode === 'audio' ? 'audio' : 'videos'} found`}
            message="Grant permission or add files to this phone."
          />
        ) : (
          visibleMedia.map((item, index) => (
            <MediaRow
              key={item.id}
              index={index}
              isActive={activeMedia.id === item.id}
              isFavorite={favoriteIds.includes(item.id)}
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
          ))
        )}
      </View>
    </>
  );
}
