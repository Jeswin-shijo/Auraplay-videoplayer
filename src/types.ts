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

export type ActiveTab = 'home' | 'favorites' | 'play' | 'settings';
export type MediaMode = 'video' | 'audio';
export type ThemeMode = 'dark' | 'light';

export interface PlaybackProgress {
  currentTime: number;
  duration: number;
}

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHigh: string;
  surfaceDeep: string;
  surfaceInput: string;
  surfaceOverlay: string;
  border: string;
  borderLight: string;
  borderStrong: string;
  text: string;
  textSub: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentLight: string;
  nav: string;
  navBorder: string;
  sheet: string;
  sheetHandle: string;
  audio: string;
  glowPink: string;
  glowBlue: string;
  deep: string;
  progressTrack: string;
  playOrb: string;
  playOrbBorder: string;
}
