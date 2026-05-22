import React, { useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated';

import { speedOptions } from '../data/media';
import { useThemeStyles } from '../theme';
import { MediaFile } from '../types';

interface LibrarySheetProps {
  activeMediaId: string;
  allMedia: MediaFile[];
  playbackSpeed: number;
  onPlayMedia: (media: MediaFile) => void;
  onSpeedChange: (speed: number) => void;
}

export const LibrarySheetRef = React.forwardRef<BottomSheetModal, LibrarySheetProps>(
  ({
    activeMediaId,
    allMedia,
    onPlayMedia,
    onSpeedChange,
    playbackSpeed,
  }, ref) => {
    const styles = useThemeStyles();
    const { height: screenHeight } = useWindowDimensions();
    const internalRef = useRef<BottomSheetModal>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);

    // Snap points: 350px (min), 65% of screen, 95% of screen
    const snapPoints = useMemo(
      () => [350, screenHeight * 0.65, screenHeight * 0.95],
      [screenHeight]
    );

    return (
      <BottomSheetModal
        ref={internalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={() => internalRef.current?.dismiss?.()}
          />
        )}
        handleIndicatorStyle={{
          backgroundColor: '#999',
          width: 40,
          height: 4,
        }}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 20, flex: 1 }}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Playback Tools</Text>
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
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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
          </ScrollView>
        </View>
      </BottomSheetModal>
    );
  }
);
