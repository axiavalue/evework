// ============================================
// CodeQuest — Badge Component
// For XP, streaks, leagues, and status labels
// ============================================

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'muted';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string; // emoji
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  style,
}: BadgeProps) {
  const { theme } = useTheme();

  const getColor = (): string => {
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'success': return theme.colors.semantic.success;
      case 'warning': return theme.colors.semantic.warning;
      case 'error': return theme.colors.semantic.error;
      case 'info': return theme.colors.semantic.info;
      case 'muted': return theme.colors.text.muted;
    }
  };

  const color = getColor();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { paddingH: 6, paddingV: 2, fontSize: theme.typography.sizes.xs };
      case 'md': return { paddingH: 10, paddingV: 4, fontSize: theme.typography.sizes.sm };
      case 'lg': return { paddingH: 14, paddingV: 6, fontSize: theme.typography.sizes.base };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: withOpacity(color, 0.15),
          borderRadius: theme.shape.radii.full,
          paddingHorizontal: sizeStyles.paddingH,
          paddingVertical: sizeStyles.paddingV,
        },
        style,
      ]}
    >
      {icon && <Text style={[styles.icon, { fontSize: sizeStyles.fontSize }]}>{icon}</Text>}
      <Text
        style={[
          styles.label,
          {
            color,
            fontSize: sizeStyles.fontSize,
            fontWeight: theme.typography.weights.semibold as any,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {},
});
