import React, { useMemo, useState, useRef } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';

import { AppBackground } from './src/components/AppBackground';
import { AppHeader } from './src/components/AppHeader';
import { BottomTabs } from './src/components/BottomTabs';
import { FullscreenVideoPlayer } from './src/components/FullscreenVideoPlayer';
import { LibrarySheetRef } from './src/components/LibrarySheet';
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
  const [fullscreenVideoRequest, setFullscreenVideoRequest] = useState(0);
  const librarySheetRef = useRef<any>(null);

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

  const openTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    librarySheetRef.current?.dismiss();
  };

  const startVideo = (index: number) => {
    if (!videos[index]) return;
    playVideo(index);
    librarySheetRef.current?.dismiss();
    setFullscreenVideoRequest(request => request + 1);
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
      librarySheetRef.current?.present();
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
          onLibraryPress={() => librarySheetRef.current?.present()}
        />

        {activeTab === 'home' && (
          <HomeScreen
            dashboardCards={dashboardCards}
            favoriteIds={favoriteIds}
            isLoadingMedia={isLoadingMedia}
            mediaError={mediaError}
            onCardPress={handleCardPress}
            onLoadPhoneMedia={loadPhoneMedia}
            onOpenLibrary={() => librarySheetRef.current?.present()}
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

      {fullscreenVideoRequest > 0 && activeMedia.mediaType === 'video' && (
        <FullscreenVideoPlayer
          key={activeMedia.id}
          isPlaying={isPlaying}
          media={activeMedia}
          onPlaybackDuration={syncPlaybackDuration}
          onPlaybackProgress={syncPlaybackProgress}
          onPlaybackStateChange={syncPlayingState}
          onFullscreenExit={() => {
            setFullscreenVideoRequest(0);
            openTab('play');
          }}
          playbackSpeed={playbackSpeed}
          requestId={fullscreenVideoRequest}
        />
      )}

      <LibrarySheetRef
        ref={librarySheetRef}
        activeMediaId={activeMedia.id}
        allMedia={allMedia}
        onPlayMedia={playMedia}
        onSpeedChange={setPlaybackSpeed}
        playbackSpeed={playbackSpeed}
      />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <BottomSheetModalProvider>
          <AppContent />
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
