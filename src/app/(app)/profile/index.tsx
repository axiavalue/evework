// ============================================
// CodeQuest — Profile Screen
// User profile with stats and settings
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { XPCounter } from '@/components/ui/XPCounter';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { withOpacity } from '@/lib/theme/utils';
import { LEAGUES } from '@/lib/constants';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  const mockProfile = {
    displayName: profile?.display_name ?? 'CodeQuester',
    username: profile?.username ?? '@codequester',
    bio: profile?.bio ?? 'Learning to code one lesson at a time 🚀',
    avatarUrl: profile?.avatar_url ?? null,
    totalXP: profile?.total_xp ?? 1250,
    streak: profile?.current_streak ?? 7,
    longestStreak: profile?.longest_streak ?? 14,
    league: profile?.league ?? 'silver' as const,
    coursesCompleted: 0,
    lessonsCompleted: 12,
    achievementsEarned: 4,
  };

  const leagueInfo = LEAGUES[mockProfile.league];

  const MENU_ITEMS = [
    { emoji: '🎨', label: 'Theme & Appearance', desc: 'Customize colors and fonts', route: '/(app)/profile/theme' },
    { emoji: '⚙️', label: 'Settings', desc: 'Notifications, privacy, account', route: '/(app)/profile/settings' },
    { emoji: '📊', label: 'Statistics', desc: 'Detailed learning analytics', route: null },
    { emoji: '🏆', label: 'Achievements', desc: 'View all badges and rewards', route: null },
    { emoji: '📝', label: 'My Code Snippets', desc: 'Saved code from compiler', route: null },
    { emoji: '❓', label: 'Help & Support', desc: 'FAQs and contact us', route: null },
  ];

  return (
    <SafeScreen edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileHeader}>
          <Avatar
            uri={mockProfile.avatarUrl}
            name={mockProfile.displayName}
            size="xl"
            league={mockProfile.league}
            showLeagueBorder
          />
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold as any,
              marginTop: 16,
            }}
          >
            {mockProfile.displayName}
          </Text>
          <Text
            style={{
              color: theme.colors.text.muted,
              fontSize: theme.typography.sizes.sm,
              marginTop: 2,
            }}
          >
            {mockProfile.username}
          </Text>
          <Text
            style={{
              color: theme.colors.text.secondary,
              fontSize: theme.typography.sizes.base,
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            {mockProfile.bio}
          </Text>

          <Badge
            label={`${leagueInfo.name} League`}
            icon={leagueInfo.icon}
            variant="primary"
            size="md"
            style={{ marginTop: 12 }}
          />
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.statsGrid}>
            <Card variant="default" padding="md" style={styles.statCard}>
              <XPCounter xp={mockProfile.totalXP} />
            </Card>
            <Card variant="default" padding="md" style={styles.statCard}>
              <StreakBadge streak={mockProfile.streak} />
            </Card>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            {[
              { label: 'Lessons', value: mockProfile.lessonsCompleted, emoji: '📖' },
              { label: 'Longest Streak', value: `${mockProfile.longestStreak}d`, emoji: '🔥' },
              { label: 'Achievements', value: mockProfile.achievementsEarned, emoji: '🏅' },
            ].map((stat) => (
              <View key={stat.label} style={styles.quickStatItem}>
                <Text style={{ fontSize: 20 }}>{stat.emoji}</Text>
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.bold as any,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    color: theme.colors.text.muted,
                    fontSize: theme.typography.sizes.xs,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card variant="default" padding="none" style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => item.route && router.push(item.route as any)}
                style={[
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <View style={styles.menuText}>
                  <Text
                    style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.typography.sizes.base,
                      fontWeight: theme.typography.weights.medium as any,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.text.muted,
                      fontSize: theme.typography.sizes.xs,
                    }}
                  >
                    {item.desc}
                  </Text>
                </View>
                <Text style={{ color: theme.colors.text.muted, fontSize: 18 }}>›</Text>
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        {/* Sign Out */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.signOutSection}>
          <Button
            title="Sign Out"
            onPress={() => {
              signOut();
              router.replace('/(auth)/login');
            }}
            variant="outline"
            fullWidth
          />
          <Text
            style={{
              color: theme.colors.text.muted,
              fontSize: theme.typography.sizes.xs,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            CodeQuest v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  menuCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuEmoji: {
    fontSize: 22,
  },
  menuText: {
    flex: 1,
  },
  signOutSection: {
    paddingHorizontal: 20,
  },
});
