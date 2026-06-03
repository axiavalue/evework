// ============================================
// CodeQuest — Input Component
// Text input with floating label & validation
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helper,
  icon,
  rightIcon,
  containerStyle,
  value,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
  const inputRef = useRef<TextInput>(null);

  const labelPosition = useSharedValue(value ? 1 : 0);

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(labelPosition.value === 1 ? -24 : 0, { duration: 200 }) },
      { scale: withTiming(labelPosition.value === 1 ? 0.85 : 1, { duration: 200 }) },
    ],
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    labelPosition.value = 1;
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      labelPosition.value = 0;
    }
    onBlur?.(e);
  };

  const borderColor = error
    ? theme.colors.semantic.error
    : isFocused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderRadius: theme.shape.radii.md,
            backgroundColor: isFocused
              ? withOpacity(theme.colors.primary, 0.05)
              : theme.colors.surface,
            borderWidth: isFocused ? 1.5 : 1,
            ...(isFocused
              ? {
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 2,
                }
              : {}),
          },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}

        <View style={styles.inputWrapper}>
          <Animated.Text
            style={[
              styles.label,
              {
                color: isFocused ? theme.colors.primary : theme.colors.text.muted,
                fontSize: theme.typography.sizes.base,
              },
              labelAnimatedStyle,
            ]}
          >
            {label}
          </Animated.Text>

          <TextInput
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isSecure}
            placeholderTextColor={theme.colors.text.muted}
            style={[
              styles.input,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes.base,
              },
            ]}
            {...props}
          />
        </View>

        {secureTextEntry && (
          <Pressable
            onPress={() => setIsSecure(!isSecure)}
            style={styles.rightIcon}
          >
            {isSecure ? (
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.colors.text.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <Circle cx="12" cy="12" r="3" />
              </Svg>
            ) : (
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <Line x1="1" y1="1" x2="23" y2="23" />
              </Svg>
            )}
          </Pressable>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </Pressable>

      {(error || helper) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.semantic.error : theme.colors.text.muted,
              fontSize: theme.typography.sizes.xs,
            },
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 8,
  },
  label: {
    position: 'absolute',
    left: 0,
    top: 16,
  },
  input: {
    paddingVertical: 8,
    paddingTop: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 16,
  },
});
