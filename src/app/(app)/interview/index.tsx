// ============================================
// CodeQuest — Interview Setup Screen
// Configuration page before starting the mock session
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useInterviewStore } from '@/stores/useInterviewStore';
import { withOpacity } from '@/lib/theme/utils';
import type { InterviewType } from '@/types/database';

const INTERVIEW_TYPES = [
  { id: 'behavioral' as InterviewType, label: 'Behavioral', emoji: '🤝', desc: 'STAR technique & soft skills' },
  { id: 'technical' as InterviewType, label: 'Conceptual', emoji: '💡', desc: 'Fundamentals, logic & structures' },
  { id: 'coding' as InterviewType, label: 'Coding Test', emoji: '💻', desc: 'Algorithmic code challenges' },
  { id: 'system_design' as InterviewType, label: 'System Design', emoji: '🏗️', desc: 'Distributed architecture' },
];

const COMPANIES = [
  { id: 'google', name: 'Google', logo: '🔍' },
  { id: 'meta', name: 'Meta', logo: '♾️' },
  { id: 'amazon', name: 'Amazon', logo: '📦' },
  { id: 'apple', name: 'Apple', logo: '🍎' },
  { id: 'startup', name: 'Startup', logo: '🚀' },
];

const LANGUAGES = [
  { id: 'Python', name: 'Python', icon: '🐍' },
  { id: 'Cpp', name: 'C++', icon: '⚙️' },
  { id: 'Java', name: 'Java', icon: '☕' },
  { id: 'JavaScript', name: 'JavaScript', icon: '🌐' },
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function InterviewSetupScreen() {
  const { theme } = useTheme();
  const startSession = useInterviewStore((s) => s.startSession);

  const [type, setType] = useState<InterviewType>('behavioral');
  const [company, setCompany] = useState('google');
  const [language, setLanguage] = useState('Python');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  const handleStart = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsLoading(true);

    try {
      await startSession(language, type, difficulty, company);
      router.push('/(app)/interview/session');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const showLanguageSelector = type === 'technical' || type === 'coding';
  const showCompanySelector = type === 'behavioral';

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            pressed && { opacity: 0.7 }
          ]}
        >
          <Text style={{ color: theme.colors.text.primary, fontSize: 16 }}>← Back</Text>
        </Pressable>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.bold as any,
          }}
        >
          🤖 Mock Interview Setup
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Interview Type */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            1. Select Interview Focus
          </Text>
          <View style={styles.typeGrid}>
            {INTERVIEW_TYPES.map((item) => {
              const isActive = type === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleSelect(() => setType(item.id))}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: isActive ? withOpacity(theme.colors.primary, 0.12) : theme.colors.surface,
                      borderColor: isActive ? theme.colors.primary : theme.colors.border,
                      borderRadius: theme.shape.radii.md,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={styles.cardEmoji}>{item.emoji}</Text>
                  <Text
                    style={{
                      color: isActive ? theme.colors.primary : theme.colors.text.primary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.semibold as any,
                      marginTop: 4,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.text.muted,
                      fontSize: 10,
                      textAlign: 'center',
                      marginTop: 2,
                    }}
                  >
                    {item.desc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* 2. Company Style (only for behavioral) */}
        {showCompanySelector && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.animatedSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
              2. Target Company Style
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowSelector}>
              {COMPANIES.map((item) => {
                const isActive = company === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(() => setCompany(item.id))}
                    style={[
                      styles.pillButton,
                      {
                        backgroundColor: isActive ? withOpacity(theme.colors.primary, 0.15) : theme.colors.surface,
                        borderColor: isActive ? theme.colors.primary : theme.colors.border,
                        borderRadius: theme.shape.radii.full,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text style={styles.pillIcon}>{item.logo}</Text>
                    <Text
                      style={{
                        color: isActive ? theme.colors.primary : theme.colors.text.secondary,
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                      }}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* 2. Language Selector (only for technical and coding) */}
        {showLanguageSelector && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.animatedSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
              2. Primary Programming Language
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowSelector}>
              {LANGUAGES.map((item) => {
                const isActive = language === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(() => setLanguage(item.id))}
                    style={[
                      styles.pillButton,
                      {
                        backgroundColor: isActive ? withOpacity(theme.colors.primary, 0.15) : theme.colors.surface,
                        borderColor: isActive ? theme.colors.primary : theme.colors.border,
                        borderRadius: theme.shape.radii.full,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text style={styles.pillIcon}>{item.icon}</Text>
                    <Text
                      style={{
                        color: isActive ? theme.colors.primary : theme.colors.text.secondary,
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                      }}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* 3. Difficulty */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold as any }]}>
            3. Experience Level
          </Text>
          <View style={styles.optionRow}>
            {DIFFICULTIES.map((item) => {
              const isActive = difficulty === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => handleSelect(() => setDifficulty(item))}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isActive ? withOpacity(theme.colors.primary, 0.15) : theme.colors.surface,
                      borderColor: isActive ? theme.colors.primary : theme.colors.border,
                      borderRadius: theme.shape.radii.md,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isActive ? theme.colors.primary : theme.colors.text.secondary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Start Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.actionContainer}>
          <Card
            variant="default"
            padding="md"
            style={{ ...styles.noteCard, backgroundColor: withOpacity(theme.colors.primary, 0.05) }}
          >
            <Text style={{ color: theme.colors.text.primary, fontWeight: 'bold', fontSize: 13 }}>💡 Tips for Success:</Text>
            <Text style={{ color: theme.colors.text.secondary, fontSize: 12, marginTop: 4, lineHeight: 16 }}>
              • Speak clearly and walk through your problem solving path step-by-step.{"\n"}
              • You will receive interactive score feedback on accuracy, coding quality, and communication once complete.
            </Text>
          </Card>

          <Button
            title={isLoading ? 'Creating Session...' : '🚀 Start Mock Interview'}
            onPress={handleStart}
            loading={isLoading}
            fullWidth
            size="lg"
          />
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  typeCard: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardEmoji: {
    fontSize: 28,
  },
  animatedSection: {
    marginBottom: 16,
  },
  rowSelector: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 4,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  pillIcon: {
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  optionChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 16,
  },
  noteCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#6C63FF',
  },
});
