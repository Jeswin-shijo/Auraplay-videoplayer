import React from 'react';
import { Text, View } from 'react-native';

import { useThemeStyles } from '../theme';

export function AppBackground() {
  const styles = useThemeStyles();

  return (
    <View style={styles.background}>
      <View style={[styles.glow, styles.glowPink]} />
      <View style={[styles.glow, styles.glowBlue]} />
      <Text style={styles.ghostWord}>Aura</Text>
    </View>
  );
}
