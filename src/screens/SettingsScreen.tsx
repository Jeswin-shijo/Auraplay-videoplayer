import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useTheme, useThemeStyles } from '../theme';
import { ThemeMode } from '../types';

interface SettingsScreenProps {
  permissionStatus: string;
  onLoadPhoneMedia: () => void;
}

export function SettingsScreen({ permissionStatus, onLoadPhoneMedia }: SettingsScreenProps) {
  const styles = useThemeStyles();
  const { mode, setMode } = useTheme();

  const themes: Array<{ id: ThemeMode; label: string }> = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
  ];

  const permissionLabel =
    permissionStatus === 'granted'
      ? 'Granted'
      : permissionStatus === 'denied'
        ? 'Denied'
        : permissionStatus === 'checking'
          ? 'Checking...'
          : 'Not granted';

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.settingsTitle}>Settings</Text>

      {/* Appearance */}
      <Text style={styles.settingsSectionLabel}>Appearance</Text>
      <View style={styles.settingsSection}>
        <View style={[styles.settingsRow, styles.settingsRowLast]}>
          <Text style={styles.settingsRowLabel}>Theme</Text>
          <View style={styles.themePills}>
            {themes.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.themePill, mode === t.id && styles.themePillActive]}
                onPress={() => setMode(t.id)}>
                <Text
                  style={[styles.themePillText, mode === t.id && styles.themePillTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Media */}
      <Text style={styles.settingsSectionLabel}>Media</Text>
      <View style={styles.settingsSection}>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsRowLabel}>Library Permission</Text>
          <Text style={styles.settingsRowValue}>{permissionLabel}</Text>
        </View>
        <View style={[styles.settingsRow, styles.settingsRowLast]}>
          <Text style={styles.settingsRowLabel}>Re-scan Library</Text>
          <TouchableOpacity style={styles.settingsActionButton} onPress={onLoadPhoneMedia}>
            <Text style={styles.settingsActionButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <Text style={styles.settingsSectionLabel}>About</Text>
      <View style={styles.settingsSection}>
        <View style={styles.aboutBrand}>
          <View style={styles.aboutBrandMark}>
            <Text style={styles.aboutBrandMarkText}>A</Text>
          </View>
          <Text style={styles.aboutBrandName}>AuraPlay</Text>
          <Text style={styles.aboutBrandVersion}>Version 1.0.0</Text>
        </View>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsRowLabel}>Platform</Text>
          <Text style={styles.settingsRowValue}>React Native + Expo</Text>
        </View>
        <View style={[styles.settingsRow, styles.settingsRowLast]}>
          <Text style={styles.settingsRowLabel}>Player</Text>
          <Text style={styles.settingsRowValue}>expo-video + expo-audio</Text>
        </View>
      </View>
    </ScrollView>
  );
}
