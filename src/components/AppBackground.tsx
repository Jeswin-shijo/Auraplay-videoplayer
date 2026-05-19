import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '../styles';

export function AppBackground() {
  return (
    <View style={styles.background}>
      <View style={[styles.glow, styles.glowPink]} />
      <View style={[styles.glow, styles.glowBlue]} />
      <Text style={styles.ghostWord}>Aura</Text>
    </View>
  );
}
