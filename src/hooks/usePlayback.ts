import { useEffect, useMemo, useState } from 'react';

import { fallbackMedia } from '../data/media';
import { MediaFile, MediaMode } from '../types';
import { formatSeconds, getMediaDurationSeconds } from '../utils/media';

interface UsePlaybackOptions {
  audios: MediaFile[];
  videos: MediaFile[];
}

export function usePlayback({ audios, videos }: UsePlaybackOptions) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<MediaMode>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });

  const currentVideo = videos[currentVideoIndex] || videos[0] || fallbackMedia[0];
  const currentAudio =
    audios[currentAudioIndex] || audios[0] || fallbackMedia[fallbackMedia.length - 1];
  const activeMedia = mediaMode === 'audio' ? currentAudio : currentVideo;

  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [videos]);

  useEffect(() => {
    setCurrentAudioIndex(0);
  }, [audios]);

  useEffect(() => {
    setProgress({
      currentTime: 0,
      duration: getMediaDurationSeconds(activeMedia),
    });
  }, [activeMedia]);

  useEffect(() => {
    if (!isPlaying || activeMedia.mediaType === 'video') return undefined;

    const timer = setInterval(() => {
      setProgress(value => {
        const duration = value.duration || getMediaDurationSeconds(activeMedia);
        const nextTime = value.currentTime + 0.5 * playbackSpeed;

        if (nextTime >= duration) {
          if (repeat) return { currentTime: 0, duration };

          setIsPlaying(false);
          return { currentTime: duration, duration };
        }

        return { currentTime: nextTime, duration };
      });
    }, 500);

    return () => clearInterval(timer);
  }, [activeMedia, isPlaying, playbackSpeed, repeat]);

  const featuredMeta = useMemo(() => {
    const watched =
      progress.duration > 0
        ? Math.min(100, Math.round((progress.currentTime / progress.duration) * 100))
        : 0;

    return {
      watched,
      title: activeMedia.name.toUpperCase(),
    };
  }, [activeMedia.name, progress.currentTime, progress.duration]);

  const playVideo = (index: number) => {
    if (!videos[index]) return;
    setCurrentVideoIndex(index);
    setMediaMode('video');
    setIsPlaying(true);
    setProgress({ currentTime: 0, duration: getMediaDurationSeconds(videos[index]) });
  };

  const playAudio = (index: number) => {
    if (!audios[index]) return;
    setCurrentAudioIndex(index);
    setMediaMode('audio');
    setIsPlaying(true);
    setProgress({ currentTime: 0, duration: getMediaDurationSeconds(audios[index]) });
  };

  const playNext = () => {
    if (mediaMode === 'audio' && audios.length > 0) {
      const next = shuffle
        ? Math.floor(Math.random() * audios.length)
        : (currentAudioIndex + 1) % audios.length;
      playAudio(next);
      return;
    }

    if (videos.length > 0) {
      const next = shuffle
        ? Math.floor(Math.random() * videos.length)
        : (currentVideoIndex + 1) % videos.length;
      playVideo(next);
    }
  };

  const playPrevious = () => {
    if (mediaMode === 'audio' && audios.length > 0) {
      const previous =
        currentAudioIndex === 0 ? audios.length - 1 : currentAudioIndex - 1;
      playAudio(previous);
      return;
    }

    if (videos.length > 0) {
      const previous =
        currentVideoIndex === 0 ? videos.length - 1 : currentVideoIndex - 1;
      playVideo(previous);
    }
  };

  const seekBy = (seconds: number) => {
    setProgress(value => {
      const duration = value.duration || getMediaDurationSeconds(activeMedia);
      return {
        currentTime: Math.max(0, Math.min(duration, value.currentTime + seconds)),
        duration,
      };
    });
  };

  const syncPlaybackProgress = (currentTime: number, duration?: number) => {
    setProgress(value => ({
      currentTime,
      duration: duration || value.duration || getMediaDurationSeconds(activeMedia),
    }));
  };

  const syncPlaybackDuration = (duration: number) => {
    setProgress(value => ({
      currentTime: value.currentTime,
      duration: duration || value.duration || getMediaDurationSeconds(activeMedia),
    }));
  };

  const syncPlayingState = (playing: boolean) => setIsPlaying(playing);

  const togglePlay = () => setIsPlaying(value => !value);

  return {
    activeMedia,
    currentAudio,
    currentAudioIndex,
    currentVideo,
    currentVideoIndex,
    featuredMeta,
    formatProgressTime: formatSeconds,
    isPlaying,
    mediaMode,
    playAudio,
    playNext,
    playPrevious,
    playVideo,
    playbackSpeed,
    progress,
    repeat,
    seekBy,
    setMediaMode,
    setPlaybackSpeed,
    setRepeat,
    setShuffle,
    shuffle,
    syncPlaybackDuration,
    syncPlaybackProgress,
    syncPlayingState,
    togglePlay,
  };
}
