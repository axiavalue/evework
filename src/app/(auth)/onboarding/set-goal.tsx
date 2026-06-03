// ============================================
// CodeQuest — Set Daily Goal Onboarding
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/useAppStore';
import { DAILY_GOALS } from '@/lib/constants';
import { withOpacity } from '@/lib/theme/utils';

export default function SetGoalScreen() {
  const { theme } = useTheme();
  const setDailyGoal = useAppStore((s) => s.setDailyGoal);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [selected, setSelected] = useState(15); // Default 15 min

  const handleSelect = (minutes: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(minutes);
  };

  const handleStart = () => {
    setDailyGoal(selected);
    completeOnboarding();
    router.replace('/(app)');
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes['2xl'],
                fontWeight: theme.typography.weights.bold as any,
              },
            ]}
          >
            Set your daily goal
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.text.secondary, fontSize: theme.typography.sizes.base },
            ]}
          >
            Consistency is key. How much time can you commit each day?
          </Text>
        </View>

        {/* Goal Options */}
        <View style={styles.goalGrid}>
          {DAILY_GOALS.map((goal, index) => {
            const isSelected = selected === goal.minutes;

            return (
              <Animated.View
                key={goal.minutes}
                entering={FadeInDown.delay(index * 80).duration(400)}
              >
                <Pressable
                  onPress={() => handleSelect(goal.minutes)}
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: isSelected
                        ? withOpacity(theme.colors.primary, 0.15)
                        : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: theme.shape.radii.lg,
                    },
                  ]}
                >
                  <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                  <View style={styles.goalInfo}>
                    <Text
                      style={[
                        styles.goalLabel,
                        {
                          color: theme.colors.text.primary,
                          fontSize: theme.typography.sizes.md,
                          fontWeight: theme.typography.weights.semibold as any,
                        },
                      ]}
                    >
                      {goal.label}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.text.secondary,
                        fontSize: theme.typography.sizes.sm,
                      }}
                    >
                      {goal.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: theme.colors.primary,
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    >
                      <View style={styles.radioInner} />
                    </View>
                  )}
                  {!isSelected && (
                    <View
                      style={[
                        styles.radio,
                        { borderColor: theme.colors.border, backgroundColor: 'transparent' },
                      ]}
                    />
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title="Start Learning 🚀"
            onPress={handleStart}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {},
  goalGrid: {
    gap: 10,
    flex: 1,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  goalEmoji: {
    fontSize: 28,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    marginBottom: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  ctaContainer: {
    paddingVertical: 24,
  },
});
