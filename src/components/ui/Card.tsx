// ============================================
// CodeQuest — Card Component
// Surface card with glassmorphism support
// ============================================

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  pressable?: boolean;
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'default',
  pressable = false,
  onPress,
  padding = 'md',
  style,
}: CardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (pressable) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  };

  // ── Variant Styles ────────────────────────
  const getVariantStyle = (): ViewStyle => {
    const c = theme.colors;

    switch (variant) {
      case 'default':
        return {
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.border,
        };
      case 'elevated':
        return {
          backgroundColor: c.surfaceElevated,
          borderWidth: 0,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: c.border,
        };
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    const s = theme.spacing;
    switch (padding) {
      case 'none': return { padding: 0 };
      case 'sm': return { padding: s.sm };
      case 'md': return { padding: s.base };
      case 'lg': return { padding: s.xl };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: theme.shape.radii.lg,
    overflow: 'hidden',
    ...getVariantStyle(),
    ...getPaddingStyle(),
  };

  if (pressable && onPress) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[cardStyle, animatedStyle, style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}
