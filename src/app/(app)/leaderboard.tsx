// ============================================
// CodeQuest — Leaderboard Screen
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';
import { LEAGUES } from '@/lib/constants';
import type { League } from '@/types/database';

const TABS = ['Weekly', 'Friends', 'Course'] as const;

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'AlgoQueen', xp: 4250, streak: 42, league: 'diamond' as League, isYou: false },
  { rank: 2, name: 'ByteMaster', xp: 3890, streak: 31, league: 'platinum' as League, isYou: false },
  { rank: 3, name: 'CodeNinja', xp: 3420, streak: 28, league: 'platinum' as League, isYou: false },
  { rank: 4, name: 'DevGuru_99', xp: 2980, streak: 19, league: 'gold' as League, isYou: false },
  { rank: 5, name: 'PythonPro', xp: 2750, streak: 15, league: 'gold' as League, isYou: false },
  { rank: 6, name: 'StackHero', xp: 2340, streak: 12, league: 'gold' as League, isYou: false },
  { rank: 7, name: 'BugSlayer', xp: 2100, streak: 10, league: 'silver' as League, isYou: false },
  { rank: 8, name: 'You', xp: 1250, streak: 7, league: 'silver' as League, isYou: true },
  { rank: 9, name: 'CodeNewbie', xp: 980, streak: 5, league: 'bronze' as League, isYou: false },
  { rank: 10, name: 'HelloWorld', xp: 750, streak: 3, league: 'bronze' as League, isYou: false },
];

function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}`;
}

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Weekly');

  return (
    <SafeScreen edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold as any,
            }}
          >
            Leaderboard
          </Text>
          <Text
            style={{
              color: theme.colors.text.muted,
              fontSize: theme.typography.sizes.xs,
              marginTop: 4,
            }}
          >
            Resets every Monday 00:00 UTC
          </Text>
        </View>

        {/* Tabs */}
        <View
          style={[
            styles.tabRow,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.shape.radii.lg,
            },
          ]}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? theme.colors.primary : 'transparent',
                    borderRadius: theme.shape.radii.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isActive ? '#FFFFFF' : theme.colors.text.secondary,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                  }}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Rankings */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.rankingList}
        >
          {MOCK_LEADERBOARD.map((entry, index) => (
            <Animated.View
              key={entry.rank}
              entering={FadeInDown.delay(index * 60).duration(300)}
            >
              <Card
                variant={entry.isYou ? 'elevated' : 'default'}
                padding="md"
                style={{
                  ...styles.rankCard,
                  ...(entry.isYou ? {
                    borderWidth: 1.5,
                    borderColor: theme.colors.primary,
                  } : {}),
                }}
              >
                <View style={styles.rankRow}>
                  {/* Rank */}
                  <View style={styles.rankBadge}>
                    <Text
                      style={{
                        fontSize: entry.rank <= 3 ? 22 : theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.bold as any,
                        color: entry.rank > 3 ? theme.colors.text.muted : undefined,
                      }}
                    >
                      {getRankEmoji(entry.rank)}
                    </Text>
                  </View>

                  {/* Avatar + Name */}
                  <Avatar name={entry.name} size="sm" league={entry.league} />
                  <View style={styles.nameSection}>
                    <Text
                      style={{
                        color: entry.isYou ? theme.colors.primary : theme.colors.text.primary,
                        fontSize: theme.typography.sizes.base,
                        fontWeight: (entry.isYou ? theme.typography.weights.bold : theme.typography.weights.medium) as any,
                      }}
                    >
                      {entry.name} {entry.isYou && '(You)'}
                    </Text>
                    <View style={styles.entryMeta}>
                      <Text style={{ fontSize: 12 }}>🔥 {entry.streak}</Text>
                      <Badge
                        label={LEAGUES[entry.league].name}
                        size="sm"
                        variant="muted"
                      />
                    </View>
                  </View>

                  {/* XP */}
                  <View style={styles.xpSection}>
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.bold as any,
                      }}
                    >
                      {entry.xp.toLocaleString()}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.text.muted,
                        fontSize: theme.typography.sizes.xs,
                      }}
                    >
                      XP
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 8,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rankingList: {
    paddingBottom: 32,
    gap: 8,
  },
  rankCard: {},
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 32,
    alignItems: 'center',
  },
  nameSection: {
    flex: 1,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  xpSection: {
    alignItems: 'flex-end',
  },
});
