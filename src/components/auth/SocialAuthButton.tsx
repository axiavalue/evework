// ============================================
// CodeQuest — SocialAuthButton Component
// Google / Apple sign-in buttons
// ============================================

import React, { useCallback } from 'react';
import { Pressable, Text, View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

type SocialProvider = 'google' | 'apple' | 'github';

interface SocialAuthButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  compact?: boolean;
}

// Multi-path high-fidelity Google G Logo
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M23.49 12.275c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.48-1.12 2.74-2.38 3.59l3.62 2.82c2.12-1.95 3.81-4.83 3.81-8.54z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c4.65 0 8.56-1.54 11.41-4.17l-3.62-2.82c-1.01.68-2.3 1.09-3.79 1.09-2.92 0-5.39-1.97-6.27-4.62l-3.75 2.9A10.977 10.977 0 0012 23z"
        fill="#34A853"
      />
      <Path
        d="M5.73 12.48a6.953 6.953 0 010-4.96l-3.75-2.9A10.977 10.977 0 001.32 9.28c0 1.91.46 3.72 1.28 5.16l3.13-2z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.75 2.9c.88-2.65 3.35-4.62 6.27-4.62z"
        fill="#EA4335"
      />
    </Svg>
  );
}

// Adaptive brand Apple Logo SVG
function AppleIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-1.02 0-1.4-.62-2.58-.62-1.18 0-1.6.6-2.58.62-1.02.02-2.2-1-3.19-1.94-2.02-1.96-3.56-5.54-3.56-8.88 0-5.3 3.44-8.1 6.82-8.1 1.06 0 2.07.38 2.72.38.65 0 1.88-.46 3.16-.46 1.34 0 2.56.49 3.36 1.36-2.92 1.76-2.44 5.86.6 7.1-1.04 2.58-2.96 5.16-4.46 6.64zM12.03 4.12c.57-.69.95-1.65.84-2.61-.83.03-1.84.55-2.44 1.26-.52.6-.97 1.57-.85 2.52.92.07 1.88-.48 2.45-1.17z"
        fill={color}
      />
    </Svg>
  );
}

// Adaptive brand GitHub Logo SVG
function GitHubIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill={color}
      />
    </Svg>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SocialAuthButton({
  provider,
  onPress,
  loading = false,
  style,
  compact = false,
}: SocialAuthButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const renderIcon = () => {
    const iconColor = theme.colors.text.primary;
    const iconSize = compact ? 22 : 18;
    switch (provider) {
      case 'google':
        return <GoogleIcon size={iconSize} />;
      case 'apple':
        return <AppleIcon color={iconColor} size={iconSize} />;
      case 'github':
        return <GitHubIcon color={iconColor} size={iconSize} />;
    }
  };

  const getLabel = () => {
    switch (provider) {
      case 'google':
        return 'Continue with Google';
      case 'apple':
        return 'Continue with Apple';
      case 'github':
        return 'Continue with GitHub';
    }
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={loading}
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          borderRadius: theme.shape.radii.md,
          backgroundColor: theme.colors.surface,
        },
        compact && styles.compactContainer,
        animatedStyle,
        style,
      ]}
    >
      <View style={[styles.iconContainer, compact && { width: 24, height: 24 }]}>
        {renderIcon()}
      </View>
      {!compact && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.medium as any,
            },
          ]}
        >
          {getLabel()}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    gap: 12,
  },
  compactContainer: {
    flex: 1,
    paddingHorizontal: 0,
    height: 56,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {},
});
