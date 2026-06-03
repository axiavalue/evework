// ============================================
// CodeQuest — Button Component
// Premium animated button with variants
// ============================================

import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  tactile?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  tactile = true,
}: ButtonProps) {
  const { theme } = useTheme();

  const isTactile = tactile && (variant === 'primary' || variant === 'secondary' || variant === 'danger');
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const borderBottom = useSharedValue(4);

  const animatedStyle = useAnimatedStyle(() => {
    if (isTactile && !disabled && !loading) {
      return {
        transform: [{ translateY: translateY.value }],
        borderBottomWidth: borderBottom.value,
      };
    }
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = useCallback(() => {
    if (isTactile && !disabled && !loading) {
      translateY.value = withTiming(3, { duration: 60 });
      borderBottom.value = withTiming(0.5, { duration: 60 });
    } else {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    }
  }, [scale, translateY, borderBottom, isTactile, disabled, loading]);

  const handlePressOut = useCallback(() => {
    if (isTactile && !disabled && !loading) {
      translateY.value = withTiming(0, { duration: 80 });
      borderBottom.value = withTiming(4, { duration: 80 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [scale, translateY, borderBottom, isTactile, disabled, loading]);

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  }, [disabled, loading, onPress]);

  // ── Variant Styles ────────────────────────
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const c = theme.colors;

    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: c.primary,
            borderWidth: 0,
            borderBottomColor: c.primaryDark,
          },
          text: { color: '#FFFFFF' },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: withOpacity(c.primary, 0.15),
            borderWidth: 0,
            borderBottomColor: withOpacity(c.primary, 0.35),
          },
          text: { color: c.primary },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: c.border,
          },
          text: { color: c.text.primary },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: { color: c.text.secondary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: c.semantic.error,
            borderWidth: 0,
            borderBottomColor: '#B82323',
          },
          text: { color: '#FFFFFF' },
        };
    }
  };

  // ── Size Styles ───────────────────────────
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    const t = theme.typography;

    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 },
          text: { fontSize: t.sizes.sm },
        };
      case 'md':
        return {
          container: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 48 },
          text: { fontSize: t.sizes.base },
        };
      case 'lg':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 32, minHeight: 56 },
          text: { fontSize: t.sizes.md },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.container,
        { borderRadius: theme.shape.radii.md },
        isTactile && { borderBottomWidth: 4 },
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variantStyles.text.color}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              variantStyles.text,
              sizeStyles.text,
              { fontWeight: theme.typography.weights.semibold as TextStyle['fontWeight'] },
              icon ? (iconPosition === 'left' ? styles.textWithIconLeft : styles.textWithIconRight) : null,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
  textWithIconLeft: {
    marginLeft: 8,
  },
  textWithIconRight: {
    marginRight: 8,
  },
});
