// ============================================
// CodeQuest — Avatar Component
// User avatar with league border & status
// ============================================

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { LEAGUES } from '@/lib/constants';
import type { League } from '@/types/database';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  league?: League;
  showLeagueBorder?: boolean;
  style?: ViewStyle;
}

export function Avatar({
  uri,
  name,
  size = 'md',
  league = 'bronze',
  showLeagueBorder = false,
  style,
}: AvatarProps) {
  const { theme } = useTheme();

  const getDimensions = (): number => {
    switch (size) {
      case 'sm': return 32;
      case 'md': return 44;
      case 'lg': return 64;
      case 'xl': return 96;
    }
  };

  const dimension = getDimensions();
  const leagueColor = LEAGUES[league]?.color ?? theme.colors.border;
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension + (showLeagueBorder ? 6 : 0),
          height: dimension + (showLeagueBorder ? 6 : 0),
          borderRadius: (dimension + 6) / 2,
          borderWidth: showLeagueBorder ? 2.5 : 0,
          borderColor: showLeagueBorder ? leagueColor : 'transparent',
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: theme.colors.surfaceElevated,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                color: theme.colors.primary,
                fontSize: dimension * 0.36,
                fontWeight: theme.typography.weights.bold as any,
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {},
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {},
});
