// ============================================
// CodeQuest — ProgressBar Component
// Animated progress with gradient fill
// ============================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: ProgressSize;
  showLabel?: boolean;
  animated?: boolean;
  gradientColors?: [string, string];
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  size = 'md',
  showLabel = false,
  animated = true,
  gradientColors,
  style,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const animatedProgress = useSharedValue(0);

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(clampedProgress, {
        duration: theme.motion.duration.slow,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      animatedProgress.value = clampedProgress;
    }
  }, [clampedProgress, animated, animatedProgress, theme.motion.duration.slow]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  const getHeight = (): number => {
    switch (size) {
      case 'sm': return 4;
      case 'md': return 8;
      case 'lg': return 12;
    }
  };

  const height = getHeight();
  const colors = gradientColors ?? [theme.colors.primary, theme.colors.primaryLight];

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.track,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: withOpacity(theme.colors.primary, 0.12),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            { borderRadius: height / 2 },
            fillStyle,
          ]}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, { borderRadius: height / 2 }]}
          />
        </Animated.View>
      </View>
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.secondary,
              fontSize: theme.typography.sizes.xs,
              fontWeight: theme.typography.weights.medium as any,
            },
          ]}
        >
          {Math.round(clampedProgress)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  label: {},
});
