import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useThemeStyles } from '../theme';

interface AppHeaderProps {
  onFavoritePress: () => void;
  onLibraryPress: () => void;
}

export function AppHeader({ onFavoritePress, onLibraryPress }: AppHeaderProps) {
  const { colors } = useTheme();
  const styles = useThemeStyles();

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>A</Text>
        </View>
        <Text style={styles.brand}>AuraPlay</Text>
      </View>
    </View>
  );
}
