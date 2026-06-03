// ============================================
// CodeQuest — Gamified Stats Header
// Floating header displaying Streak, XP Gems, and Hearts
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/Avatar';
import { FireIcon, HeartIcon, GemIcon } from './icons/SvgIcons';
import { withOpacity } from '@/lib/theme/utils';
import * as Haptics from 'expo-haptics';

interface GamifiedHeaderProps {
  streak: number;
  xp: number;
  hearts: number;
  displayName: string;
  avatarUrl?: string | null;
  league?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  onPressStreak?: () => void;
  onPressXP?: () => void;
  onPressHearts?: () => void;
}

export function GamifiedHeader({
  streak,
  xp,
  hearts,
  displayName,
  avatarUrl,
  league = 'silver',
  onPressStreak,
  onPressXP,
  onPressHearts,
}: GamifiedHeaderProps) {
  const { theme } = useTheme();

  const handlePress = (callback?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1.5,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <Avatar
          uri={avatarUrl}
          name={displayName}
          size="sm"
          league={league}
          showLeagueBorder
        />
        <View style={styles.userInfo}>
          <Text
            style={[
              styles.username,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.bold as any,
              },
            ]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Streak Pill */}
        <Pressable
          onPress={() => handlePress(onPressStreak)}
          style={({ pressed }) => [
            styles.statPill,
            pressed && styles.pressed,
          ]}
        >
          <FireIcon color="#FF9600" size={20} />
          <Text style={[styles.statText, { color: '#FF9600', fontWeight: '800' }]}>
            {streak}
          </Text>
        </Pressable>

        {/* Gems/XP Pill */}
        <Pressable
          onPress={() => handlePress(onPressXP)}
          style={({ pressed }) => [
            styles.statPill,
            pressed && styles.pressed,
          ]}
        >
          <GemIcon color="#1CB0F6" size={20} />
          <Text style={[styles.statText, { color: '#1CB0F6', fontWeight: '800' }]}>
            {xp}
          </Text>
        </Pressable>

        {/* Hearts Pill */}
        <Pressable
          onPress={() => handlePress(onPressHearts)}
          style={({ pressed }) => [
            styles.statPill,
            pressed && styles.pressed,
          ]}
        >
          <HeartIcon color="#FF4B4B" size={20} />
          <Text style={[styles.statText, { color: '#FF4B4B', fontWeight: '800' }]}>
            {hearts}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 0.45,
  },
  userInfo: {
    flex: 1,
  },
  username: {},
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 0.55,
    justifyContent: 'flex-end',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statText: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
