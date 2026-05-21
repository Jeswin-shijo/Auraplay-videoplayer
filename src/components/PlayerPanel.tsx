import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme, useThemeStyles } from '../theme';
import { MediaFile, MediaMode, PlaybackProgress } from '../types';
import { formatSeconds } from '../utils/media';

interface PlayerPanelProps {
  activeMedia: MediaFile;
  featuredTitle: string;
  isCompact: boolean;
  isPlaying: boolean;
  mediaMode: MediaMode;
  playbackSpeed: number;
  progress: PlaybackProgress;
  watched: number;
  onPlaybackDuration: (duration: number) => void;
  onPlaybackProgress: (currentTime: number, duration?: number) => void;
  onPlaybackStateChange: (isPlaying: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  onTogglePlay: () => void;
}

interface SeekCommand {
  id: number;
  position: number; // absolute seconds
}

interface VideoSurfaceProps {
  media: MediaFile;
  isPlaying: boolean;
  playbackSpeed: number;
  seekCommand: SeekCommand;
  onPlaybackDuration: (duration: number) => void;
  onPlaybackProgress: (currentTime: number, duration?: number) => void;
  onPlaybackStateChange: (isPlaying: boolean) => void;
}

function VideoSurface({
  isPlaying,
  media,
  onPlaybackDuration,
  onPlaybackProgress,
  onPlaybackStateChange,
  playbackSpeed,
  seekCommand,
}: VideoSurfaceProps) {
  const styles = useThemeStyles();
  const player = useVideoPlayer(
    {
      uri: media.uri,
      metadata: { title: media.name, artist: media.location },
    },
    videoPlayer => {
      videoPlayer.timeUpdateEventInterval = 0.25;
      videoPlayer.playbackRate = playbackSpeed;
    }
  );

  useEffect(() => {
    player.playbackRate = playbackSpeed;
  }, [player, playbackSpeed]);

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

  useEffect(() => {
    if (seekCommand.id === 0) return;
    // Use delta from the player's live currentTime for accurate absolute seek
    player.seekBy(seekCommand.position - player.currentTime);
  }, [player, seekCommand]);

  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    onPlaybackProgress(currentTime, player.duration);
  });

  useEventListener(player, 'sourceLoad', ({ duration }) => {
    onPlaybackDuration(duration);
  });

  useEventListener(player, 'playingChange', ({ isPlaying: nextIsPlaying }) => {
    onPlaybackStateChange(nextIsPlaying);
  });

  useEventListener(player, 'playToEnd', () => {
    onPlaybackProgress(player.duration, player.duration);
    onPlaybackStateChange(false);
  });

  return (
    <VideoView
      style={styles.videoSurface}
      player={player}
      contentFit="contain"
      nativeControls
      fullscreenOptions={{ enable: true, orientation: 'landscape' }}
    />
  );
}

interface AudioSurfaceProps {
  media: MediaFile;
  isPlaying: boolean;
  playbackSpeed: number;
  seekCommand: SeekCommand;
  onPlaybackDuration: (duration: number) => void;
  onPlaybackProgress: (currentTime: number, duration?: number) => void;
  onPlaybackStateChange: (isPlaying: boolean) => void;
}

function AudioSurface({
  isPlaying,
  media,
  onPlaybackDuration,
  onPlaybackProgress,
  onPlaybackStateChange,
  playbackSpeed,
  seekCommand,
}: AudioSurfaceProps) {
  const player = useAudioPlayer({ uri: media.uri });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

  useEffect(() => {
    player.setPlaybackRate(playbackSpeed);
  }, [playbackSpeed, player]);

  useEffect(() => {
    if (seekCommand.id === 0) return;
    player.seekTo(seekCommand.position);
  }, [player, seekCommand]);

  useEffect(() => {
    if (!status.isLoaded) return;
    onPlaybackProgress(status.currentTime, status.duration ?? 0);
    if (status.duration && !isNaN(status.duration)) {
      onPlaybackDuration(status.duration);
    }
  }, [status.currentTime, status.isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onPlaybackStateChange(status.playing);
  }, [status.playing]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function PlayerPanel({
  activeMedia,
  featuredTitle,
  isCompact,
  isPlaying,
  mediaMode,
  onPlaybackDuration,
  onPlaybackProgress,
  onPlaybackStateChange,
  onNext,
  onPrevious,
  onTogglePlay,
  playbackSpeed,
  progress,
  watched,
}: PlayerPanelProps) {
  const styles = useThemeStyles();
  const { colors } = useTheme();
  const isVideo = mediaMode === 'video' && activeMedia.mediaType === 'video';
  const [seekCommand, setSeekCommand] = useState<SeekCommand>({ id: 0, position: 0 });
  const [sliderValue, setSliderValue] = useState(progress.currentTime);
  const isSlidingRef = useRef(false);

  useEffect(() => {
    if (!isSlidingRef.current) {
      setSliderValue(progress.currentTime);
    }
  }, [progress.currentTime]);

  const issueSeek = (absolutePosition: number) => {
    setSeekCommand(cmd => ({ id: cmd.id + 1, position: absolutePosition }));
  };

  const handleSeekBy = (deltaSeconds: number) => {
    const duration = progress.duration || 999;
    const newPosition = Math.max(0, Math.min(duration, progress.currentTime + deltaSeconds));
    issueSeek(newPosition);
  };

  return (
    <View style={styles.heroShell}>
      <View style={styles.notch} />
      <View
        style={[
          styles.heroArt,
          isVideo && styles.videoArt,
          mediaMode === 'audio' && styles.audioArt,
        ]}>
        {isVideo ? (
          <VideoSurface
            key={activeMedia.id}
            isPlaying={isPlaying}
            media={activeMedia}
            onPlaybackDuration={onPlaybackDuration}
            onPlaybackProgress={onPlaybackProgress}
            onPlaybackStateChange={onPlaybackStateChange}
            playbackSpeed={playbackSpeed}
            seekCommand={seekCommand}
          />
        ) : (
          <>
            <AudioSurface
              key={activeMedia.id}
              isPlaying={isPlaying}
              media={activeMedia}
              onPlaybackDuration={onPlaybackDuration}
              onPlaybackProgress={onPlaybackProgress}
              onPlaybackStateChange={onPlaybackStateChange}
              playbackSpeed={playbackSpeed}
              seekCommand={seekCommand}
            />
            <View style={[styles.ray, styles.rayOne]} />
            <View style={[styles.ray, styles.rayTwo]} />
            <View style={[styles.ray, styles.rayThree]} />
            <View style={styles.videoPreview}>
              <View style={styles.previewHorizon} />
              <View style={styles.previewBuildingTall} />
              <View style={styles.previewBuildingShort} />
              <View style={styles.previewRoad} />
              <Text style={styles.previewLabel}>{activeMedia.location}</Text>
            </View>
          </>
        )}
        {!isVideo && (
          <TouchableOpacity style={styles.playOrb} onPress={onTogglePlay}>
            <Text style={styles.playOrbText}>{isPlaying ? 'II' : '▶'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.heroInfo}>
        <View style={styles.pager}>
          <View style={styles.pagerDot} />
          <View style={[styles.pagerDot, styles.pagerDotActive]} />
        </View>
        <Text style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>
          {mediaMode === 'video' ? 'VIDEO THAT\nPLAY ALL' : 'AUDIO THAT\nPLAY ALL'}
        </Text>
        <Text style={styles.heroSubtitle}>{featuredTitle}</Text>

        <View style={styles.timeline}>
          <Text style={styles.timeText}>{formatSeconds(progress.currentTime)}</Text>
          <Slider
            style={styles.progressSlider}
            value={sliderValue}
            minimumValue={0}
            maximumValue={progress.duration || 1}
            onValueChange={value => {
              isSlidingRef.current = true;
              setSliderValue(value);
            }}
            onSlidingComplete={value => {
              isSlidingRef.current = false;
              issueSeek(value);
            }}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.progressTrack}
            thumbTintColor={colors.accent}
          />
          <Text style={styles.timeText}>
            {progress.duration ? formatSeconds(progress.duration) : activeMedia.duration}
          </Text>
        </View>

        <View style={styles.heroControls}>
          <TouchableOpacity style={styles.smallRoundButton} onPress={() => handleSeekBy(-10)}>
            <Text style={styles.smallRoundText}>-10</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryControl} onPress={onPrevious}>
            <Text style={styles.primaryControlText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainControl} onPress={onTogglePlay}>
            <Text style={styles.mainControlText}>{isPlaying ? 'II' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryControl} onPress={onNext}>
            <Text style={styles.primaryControlText}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallRoundButton} onPress={() => handleSeekBy(10)}>
            <Text style={styles.smallRoundText}>+10</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
