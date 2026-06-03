// ============================================
// CodeQuest — Voice Waveform Component
// Animated audio wave representation for bot and candidate audio state
// ============================================

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

interface VoiceWaveformProps {
  isRecording?: boolean;
  isThinking?: boolean;
}

const BAR_COUNT = 9;

function AnimatedBar({
  index,
  isRecording,
  isThinking,
  primaryColor,
  activeColor,
}: {
  index: number;
  isRecording: boolean;
  isThinking: boolean;
  primaryColor: string;
  activeColor: string;
}) {
  const height = useSharedValue(6);

  useEffect(() => {
    if (isRecording) {
      // High-intensity, random-looking sound level peaks
      const baseDelay = index * 40;
      const animationRange = [
        12 + Math.random() * 28,
        6 + Math.random() * 10,
        18 + Math.random() * 22,
        6,
      ];
      
      height.value = withDelay(
        baseDelay,
        withRepeat(
          withSequence(
            ...animationRange.map((val) => withTiming(val, { duration: 150 }))
          ),
          -1,
          true
        )
      );
    } else if (isThinking) {
      // Smooth wave propagation delay across the row
      const delay = index * 90;
      height.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(36, { duration: 350 }),
            withTiming(6, { duration: 350 })
          ),
          -1,
          true
        )
      );
    } else {
      // Steady pulse
      height.value = withTiming(6, { duration: 200 });
    }
  }, [isRecording, isThinking, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      backgroundColor: isRecording || isThinking ? activeColor : primaryColor,
    };
  });

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}

export function VoiceWaveform({ isRecording = false, isThinking = false }: VoiceWaveformProps) {
  const { theme } = useTheme();

  const primaryColor = withOpacity(theme.colors.text.muted, 0.4);
  const activeColor = isRecording ? theme.colors.semantic.success : theme.colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isRecording || isThinking ? activeColor : theme.colors.border,
          backgroundColor: isRecording || isThinking
            ? withOpacity(activeColor, 0.04)
            : withOpacity(theme.colors.surface, 0.5),
        },
      ]}
    >
      <View style={styles.waveRow}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <AnimatedBar
            key={i}
            index={i}
            isRecording={isRecording}
            isThinking={isThinking}
            primaryColor={primaryColor}
            activeColor={activeColor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    width: '100%',
  },
  bar: {
    width: 6,
    minHeight: 6,
    borderRadius: 3,
  },
});
export default VoiceWaveform;
