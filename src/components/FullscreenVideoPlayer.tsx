import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';

import { useThemeStyles } from '../theme';
import { MediaFile } from '../types';

interface FullscreenVideoPlayerProps {
  media: MediaFile;
  isPlaying: boolean;
  playbackSpeed: number;
  requestId: number;
  onPlaybackDuration: (duration: number) => void;
  onPlaybackProgress: (currentTime: number, duration?: number) => void;
  onPlaybackStateChange: (isPlaying: boolean) => void;
}

export function FullscreenVideoPlayer({
  isPlaying,
  media,
  onPlaybackDuration,
  onPlaybackProgress,
  onPlaybackStateChange,
  playbackSpeed,
  requestId,
}: FullscreenVideoPlayerProps) {
  const styles = useThemeStyles();
  const videoRef = useRef<VideoView>(null);

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
    if (requestId === 0) return;

    const timer = setTimeout(() => {
      player.play();
      videoRef.current?.enterFullscreen().catch(() => {});
    }, 120);

    return () => clearTimeout(timer);
  }, [player, requestId]);

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
      ref={videoRef}
      style={styles.fullscreenVideoLauncher}
      player={player}
      contentFit="contain"
      nativeControls
      fullscreenOptions={{ enable: true, orientation: 'landscape' }}
    />
  );
}
