import * as MediaLibrary from 'expo-media-library';

import { MediaFile } from '../types';

export const parseDuration = (duration: string) => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
};

export const formatSeconds = (seconds: number) => {
  if (!seconds || seconds < 0) return '00:00';
  const rounded = Math.floor(seconds);
  const minutes = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const formatAssetSize = (asset: MediaLibrary.Asset) => {
  const megapixels = Math.round((asset.width * asset.height) / 100000) / 10;
  return asset.mediaType === 'video' && megapixels > 0 ? `${megapixels} MP` : 'Local';
};

export const getMediaDurationSeconds = (media: MediaFile) =>
  media.durationSeconds || parseDuration(media.duration);

export const mapAssetToFile = (asset: MediaLibrary.AssetInfo | MediaLibrary.Asset): MediaFile => ({
  id: asset.id,
  name: asset.filename || `${asset.mediaType} file`,
  uri: 'localUri' in asset && asset.localUri ? asset.localUri : asset.uri,
  location: asset.mediaType === 'audio' ? 'Phone audio' : 'Camera roll',
  duration: formatSeconds(asset.duration),
  durationSeconds: asset.duration || 0,
  size: formatAssetSize(asset),
  mediaType: asset.mediaType === 'audio' ? 'audio' : 'video',
});
