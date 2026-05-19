import { useCallback, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

import { fallbackMedia } from '../data/media';
import { MediaFile } from '../types';
import { mapAssetToFile } from '../utils/media';

export function useDeviceMedia() {
  const [deviceMedia, setDeviceMedia] = useState<MediaFile[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [mediaError, setMediaError] = useState('');

  const loadPhoneMedia = useCallback(async () => {
    setIsLoadingMedia(true);
    setMediaError('');

    try {
      const isAvailable = await MediaLibrary.isAvailableAsync();

      if (!isAvailable) {
        setPermissionStatus('unavailable');
        setMediaError('Media library is not available on this device.');
        return;
      }

      const permission = await MediaLibrary.requestPermissionsAsync(false, [
        'audio',
        'video',
      ]);

      setPermissionStatus(permission.status);

      if (permission.status !== 'granted') {
        setMediaError('Permission is needed to show phone audio and video files.');
        return;
      }

      const [videoAssets, audioAssets] = await Promise.all([
        MediaLibrary.getAssetsAsync({
          first: 80,
          mediaType: 'video',
          sortBy: [['creationTime', false]],
        }),
        MediaLibrary.getAssetsAsync({
          first: 80,
          mediaType: 'audio',
          sortBy: [['creationTime', false]],
        }),
      ]);

      const phoneMedia = [...videoAssets.assets, ...audioAssets.assets].map(mapAssetToFile);
      setDeviceMedia(phoneMedia);

      if (phoneMedia.length === 0) {
        setMediaError('No audio or video files were found on this phone.');
      }
    } catch {
      setPermissionStatus('error');
      setMediaError('Unable to read audio and video files from this phone.');
    } finally {
      setIsLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    loadPhoneMedia();
  }, [loadPhoneMedia]);

  const allMedia = deviceMedia.length > 0 ? deviceMedia : fallbackMedia;
  const videos = allMedia.filter(item => item.mediaType === 'video');
  const audios = allMedia.filter(item => item.mediaType === 'audio');

  return {
    allMedia,
    audios,
    deviceMedia,
    isLoadingMedia,
    loadPhoneMedia,
    mediaError,
    permissionStatus,
    videos,
  };
}
