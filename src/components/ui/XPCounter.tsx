// ============================================
// CodeQuest — XPCounter Component
// Animated XP display with sparkle
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

interface XPCounterProps {
  xp: number;
  compact?: boolean;
  showLabel?: boolean;
}

export function XPCounter({ xp, compact = false, showLabel = true }: XPCounterProps) {
  const { theme } = useTheme();

  const formatXP = (value: number): string => {
    if (value >= 10000) return `${(value / 1000).toFixed(1)}k`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  if (compact) {
    return (
      <View
        style={[
          styles.compactContainer,
          { backgroundColor: withOpacity(theme.colors.primary, 0.12) },
        ]}
      >
        <Text style={styles.xpIcon}>⚡</Text>
        <Text
          style={[
            styles.compactXP,
            {
              color: theme.colors.primary,
              fontWeight: theme.typography.weights.bold as any,
              fontSize: theme.typography.sizes.sm,
            },
          ]}
        >
          {formatXP(xp)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: withOpacity(theme.colors.primary, 0.15),
            borderRadius: theme.shape.radii.md,
          },
        ]}
      >
        <Text style={styles.largeIcon}>⚡</Text>
      </View>
      <View>
        <Text
          style={[
            styles.xpValue,
            {
              color: theme.colors.text.primary,
              fontWeight: theme.typography.weights.bold as any,
              fontSize: theme.typography.sizes.xl,
            },
          ]}
        >
          {formatXP(xp)}
        </Text>
        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.sizes.xs,
              },
            ]}
          >
            total XP
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpIcon: {
    fontSize: 14,
  },
  largeIcon: {
    fontSize: 24,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  compactXP: {},
  xpValue: {},
  label: {},
});
