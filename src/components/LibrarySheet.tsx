import React from 'react';
import { Modal, PanResponderInstance, Text, TouchableOpacity, View } from 'react-native';

import { speedOptions } from '../data/media';
import { styles } from '../styles';
import { MediaFile } from '../types';

interface LibrarySheetProps {
  activeMediaId: string;
  allMedia: MediaFile[];
  panResponder: PanResponderInstance;
  playbackSpeed: number;
  visible: boolean;
  onClose: () => void;
  onPlayMedia: (media: MediaFile) => void;
  onSpeedChange: (speed: number) => void;
}

export function LibrarySheet({
  activeMediaId,
  allMedia,
  onClose,
  onPlayMedia,
  onSpeedChange,
  panResponder,
  playbackSpeed,
  visible,
}: LibrarySheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.sheet} {...panResponder.panHandlers}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Playback Tools</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.sheetClose}>Close</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sheetLabel}>Speed</Text>
          <View style={styles.speedRow}>
            {speedOptions.map(speed => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedButton,
                  playbackSpeed === speed && styles.speedButtonActive,
                ]}
                onPress={() => onSpeedChange(speed)}>
                <Text
                  style={[
                    styles.speedText,
                    playbackSpeed === speed && styles.speedTextActive,
                  ]}>
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sheetLabel}>Local Library</Text>
          {allMedia.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.sheetVideoRow,
                activeMediaId === item.id && styles.sheetVideoRowActive,
              ]}
              onPress={() => onPlayMedia(item)}>
              <Text style={styles.sheetVideoIndex}>{index + 1}</Text>
              <View style={styles.sheetVideoCopy}>
                <Text style={styles.sheetVideoTitle}>{item.name}</Text>
                <Text style={styles.sheetVideoMeta}>
                  {item.mediaType.toUpperCase()} / {item.duration} / {item.location}
                </Text>
              </View>
              {activeMediaId === item.id && <Text style={styles.sheetPlaying}>Playing</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}
