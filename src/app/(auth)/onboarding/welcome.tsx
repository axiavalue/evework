// ============================================
// CodeQuest — Welcome Onboarding Screen
// 3-step feature showcase
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🎮',
    title: 'Learn by Playing',
    description:
      'Master programming through gamified lessons, earn XP, maintain streaks, and compete on leaderboards.',
  },
  {
    emoji: '⚡',
    title: 'Code Anywhere',
    description:
      'Write and run real code in 15+ languages directly in the app. No setup required — just open and code.',
  },
  {
    emoji: '🤖',
    title: 'AI Interview Coach',
    description:
      'Practice with our AI interviewer that simulates real technical interviews and gives instant feedback.',
  },
];

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/(auth)/onboarding/select-language');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/onboarding/select-language');
  };

  const slide = SLIDES[currentSlide];

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <LinearGradient
        colors={[
          withOpacity(theme.colors.primary, 0.1),
          theme.colors.background,
        ]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
        {/* Skip button */}
        <View style={styles.skipContainer}>
          {currentSlide < SLIDES.length - 1 && (
            <Button
              title="Skip"
              onPress={handleSkip}
              variant="ghost"
              size="sm"
            />
          )}
        </View>

        {/* Slide Content */}
        <Animated.View
          key={currentSlide}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={styles.slideContent}
        >
          <View
            style={[
              styles.emojiContainer,
              {
                backgroundColor: withOpacity(theme.colors.primary, 0.1),
                borderRadius: theme.shape.radii.xl,
              },
            ]}
          >
            <Text style={styles.emoji}>{slide.emoji}</Text>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.sizes['3xl'],
                fontWeight: theme.typography.weights.bold as any,
              },
            ]}
          >
            {slide.title}
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.sizes.md,
                lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
              },
            ]}
          >
            {slide.description}
          </Text>
        </Animated.View>

        {/* Pagination */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentSlide
                      ? theme.colors.primary
                      : withOpacity(theme.colors.primary, 0.2),
                  width: index === currentSlide ? 24 : 8,
                  borderRadius: 4,
                },
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title={currentSlide === SLIDES.length - 1 ? "Let's Go!" : 'Next'}
            onPress={handleNext}
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
  skipContainer: {
    alignItems: 'flex-end',
    paddingTop: 8,
    minHeight: 44,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
  },
  ctaContainer: {
    paddingBottom: 24,
  },
});
