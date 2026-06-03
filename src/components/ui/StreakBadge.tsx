// ============================================
// CodeQuest — StreakBadge Component
// Animated fire streak display
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

interface StreakBadgeProps {
  streak: number;
  compact?: boolean;
}

export function StreakBadge({ streak, compact = false }: StreakBadgeProps) {
  const { theme } = useTheme();

  const isActive = streak > 0;
  const fireColor = isActive ? '#F59E0B' : theme.colors.text.muted;

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: withOpacity(fireColor, 0.12) }]}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text
          style={[
            styles.compactCount,
            {
              color: fireColor,
              fontWeight: theme.typography.weights.bold as any,
              fontSize: theme.typography.sizes.sm,
            },
          ]}
        >
          {streak}
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
            backgroundColor: withOpacity(fireColor, 0.15),
            borderRadius: theme.shape.radii.md,
          },
        ]}
      >
        <Text style={styles.largeFireEmoji}>🔥</Text>
      </View>
      <View>
        <Text
          style={[
            styles.count,
            {
              color: theme.colors.text.primary,
              fontWeight: theme.typography.weights.bold as any,
              fontSize: theme.typography.sizes.xl,
            },
          ]}
        >
          {streak}
        </Text>
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.secondary,
              fontSize: theme.typography.sizes.xs,
            },
          ]}
        >
          day streak
        </Text>
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
  fireEmoji: {
    fontSize: 14,
  },
  largeFireEmoji: {
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
  compactCount: {},
  count: {},
  label: {},
});
