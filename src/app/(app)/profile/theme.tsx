// ============================================
// CodeQuest — Theme Customization Screen
// Full design token customization
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ACCENT_PRESETS } from '@/lib/theme/tokens';
import { THEME_PRESETS } from '@/lib/theme/presets';
import { withOpacity } from '@/lib/theme/utils';
import type { ColorMode, BorderRadiusPreset, AnimationLevel } from '@/types/theme';

export default function ThemeScreen() {
  const {
    theme,
    preferences,
    setColorMode,
    setAccentColor,
    setBorderRadius,
    setAnimationLevel,
    applyPreset,
    resetToDefaults,
  } = useTheme();

  const handleSelect = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold as any,
            }}
          >
            🎨 Theme
          </Text>
          <Text
            style={{
              color: theme.colors.text.secondary,
              fontSize: theme.typography.sizes.base,
              marginTop: 4,
            }}
          >
            Make CodeQuest yours
          </Text>
        </View>

        {/* Color Mode */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            Color Mode
          </Text>
          <View style={styles.optionRow}>
            {([
              { mode: 'light' as ColorMode, emoji: '☀️', label: 'Light' },
              { mode: 'dark' as ColorMode, emoji: '🌙', label: 'Dark' },
              { mode: 'amoled' as ColorMode, emoji: '🖤', label: 'AMOLED' },
            ]).map(({ mode, emoji, label }) => {
              const isActive = preferences.colorMode === mode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => handleSelect(() => setColorMode(mode))}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isActive ? withOpacity(theme.colors.primary, 0.15) : theme.colors.surface,
                      borderColor: isActive ? theme.colors.primary : theme.colors.border,
                      borderRadius: theme.shape.radii.md,
                    },
                  ]}
                >
                  <Text style={styles.optionEmoji}>{emoji}</Text>
                  <Text
                    style={{
                      color: isActive ? theme.colors.primary : theme.colors.text.secondary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Accent Color */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            Accent Color
          </Text>
          <View style={styles.colorGrid}>
            {Object.entries(ACCENT_PRESETS).map(([key, { name, hex }]) => {
              const isActive = preferences.accentColor === hex;
              return (
                <Pressable
                  key={key}
                  onPress={() => handleSelect(() => setAccentColor(hex))}
                  style={[
                    styles.colorSwatch,
                    {
                      borderColor: isActive ? hex : 'transparent',
                      borderWidth: isActive ? 3 : 0,
                      borderRadius: 999,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.colorInner,
                      { backgroundColor: hex, borderRadius: 999 },
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Border Radius */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            Corner Style
          </Text>
          <View style={styles.optionRow}>
            {([
              { preset: 'sharp' as BorderRadiusPreset, label: 'Sharp', preview: 4 },
              { preset: 'rounded' as BorderRadiusPreset, label: 'Rounded', preview: 12 },
              { preset: 'pill' as BorderRadiusPreset, label: 'Pill', preview: 24 },
            ]).map(({ preset, label, preview }) => {
              const isActive = preferences.borderRadius === preset;
              return (
                <Pressable
                  key={preset}
                  onPress={() => handleSelect(() => setBorderRadius(preset))}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isActive ? withOpacity(theme.colors.primary, 0.15) : theme.colors.surface,
                      borderColor: isActive ? theme.colors.primary : theme.colors.border,
                      borderRadius: theme.shape.radii.md,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.radiusPreview,
                      {
                        borderRadius: preview,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                  <Text
                    style={{
                      color: isActive ? theme.colors.primary : theme.colors.text.secondary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Animation Level */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            Animations
          </Text>
          <View style={styles.optionRow}>
            {([
              { level: 'reduced' as AnimationLevel, emoji: '🐢', label: 'Minimal' },
              { level: 'normal' as AnimationLevel, emoji: '🐇', label: 'Normal' },
              { level: 'expressive' as AnimationLevel, emoji: '🚀', label: 'Expressive' },
            ]).map(({ level, emoji, label }) => {
              const isActive = preferences.animationLevel === level;
              return (
                <Pressable
                  key={level}
                  onPress={() => handleSelect(() => setAnimationLevel(level))}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isActive ? withOpacity(theme.colors.primary, 0.15) : theme.colors.surface,
                      borderColor: isActive ? theme.colors.primary : theme.colors.border,
                      borderRadius: theme.shape.radii.md,
                    },
                  ]}
                >
                  <Text style={styles.optionEmoji}>{emoji}</Text>
                  <Text
                    style={{
                      color: isActive ? theme.colors.primary : theme.colors.text.secondary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Presets */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            Theme Presets
          </Text>
          <View style={styles.presetGrid}>
            {THEME_PRESETS.filter((p) => !p.isPremium).map((preset) => (
              <Card
                key={preset.id}
                variant="default"
                pressable
                onPress={() => handleSelect(() => applyPreset(preset.preferences))}
                padding="md"
                style={styles.presetCard}
              >
                <View style={styles.presetColors}>
                  <View style={[styles.presetDot, { backgroundColor: preset.preview.background }]} />
                  <View style={[styles.presetDot, { backgroundColor: preset.preview.accent }]} />
                  <View style={[styles.presetDot, { backgroundColor: preset.preview.surface }]} />
                </View>
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.medium as any,
                    textAlign: 'center',
                    marginTop: 8,
                  }}
                >
                  {preset.name}
                </Text>
              </Card>
            ))}
          </View>
        </Animated.View>

        {/* Reset */}
        <View style={styles.resetSection}>
          <Button
            title="Reset to Defaults"
            onPress={resetToDefaults}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  optionChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    gap: 6,
  },
  optionEmoji: {
    fontSize: 22,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    padding: 3,
  },
  colorInner: {
    flex: 1,
  },
  radiusPreview: {
    width: 24,
    height: 24,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  presetCard: {
    width: '31%',
    alignItems: 'center',
  },
  presetColors: {
    flexDirection: 'row',
    gap: 4,
  },
  presetDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  resetSection: {
    paddingHorizontal: 20,
  },
});
