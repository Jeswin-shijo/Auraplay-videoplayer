import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { createStyles } from './styles';
import { ThemeColors, ThemeMode } from './types';

export const darkColors: ThemeColors = {
  background: '#05070e',
  surface: '#0c1428',
  surfaceHigh: '#10172a',
  surfaceDeep: '#101b35',
  surfaceInput: '#121b33',
  surfaceOverlay: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.16)',
  text: '#ffffff',
  textSub: '#aab5cf',
  textMuted: '#687594',
  textDim: '#d6def5',
  accent: '#ff316f',
  accentLight: '#ff6a98',
  nav: '#111a31',
  navBorder: 'rgba(139,154,193,0.18)',
  sheet: '#0a1123',
  sheetHandle: '#35425f',
  audio: '#5d94ff',
  glowPink: '#ff174d',
  glowBlue: '#284e9f',
  deep: '#02040b',
  progressTrack: 'rgba(255,255,255,0.10)',
  playOrb: 'rgba(255,255,255,0.22)',
  playOrbBorder: 'rgba(255,255,255,0.25)',
};

export const lightColors: ThemeColors = {
  background: '#f0f3fc',
  surface: '#ffffff',
  surfaceHigh: '#ffffff',
  surfaceDeep: '#eef1fa',
  surfaceInput: '#eef1fa',
  surfaceOverlay: 'rgba(0,0,0,0.06)',
  border: 'rgba(0,0,0,0.08)',
  borderLight: 'rgba(0,0,0,0.06)',
  borderStrong: 'rgba(0,0,0,0.14)',
  text: '#0d1129',
  textSub: '#4a5875',
  textMuted: '#8290b0',
  textDim: '#4a5875',
  accent: '#ff316f',
  accentLight: '#e0245e',
  nav: '#ffffff',
  navBorder: 'rgba(0,0,0,0.10)',
  sheet: '#f8f9fe',
  sheetHandle: '#c5cde6',
  audio: '#5d94ff',
  glowPink: '#ffd6df',
  glowBlue: '#c7d9ff',
  deep: '#e8ecf8',
  progressTrack: 'rgba(0,0,0,0.10)',
  playOrb: 'rgba(255,49,111,0.12)',
  playOrbBorder: 'rgba(255,49,111,0.20)',
};

const STORAGE_KEY = '@auraplay_theme';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: darkColors,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(saved => {
        if (saved === 'light' || saved === 'dark') setModeState(saved);
      })
      .catch(() => {});
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const value = useMemo(
    () => ({ mode, colors: mode === 'dark' ? darkColors : lightColors, setMode }),
    [mode]
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Pre-built stylesheet cache — one per theme, created once
let _darkStyles: ReturnType<typeof createStyles> | null = null;
let _lightStyles: ReturnType<typeof createStyles> | null = null;

export function useThemeStyles() {
  const { mode } = useTheme();
  if (mode === 'dark') {
    if (!_darkStyles) _darkStyles = createStyles(darkColors);
    return _darkStyles;
  }
  if (!_lightStyles) _lightStyles = createStyles(lightColors);
  return _lightStyles;
}
