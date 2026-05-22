import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useThemeStyles } from '../theme';
import { ActiveTab } from '../types';

type TabIconName = keyof typeof Ionicons.glyphMap;

interface BottomTabsProps {
  activeTab: ActiveTab;
  isPlaying: boolean;
  onTabChange: (tab: ActiveTab) => void;
}

export function BottomTabs({ activeTab, isPlaying, onTabChange }: BottomTabsProps) {
  const { colors } = useTheme();
  const styles = useThemeStyles();

  const tabs: Array<{ id: ActiveTab; icon: TabIconName }> = [
    { id: 'home', icon: 'home' },
    { id: 'favorites', icon: 'heart' },
    { id: 'play', icon: isPlaying ? 'pause' : 'play' },
    { id: 'settings', icon: 'settings' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.navButton, isActive && styles.navButtonActive]}
            onPress={() => onTabChange(tab.id)}>
            <Ionicons
              name={tab.icon}
              size={23}
              color={isActive ? '#ffffff' : colors.textSub}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
