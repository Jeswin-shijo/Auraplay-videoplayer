import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../styles';
import { ActiveTab } from '../types';

interface BottomTabsProps {
  activeTab: ActiveTab;
  isPlaying: boolean;
  onTabChange: (tab: ActiveTab) => void;
}

export function BottomTabs({ activeTab, isPlaying, onTabChange }: BottomTabsProps) {
  const tabs: Array<{ id: ActiveTab; icon: string }> = [
    { id: 'home', icon: '⌂' },
    { id: 'favorites', icon: '♡' },
    { id: 'play', icon: isPlaying ? 'II' : '▷' },
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
            <Text style={[styles.navIcon, isActive && styles.navIconActive]}>
              {tab.icon}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
