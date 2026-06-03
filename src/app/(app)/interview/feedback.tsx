// ============================================
// CodeQuest — Interview Feedback Screen
// Summarizes performance, grading scores, and study recommendations
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTheme } from '@/hooks/useTheme';
import { useInterviewStore } from '@/stores/useInterviewStore';
import { withOpacity } from '@/lib/theme/utils';

export default function InterviewFeedbackScreen() {
  const { theme } = useTheme();
  const { activeSession, resetStore } = useInterviewStore();

  const handleFinish = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetStore();
    router.replace('/(app)');
  };

  if (!activeSession || !activeSession.feedback) {
    return (
      <SafeScreen>
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.text.primary, fontSize: 16 }}>
            No feedback data available.
          </Text>
          <Button title="Go Back" onPress={() => router.replace('/(app)/interview' as any)} />
        </View>
      </SafeScreen>
    );
  }

  const fb = activeSession.feedback;
  const score = fb.overall_score;

  // Formatting duration
  const mins = fb.duration_minutes;

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.bold as any,
          }}
        >
          🏆 Performance Scorecard
        </Text>
        <Text style={{ color: theme.colors.text.secondary, fontSize: 13 }}>
          Session evaluation completed in {mins} min
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overall Score Circle */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <Card variant="elevated" padding="lg" style={styles.scoreCard}>
            <View style={styles.scoreTopRow}>
              <View
                style={[
                  styles.scoreCircle,
                  {
                    borderColor: score >= 70 ? theme.colors.semantic.success : theme.colors.primary,
                    backgroundColor: withOpacity(theme.colors.primary, 0.05),
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: 36,
                    fontWeight: '800',
                  }}
                >
                  {score}
                </Text>
                <Text style={{ color: theme.colors.text.muted, fontSize: 11 }}>out of 100</Text>
              </View>

              <View style={styles.scoreSummaryText}>
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.bold as any,
                  }}
                >
                  {score >= 80 ? 'Excellent! 🚀' : score >= 60 ? 'Nice Effort! 👍' : 'Keep Practicing! 🎯'}
                </Text>
                <Text style={{ color: theme.colors.text.secondary, fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                  You have successfully completed the mock session and earned bonus learning points.
                </Text>
                <View
                  style={[
                    styles.xpRewardPill,
                    {
                      backgroundColor: withOpacity(theme.colors.semantic.success, 0.12),
                      borderRadius: theme.shape.radii.full,
                    },
                  ]}
                >
                  <Text style={{ color: theme.colors.semantic.success, fontWeight: 'bold', fontSize: 12 }}>
                    🎉 +50 XP Awarded
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Section Ratings */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            Performance Areas
          </Text>

          <View style={styles.categoriesContainer}>
            {Object.entries(fb.sections).map(([key, value]) => {
              const label = key.toUpperCase().replace('_', ' ');
              const ratingVal = value.score; // 1-5
              const percentage = (ratingVal / 5) * 100;

              return (
                <Card key={key} variant="default" padding="md" style={styles.ratingCard}>
                  <View style={styles.ratingHeader}>
                    <Text
                      style={{
                        color: theme.colors.text.primary,
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: theme.typography.weights.semibold as any,
                      }}
                    >
                      {label}
                    </Text>
                    <Badge label={`${ratingVal}/5`} variant={ratingVal >= 4 ? 'success' : 'primary'} size="sm" />
                  </View>
                  <ProgressBar progress={percentage} size="sm" />
                  <Text style={{ color: theme.colors.text.secondary, fontSize: 11, marginTop: 8, lineHeight: 16 }}>
                    {value.feedback}
                  </Text>
                </Card>
              );
            })}
          </View>
        </Animated.View>

        {/* Strengths & Improvements */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card variant="default" padding="lg" style={styles.breakdownCard}>
            <Text
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.bold as any,
                marginBottom: 12,
              }}
            >
              Key Takeaways
            </Text>

            {/* Strengths */}
            <Text style={[styles.subSectionHeader, { color: theme.colors.semantic.success }]}>
              ✓ Key Strengths
            </Text>
            {fb.strengths.map((str, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={{ color: theme.colors.semantic.success, marginRight: 6 }}>•</Text>
                <Text style={{ color: theme.colors.text.secondary, fontSize: 12, flex: 1, lineHeight: 18 }}>
                  {str}
                </Text>
              </View>
            ))}

            {/* Improvements */}
            <Text style={[styles.subSectionHeader, { color: theme.colors.semantic.warning, marginTop: 16 }]}>
              ⚠ Recommendations
            </Text>
            {fb.improvements.map((imp, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={{ color: theme.colors.semantic.warning, marginRight: 6 }}>•</Text>
                <Text style={{ color: theme.colors.text.secondary, fontSize: 12, flex: 1, lineHeight: 18 }}>
                  {imp}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Recommended Study Topics */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            Recommended Study Topics
          </Text>
          <View style={styles.topicsRow}>
            {fb.recommended_topics.map((topic, idx) => (
              <View
                key={idx}
                style={[
                  styles.topicTag,
                  {
                    backgroundColor: withOpacity(theme.colors.primary, 0.08),
                    borderColor: theme.colors.primary,
                    borderRadius: theme.shape.radii.sm,
                  },
                ]}
              >
                <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: '600' }}>
                  📖 {topic}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.actionRow}>
          <Button title="Back to Dashboard" onPress={handleFinish} fullWidth size="lg" />
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scoreCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  scoreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreSummaryText: {
    flex: 1,
    gap: 2,
  },
  xpRewardPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  ratingCard: {
    gap: 8,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  subSectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
  },
  topicTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  actionRow: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
});
