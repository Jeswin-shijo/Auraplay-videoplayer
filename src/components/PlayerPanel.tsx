import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../styles';
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
  onSeekBy: (seconds: number) => void;
  onTogglePlay: () => void;
}

interface SeekCommand {
  id: number;
  seconds: number;
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
  const player = useVideoPlayer(
    {
      uri: media.uri,
      metadata: {
        title: media.name,
        artist: media.location,
      },
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

    player.seekBy(seekCommand.seconds);
    onPlaybackProgress(player.currentTime, player.duration);
  }, [onPlaybackProgress, player, seekCommand]);

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
      contentFit="cover"
      nativeControls={false}
      fullscreenOptions={{ enable: true }}
    />
  );
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
  onSeekBy,
  onTogglePlay,
  playbackSpeed,
  progress,
  watched,
}: PlayerPanelProps) {
  const isVideo = mediaMode === 'video' && activeMedia.mediaType === 'video';
  const [seekCommand, setSeekCommand] = useState<SeekCommand>({ id: 0, seconds: 0 });

  const handleSeekBy = (seconds: number) => {
    if (isVideo) {
      setSeekCommand(command => ({ id: command.id + 1, seconds }));
      return;
    }

    onSeekBy(seconds);
  };

  return (
    <View style={styles.heroShell}>
      <View style={styles.notch} />
      <View style={[styles.heroArt, mediaMode === 'audio' && styles.audioArt]}>
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
        <TouchableOpacity style={styles.playOrb} onPress={onTogglePlay}>
          <Text style={styles.playOrbText}>{isPlaying ? 'II' : '▶'}</Text>
        </TouchableOpacity>
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
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${watched}%` }]} />
          </View>
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
