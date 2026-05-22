import { useMemo } from 'react';
import { PanResponder, PanResponderInstance } from 'react-native';

interface UseBottomSheetGestureProps {
  onClose: () => void;
  threshold?: number;
}

export function useBottomSheetGesture({
  onClose,
  threshold = 40,
}: UseBottomSheetGestureProps): PanResponderInstance {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderRelease: (_, gesture) => {
          // Close on downward drag beyond threshold
          if (gesture.dy > threshold) {
            onClose();
          }
        },
      }),
    [onClose, threshold]
  );

  return panResponder;
}
