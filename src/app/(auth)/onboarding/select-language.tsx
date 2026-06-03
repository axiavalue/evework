// ============================================
// CodeQuest — Select Language Onboarding
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/useAppStore';
import { CODING_LANGUAGES } from '@/lib/constants';
import { withOpacity } from '@/lib/theme/utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SelectLanguageScreen() {
  const { theme } = useTheme();
  const setSelectedLanguage = useAppStore((s) => s.setSelectedLanguage);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (slug: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(slug);
  };

  const handleContinue = () => {
    if (selected) {
      setSelectedLanguage(selected);
      router.push('/(auth)/onboarding/set-goal');
    }
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
            What do you want to learn?
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.text.secondary, fontSize: theme.typography.sizes.base },
            ]}
          >
            You can always change this later or add more languages
          </Text>
        </View>

        {/* Language Cards */}
        <View style={styles.languageGrid}>
          {CODING_LANGUAGES.map((lang, index) => {
            const isSelected = selected === lang.slug;

            return (
              <Animated.View
                key={lang.slug}
                entering={FadeInDown.delay(index * 100).duration(400)}
              >
                <Pressable
                  onPress={() => handleSelect(lang.slug)}
                  style={[
                    styles.languageCard,
                    {
                      backgroundColor: isSelected
                        ? withOpacity(lang.color, 0.15)
                        : theme.colors.surface,
                      borderColor: isSelected ? lang.color : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: theme.shape.radii.lg,
                    },
                  ]}
                >
                  <Text style={styles.langIcon}>{lang.icon}</Text>
                  <View style={styles.langInfo}>
                    <Text
                      style={[
                        styles.langName,
                        {
                          color: theme.colors.text.primary,
                          fontSize: theme.typography.sizes.lg,
                          fontWeight: theme.typography.weights.semibold as any,
                        },
                      ]}
                    >
                      {lang.name}
                    </Text>
                    <Text
                      style={[
                        styles.langDesc,
                        {
                          color: theme.colors.text.secondary,
                          fontSize: theme.typography.sizes.sm,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {lang.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkmark,
                        { backgroundColor: lang.color, borderRadius: 999 },
                      ]}
                    >
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selected}
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
  languageGrid: {
    gap: 12,
    flex: 1,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  langIcon: {
    fontSize: 36,
  },
  langInfo: {
    flex: 1,
  },
  langName: {
    marginBottom: 4,
  },
  langDesc: {},
  checkmark: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaContainer: {
    paddingVertical: 24,
  },
});
