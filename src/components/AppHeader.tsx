import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../styles';

interface AppHeaderProps {
  onFavoritePress: () => void;
  onLibraryPress: () => void;
}

export function AppHeader({ onFavoritePress, onLibraryPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>A</Text>
        </View>
        <Text style={styles.brand}>AuraPlay</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton} onPress={onFavoritePress}>
          <Text style={styles.iconButtonText}>H</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onLibraryPress}>
          <Text style={styles.iconButtonText}>G</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
