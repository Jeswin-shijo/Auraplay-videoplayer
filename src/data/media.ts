import { FolderItem, MediaFile } from '../types';

export const fallbackMedia: MediaFile[] = [
  {
    id: '1',
    name: 'Big Buck Bunny',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    location: 'Sample videos',
    duration: '09:56',
    durationSeconds: 596,
    size: '158 MB',
    mediaType: 'video',
  },
  {
    id: '2',
    name: 'Elephant Dream',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
    location: 'Cinema clips',
    duration: '10:53',
    durationSeconds: 653,
    size: '132 MB',
    mediaType: 'video',
  },
  {
    id: '3',
    name: 'For Bigger Blazes',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    location: 'Action reel',
    duration: '00:15',
    durationSeconds: 15,
    size: '14 MB',
    mediaType: 'video',
  },
  {
    id: '4',
    name: 'Tears of Steel',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/TearsOfSteel.mp4',
    location: 'Favorites',
    duration: '12:14',
    durationSeconds: 734,
    size: '198 MB',
    mediaType: 'video',
  },
  {
    id: '5',
    name: 'Aura Demo Audio',
    uri: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    location: 'Sample audio',
    duration: '00:25',
    durationSeconds: 25,
    size: '0.4 MB',
    mediaType: 'audio',
  },
];

export const folders: FolderItem[] = [
  { name: 'Camera', count: '80 Files', color: '#ff764d' },
  { name: 'Download', count: '20 Files', color: '#ffe04f' },
  { name: 'Facebook', count: '10 Files', color: '#4d90ff' },
  { name: 'Camtasia', count: '60 Files', color: '#37e66f' },
  { name: 'Inshot', count: '24 Files', color: '#d5dde8' },
];

export const speedOptions = [0.75, 1, 1.25, 1.5, 2];
