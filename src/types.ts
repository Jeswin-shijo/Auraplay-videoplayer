export interface MediaFile {
  id: string;
  name: string;
  uri: string;
  location: string;
  duration: string;
  durationSeconds: number;
  size: string;
  mediaType: 'audio' | 'video';
}

export interface LibraryCard {
  title: 'Recent' | 'Favorite' | 'Audio' | 'Video';
  count: string;
  icon: string;
  color: string;
}

export interface FolderItem {
  name: string;
  count: string;
  color: string;
}

export type ActiveTab = 'home' | 'favorites' | 'play';
export type MediaMode = 'video' | 'audio';

export interface PlaybackProgress {
  currentTime: number;
  duration: number;
}
