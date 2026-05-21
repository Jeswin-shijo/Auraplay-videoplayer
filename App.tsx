import React, { useMemo, useState } from 'react';
import { Alert, PanResponder, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AppBackground } from './src/components/AppBackground';
import { AppHeader } from './src/components/AppHeader';
import { BottomTabs } from './src/components/BottomTabs';
import { LibrarySheet } from './src/components/LibrarySheet';
import { useDeviceMedia } from './src/hooks/useDeviceMedia';
import { useFavorites } from './src/hooks/useFavorites';
import { usePlayback } from './src/hooks/usePlayback';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme, useThemeStyles } from './src/theme';
import { ActiveTab, LibraryCard, MediaFile, MediaMode } from './src/types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showLibrary, setShowLibrary] = useState(false);

  const { mode } = useTheme();
  const styles = useThemeStyles();

  const {
    allMedia,
    audios,
    isLoadingMedia,
    loadPhoneMedia,
    mediaError,
    permissionStatus,
    videos,
  } = useDeviceMedia();

  const {
    activeMedia,
    featuredMeta,
    isPlaying,
    mediaMode,
    playAudio,
    playNext,
    playPrevious,
    playVideo,
    playbackSpeed,
    progress,
    setMediaMode,
    setPlaybackSpeed,
    syncPlaybackDuration,
    syncPlaybackProgress,
    syncPlayingState,
    togglePlay,
  } = usePlayback({ audios, videos });

  const { addFavorite, favoriteIds, toggleFavorite } = useFavorites();
  const favoriteMedia = allMedia.filter(media => favoriteIds.includes(media.id));

  const dashboardCards: LibraryCard[] = useMemo(
    () => [
      { title: 'Recent', count: `${allMedia.length} Files`, icon: 'L', color: '#ff3f7c' },
      { title: 'Favorite', count: `${favoriteMedia.length} Files`, icon: 'H', color: '#ffe45c' },
      { title: 'Audio', count: `${audios.length} Files`, icon: 'N', color: '#5d94ff' },
      { title: 'Video', count: `${videos.length} Files`, icon: 'V', color: '#ffb34d' },
    ],
    [allMedia.length, audios.length, favoriteMedia.length, videos.length]
  );

  const sheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 60) setShowLibrary(false);
        },
      }),
    []
  );

  const openTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setShowLibrary(false);
  };

  const startVideo = (index: number) => {
    playVideo(index);
    openTab('play');
  };

  const startAudio = (index: number) => {
    playAudio(index);
    openTab('play');
  };

  const setPlayerMode = (mode: MediaMode) => {
    setMediaMode(mode);
    openTab('play');
  };

  const saveActiveMedia = () => {
    if (!activeMedia.id || activeMedia.id === '5') return; // ignore fallback audio
    addFavorite(activeMedia.id);
    Alert.alert('Added to favorites', `${activeMedia.name} is now in Favorite.`);
  };

  const handleCardPress = (card: LibraryCard) => {
    if (card.title === 'Recent') {
      setShowLibrary(true);
      return;
    }
    if (card.title === 'Favorite') {
      openTab('favorites');
      return;
    }
    if (card.title === 'Audio') {
      setPlayerMode('audio');
      return;
    }
    if (card.title === 'Video') {
      setPlayerMode('video');
      return;
    }
  };

  const resolveMediaIndex = (media: MediaFile) =>
    media.mediaType === 'audio'
      ? audios.findIndex(item => item.id === media.id)
      : videos.findIndex(item => item.id === media.id);

  const playMedia = (media: MediaFile) => {
    const index = resolveMediaIndex(media);
    if (media.mediaType === 'audio') {
      startAudio(Math.max(0, index));
    } else {
      startVideo(Math.max(0, index));
    }
  };

  const visiblePlayerMedia = mediaMode === 'audio' ? audios : videos;

  return (
    <View style={styles.container}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AppBackground />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AppHeader
          onFavoritePress={saveActiveMedia}
          onLibraryPress={() => setShowLibrary(true)}
        />

        {activeTab === 'home' && (
          <HomeScreen
            dashboardCards={dashboardCards}
            favoriteIds={favoriteIds}
            isLoadingMedia={isLoadingMedia}
            mediaError={mediaError}
            onCardPress={handleCardPress}
            onLoadPhoneMedia={loadPhoneMedia}
            onOpenLibrary={() => setShowLibrary(true)}
            onPlayVideo={startVideo}
            onToggleFavorite={toggleFavorite}
            permissionStatus={permissionStatus}
            totalFiles={allMedia.length}
            videos={videos}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesScreen
            activeMediaId={activeMedia.id}
            favorites={favoriteMedia}
            onPlayAudio={startAudio}
            onPlayVideo={startVideo}
            onToggleFavorite={toggleFavorite}
            resolveMediaIndex={resolveMediaIndex}
          />
        )}

        {activeTab === 'play' && (
          <PlayerScreen
            activeMedia={activeMedia}
            favoriteIds={favoriteIds}
            featuredTitle={featuredMeta.title}
            isPlaying={isPlaying}
            mediaMode={mediaMode}
            onModeChange={setPlayerMode}
            onNext={playNext}
            onPlayAudio={startAudio}
            onPlayVideo={startVideo}
            onPlaybackDuration={syncPlaybackDuration}
            onPlaybackProgress={syncPlaybackProgress}
            onPlaybackStateChange={syncPlayingState}
            onPrevious={playPrevious}
            onRefresh={loadPhoneMedia}
            onToggleFavorite={toggleFavorite}
            onTogglePlay={togglePlay}
            playbackSpeed={playbackSpeed}
            progress={progress}
            visibleMedia={visiblePlayerMedia}
            watched={featuredMeta.watched}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            permissionStatus={permissionStatus}
            onLoadPhoneMedia={loadPhoneMedia}
          />
        )}
      </ScrollView>

      <BottomTabs activeTab={activeTab} isPlaying={isPlaying} onTabChange={openTab} />

      <LibrarySheet
        activeMediaId={activeMedia.id}
        allMedia={allMedia}
        onClose={() => setShowLibrary(false)}
        onPlayMedia={playMedia}
        onSpeedChange={setPlaybackSpeed}
        panResponder={sheetPanResponder}
        playbackSpeed={playbackSpeed}
        visible={showLibrary}
      />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
