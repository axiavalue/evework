// ============================================
// CodeQuest — Home Dashboard
// Main screen with XP, streaks, course progress
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { GamifiedHeader } from '@/components/ui/GamifiedHeader';
import { MascotWidget } from '@/components/ui/MascotWidget';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { withOpacity } from '@/lib/theme/utils';
import { LEAGUES } from '@/lib/constants';
import {
  CodeIcon,
  RobotIcon,
  TrophyIcon,
  ProjectIcon,
  SnakeIcon,
  GearIcon,
  CoffeeIcon,
  GlobeIcon,
  TargetIcon,
  FireIcon,
  StarIcon,
} from '@/components/ui/icons/SvgIcons';

function LanguageIcon({ language, size = 36 }: { language: string; size?: number }) {
  switch (language?.toLowerCase()) {
    case 'python':
      return <SnakeIcon color="#3776AB" size={size} />;
    case 'cpp':
      return <GearIcon color="#00599C" size={size} />;
    case 'java':
      return <CoffeeIcon color="#ED8B00" size={size} />;
    case 'javascript':
      return <GlobeIcon color="#F7DF1E" size={size} />;
    default:
      return <GlobeIcon color="#888899" size={size} />;
  }
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const profile = useAuthStore((s) => s.profile);

  // Resolve course details dynamically based on onboarding preferences!
  const getCourseDetails = (lang: string) => {
    switch (lang?.toLowerCase()) {
      case 'cpp':
        return {
          language: 'cpp',
          name: 'C++ Mastery',
          chapter: 'Syntax & Standard IO',
          progress: 10,
        };
      case 'java':
        return {
          language: 'java',
          name: 'Java Complete',
          chapter: 'Classes & Objects',
          progress: 15,
        };
      case 'javascript':
        return {
          language: 'javascript',
          name: 'JavaScript Pro',
          chapter: 'Async & Callbacks',
          progress: 25,
        };
      default:
        return {
          language: 'python',
          name: 'Python Basics',
          chapter: 'Loops & Iteration',
          progress: 35,
        };
    }
  };

  const activeCourse = getCourseDetails(profile?.favorite_language ?? 'python');

  // Mock data matching auth/profile attributes
  const mockData = {
    displayName: profile?.display_name ?? 'CodeQuester',
    avatarUrl: profile?.avatar_url ?? null,
    totalXP: profile?.total_xp ?? 1250,
    streak: profile?.current_streak ?? 7,
    hearts: profile?.hearts ?? 5,
    league: profile?.league ?? 'silver' as const,
    dailyProgress: 65,
    currentCourse: activeCourse,
  };

  const leagueInfo = LEAGUES[mockData.league] || { name: 'Bronze League', icon: '🏆' };

  return (
    <SafeScreen edges={['top']} style={{ backgroundColor: theme.colors.background }}>
      {/* Floating Gamified Header */}
      <GamifiedHeader
        streak={mockData.streak}
        xp={mockData.totalXP}
        hearts={mockData.hearts}
        displayName={mockData.displayName}
        avatarUrl={mockData.avatarUrl}
        league={mockData.league}
        onPressStreak={() => router.push('/(app)/leaderboard')}
        onPressXP={() => {}}
        onPressHearts={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mascot companion speech bubble */}
        <Animated.View 
          entering={FadeInDown.delay(50).duration(400)}
          style={styles.mascotContainer}
        >
          <MascotWidget size={90} />
          <View style={[styles.speechBubble, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {/* Cartoon Speech Bubble Arrow */}
            <View style={[styles.speechArrow, { borderRightColor: theme.colors.border }]} />
            <View style={[styles.speechArrowInner, { borderRightColor: theme.colors.surface }]} />
            
            <Text style={[styles.speechText, { color: theme.colors.text.primary }]}>
              Hi <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>{mockData.displayName}</Text>! Let's code some loops and keep that streak blazing! 🔥
            </Text>
          </View>
        </Animated.View>

        {/* Daily Progress Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card variant="elevated" padding="lg" style={styles.dailyCard}>
            <View style={styles.dailyHeader}>
              <View style={styles.dailyTitleRow}>
                <StarIcon color="#FFD700" size={18} />
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: '800' as any,
                    marginLeft: 6,
                  }}
                >
                  Daily Goal
                </Text>
              </View>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.bold as any,
                }}
              >
                {mockData.dailyProgress}%
              </Text>
            </View>
            <ProgressBar progress={mockData.dailyProgress} size="md" />
            <Text
              style={{
                color: theme.colors.text.muted,
                fontSize: theme.typography.sizes.xs,
                marginTop: 8,
              }}
            >
              10 of 15 minutes completed today
            </Text>
          </Card>
        </Animated.View>

        {/* Continue Learning */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes.lg,
                fontWeight: '800' as any,
              },
            ]}
          >
            Active Pathway
          </Text>

          <Card
            variant="default"
            padding="lg"
            style={styles.courseCardContainer}
          >
            <View style={styles.courseRow}>
              <View
                style={[
                  styles.courseIcon,
                  {
                    backgroundColor: withOpacity(theme.colors.primary, 0.1),
                    borderRadius: theme.shape.radii.md,
                  },
                ]}
              >
                <LanguageIcon language={mockData.currentCourse.language} size={36} />
              </View>
              <View style={styles.courseInfo}>
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: '800' as any,
                  }}
                >
                  {mockData.currentCourse.name}
                </Text>
                <Text
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.sizes.sm,
                    marginBottom: 8,
                    fontWeight: '600' as any,
                  }}
                >
                  Chapter: {mockData.currentCourse.chapter}
                </Text>
                <ProgressBar progress={mockData.currentCourse.progress} size="sm" showLabel />
              </View>
            </View>

            {/* Premium tactile button to continue path */}
            <Button
              title="CONTINUE LESSON"
              variant="primary"
              size="md"
              tactile
              onPress={() => router.push('/(app)/courses')}
              style={styles.continueButton}
            />
          </Card>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes.lg,
                fontWeight: '800' as any,
              },
            ]}
          >
            Quick Actions
          </Text>

          <View style={styles.actionsGrid}>
            {[
              { 
                icon: CodeIcon, 
                label: 'Compiler', 
                route: '/(app)/compiler',
                color: '#1CB0F6',
                bg: 'rgba(28, 176, 246, 0.1)',
              },
              { 
                icon: RobotIcon, 
                label: 'Interview', 
                route: '/(app)/interview',
                color: '#8512FF',
                bg: 'rgba(133, 18, 255, 0.1)',
              },
              { 
                icon: TrophyIcon, 
                label: 'Leaderboard', 
                route: '/(app)/leaderboard',
                color: '#FFC800',
                bg: 'rgba(255, 200, 0, 0.1)',
              },
              { 
                icon: ProjectIcon, 
                label: 'Projects', 
                route: '/(app)/courses',
                color: '#FF9600',
                bg: 'rgba(255, 150, 0, 0.1)',
              },
            ].map((action, index) => {
              const IconComp = action.icon;
              return (
                <Card
                  key={action.label}
                  variant="default"
                  pressable
                  onPress={() => router.push(action.route as any)}
                  padding="md"
                  style={{ ...styles.actionCard, borderColor: action.color }}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: action.bg }]}>
                    <IconComp color={action.color} size={30} />
                  </View>
                  <Text
                    style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: '800' as any,
                      textAlign: 'center',
                    }}
                  >
                    {action.label}
                  </Text>
                </Card>
              );
            })}
          </View>
        </Animated.View>

        {/* Achievements Preview */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes.lg,
                fontWeight: '800' as any,
              },
            ]}
          >
            Achievements
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsRow}
          >
            {[
              { icon: TargetIcon, color: '#FF4B4B', name: 'First Lesson', desc: 'Complete your first lesson' },
              { icon: FireIcon, color: '#FF9600', name: '7-Day Streak', desc: 'Learn 7 days in a row' },
              { icon: CodeIcon, color: '#1CB0F6', name: 'Code Runner', desc: 'Run 10 programs in IDE' },
              { icon: StarIcon, color: '#FFD700', name: 'Perfect Score', desc: 'Get 3 stars on a lesson' },
            ].map((achievement) => {
              const IconComp = achievement.icon;
              return (
                <Card
                  key={achievement.name}
                  variant="default"
                  padding="md"
                  style={styles.achievementCard}
                >
                  <IconComp color={achievement.color} size={36} />
                  <Text
                    style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: '800' as any,
                      textAlign: 'center',
                      marginTop: 8,
                    }}
                  >
                    {achievement.name}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.text.muted,
                      fontSize: theme.typography.sizes.xs,
                      textAlign: 'center',
                      marginTop: 4,
                      lineHeight: 14,
                    }}
                    numberOfLines={2}
                  >
                    {achievement.desc}
                  </Text>
                </Card>
              );
            })}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 16,
  },
  mascotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  speechBubble: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    position: 'relative',
  },
  speechArrow: {
    position: 'absolute',
    left: -10,
    top: '50%',
    marginTop: -8,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
  },
  speechArrowInner: {
    position: 'absolute',
    left: -8,
    top: '50%',
    marginTop: -7,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderTopColor: 'transparent',
    borderBottomWidth: 7,
    borderBottomColor: 'transparent',
    borderRightWidth: 9,
  },
  speechText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  dailyCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  courseCardContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  courseRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  courseIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseInfo: {
    flex: 1,
  },
  continueButton: {
    width: '100%',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 18,
    borderWidth: 2,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  achievementsRow: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 8,
  },
  achievementCard: {
    width: 130,
    alignItems: 'center',
    paddingVertical: 16,
  },
});
