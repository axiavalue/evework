// ============================================
// CodeQuest — Interactive Onboarding Setup
// Customizes profiles, templates, study target
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import LottieView from 'lottie-react-native';
import { MascotWidget } from '@/components/ui/MascotWidget';
import { ConfettiPop } from '@/components/ui/ConfettiPop';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { withOpacity } from '@/lib/theme/utils';
import {
  SnakeIcon,
  GearIcon,
  CoffeeIcon,
  GlobeIcon,
  RobotIcon,
  StarIcon,
} from '@/components/ui/icons/SvgIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Step = 'name' | 'age' | 'template' | 'goal';
type AgeCategory = 'kid' | 'teen' | 'adult';
type ThemeTemplate = 'boyish' | 'girly';
type StudyGoal = 'python' | 'cpp' | 'java' | 'javascript';

export default function OnboardingScreen() {
  const { theme, setTemplate } = useTheme();
  const { profile, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('teen');
  const [selectedTemplate, setSelectedTemplate] = useState<ThemeTemplate>('boyish');
  const [studyGoal, setStudyGoal] = useState<StudyGoal>('python');

  const [showConfetti, setShowConfetti] = useState(false);

  // Navigation Steps Array
  const steps: Step[] = ['name', 'age', 'template', 'goal'];
  const currentIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (currentStep === 'name' && !displayName.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      setShowConfetti(true);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    try {
      // 1. Apply visual template preset in Context (forces reload of colors, radius, fonts)
      setTemplate(selectedTemplate);

      // 2. Persist onboarding parameters to database profile
      await updateProfile({
        display_name: displayName,
        onboarded: true,
        age_category: ageCategory,
        theme_template: selectedTemplate,
        favorite_language: studyGoal,
      });

      // 3. Navigate directly to app tabs
      router.replace('/(app)');
    } catch (e) {
      console.error('Failed to complete onboarding:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Render Helpers ────────────────────────
  const renderMascotBubble = (text: string) => (
    <View style={styles.mascotRow}>
      <LottieView
        source={require('../../assets/animations/book_greeting_lottie.json')}
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
        resizeMode="contain"
      />
      <View
        style={[
          styles.speechBubble,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={[styles.bubbleArrow, { borderRightColor: theme.colors.border }]} />
        <View style={[styles.bubbleArrowInner, { borderRightColor: theme.colors.surface }]} />
        <Text style={[styles.speechText, { color: theme.colors.text.primary }]}>
          {text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeScreen edges={['top', 'bottom']} style={{ backgroundColor: theme.colors.background }}>
      <LinearGradient
        colors={[withOpacity(theme.colors.primary, 0.1), 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Progress Line */}
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
        <Animated.View
          layout={Layout.springify()}
          style={[
            styles.progressBar,
            {
              backgroundColor: theme.colors.primary,
              width: `${((currentIndex + 1) / steps.length) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step Content */}
        {currentStep === 'name' && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            {renderMascotBubble(
              "Hi there! I'm Codey, your companion coding guide. First things first, what should I call you?"
            )}

            <Card variant="default" padding="lg" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>
                YOUR DISPLAY NAME
              </Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name..."
                placeholderTextColor={theme.colors.text.muted}
                style={[
                  styles.textInput,
                  {
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border,
                    backgroundColor: withOpacity(theme.colors.surfaceElevated, 0.5),
                  },
                ]}
                maxLength={20}
              />
            </Card>
          </Animated.View>
        )}

        {currentStep === 'age' && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            {renderMascotBubble(
              "Awesome! Which age bracket represents you? This customizes the difficulty of your coding tests."
            )}

            <View style={styles.optionsGrid}>
              {[
                { id: 'kid', label: '🐣 Kid / Student', desc: 'Under 13 years old. Gamified quizzes.' },
                { id: 'teen', label: '🎒 Teenager', desc: '13 to 18 years old. Structured challenges.' },
                { id: 'adult', label: '💼 Adult / Professional', desc: '18+ years old. Practical compiler coding.' },
              ].map((item) => {
                const isSelected = ageCategory === item.id;
                return (
                  <Card
                    key={item.id}
                    variant="default"
                    pressable
                    onPress={() => setAgeCategory(item.id as AgeCategory)}
                    style={{
                      ...styles.selectableCard,
                      ...(isSelected ? { borderColor: theme.colors.primary, borderWidth: 2 } : {}),
                    }}
                  >
                    <View style={styles.selectionIndicator}>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: isSelected ? theme.colors.primary : theme.colors.border },
                        ]}
                      >
                        {isSelected && (
                          <View
                            style={[styles.radioInner, { backgroundColor: theme.colors.primary }]}
                          />
                        )}
                      </View>
                      <View style={styles.selectionText}>
                        <Text style={[styles.optionLabel, { color: theme.colors.text.primary }]}>
                          {item.label}
                        </Text>
                        <Text style={[styles.optionDesc, { color: theme.colors.text.secondary }]}>
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          </Animated.View>
        )}

        {currentStep === 'template' && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            {renderMascotBubble(
              "Now, pick your theme template layout! This styles your menus, buttons, and companion mascot!"
            )}

            <View style={styles.templatesContainer}>
              {/* Boyish / Classic Cyberpunk Card */}
              <Card
                variant="default"
                pressable
                onPress={() => setSelectedTemplate('boyish')}
                style={{
                  ...styles.templateCard,
                  backgroundColor: '#0B0B1E',
                  ...(selectedTemplate === 'boyish' ? { borderColor: '#8A3FFC', borderWidth: 2 } : {}),
                }}
              >
                <View style={styles.templateBadgeRow}>
                  <RobotIcon color="#8A3FFC" size={24} />
                  <Text style={[styles.templateTitle, { color: '#FFFFFF' }]}>Boyish / Classic</Text>
                </View>
                <Text style={styles.templateDesc}>
                  Cyberpunk dark theme with vibrant neon highlights. Tactile borders and Codey the robot.
                </Text>
                <View style={styles.templatePreview}>
                  <View style={[styles.previewBar, { backgroundColor: '#8A3FFC', width: '70%' }]} />
                  <View style={[styles.previewPill, { backgroundColor: '#13132B' }]}>
                    <Text style={{ color: '#FFFFFF', fontSize: 10 }}>[x] Code Compiles</Text>
                  </View>
                </View>
              </Card>

              {/* Girly / Cherry Blossom Card */}
              <Card
                variant="default"
                pressable
                onPress={() => setSelectedTemplate('girly')}
                style={{
                  ...styles.templateCard,
                  backgroundColor: '#FFF5F7',
                  borderColor: '#FFD6E0',
                  ...(selectedTemplate === 'girly' ? { borderColor: '#FF6B8B', borderWidth: 2 } : {}),
                }}
              >
                <View style={styles.templateBadgeRow}>
                  <StarIcon color="#FF6B8B" size={24} />
                  <Text style={[styles.templateTitle, { color: '#4A1525' }]}>Girly / Pastel</Text>
                </View>
                <Text style={[styles.templateDesc, { color: '#9A5A6C' }]}>
                  Cute cotton candy pink tones, bubblegum round shapes, Poppins font, and a cheering bunny.
                </Text>
                <View style={styles.templatePreview}>
                  <View style={[styles.previewBar, { backgroundColor: '#FF6B8B', width: '75%' }]} />
                  <View style={[styles.previewPill, { backgroundColor: '#FFFFFF', borderColor: '#FFD6E0', borderWidth: 1 }]}>
                    <Text style={{ color: '#FF6B8B', fontSize: 10 }}>🌸 Kawaii Active</Text>
                  </View>
                </View>
              </Card>
            </View>
          </Animated.View>
        )}

        {currentStep === 'goal' && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            {renderMascotBubble(
              "Last step! Which programming language do you want to learn first? We'll load this path."
            )}

            <View style={styles.languagesGrid}>
              {[
                { id: 'python', label: 'Python', color: '#3776AB', icon: SnakeIcon },
                { id: 'cpp', label: 'C++', color: '#00599C', icon: GearIcon },
                { id: 'java', label: 'Java', color: '#ED8B00', icon: CoffeeIcon },
                { id: 'javascript', label: 'JavaScript', color: '#F7DF1E', icon: GlobeIcon },
              ].map((item) => {
                const isSelected = studyGoal === item.id;
                const IconComp = item.icon;
                return (
                  <Card
                    key={item.id}
                    variant="default"
                    pressable
                    onPress={() => setStudyGoal(item.id as StudyGoal)}
                    style={{
                      ...styles.langSelectCard,
                      ...(isSelected ? { borderColor: item.color, borderWidth: 2 } : {}),
                    }}
                  >
                    <View style={styles.langItemRow}>
                      <View style={[styles.langIconWrapper, { backgroundColor: withOpacity(item.color, 0.12) }]}>
                        <IconComp color={item.color} size={32} />
                      </View>
                      <View style={styles.langTextWrapper}>
                        <Text style={[styles.langLabel, { color: theme.colors.text.primary }]}>
                          {item.label}
                        </Text>
                        {isSelected && (
                          <Text style={{ color: item.color, fontSize: 11, fontWeight: '800', marginTop: 2 }}>
                            RECOMMENDED START PATH
                          </Text>
                        )}
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Button footer Navigation */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        {currentIndex > 0 ? (
          <Button
            title="BACK"
            variant="outline"
            onPress={handleBack}
            style={styles.backBtn}
            disabled={loading}
          />
        ) : null}
        
        <Button
          title={currentIndex === steps.length - 1 ? "BUILD MY APP!" : "CONTINUE"}
          variant="primary"
          tactile
          onPress={handleNext}
          loading={loading}
          style={styles.nextBtn}
        />
      </View>
      <ConfettiPop active={showConfetti} onComplete={handleComplete} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 6,
    width: '100%',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
    gap: 24,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speechBubble: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: 'relative',
  },
  bubbleArrow: {
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
  bubbleArrowInner: {
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
  inputCard: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  optionsGrid: {
    gap: 12,
  },
  selectableCard: {
    borderWidth: 1.5,
  },
  selectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  templatesContainer: {
    gap: 16,
  },
  templateCard: {
    borderWidth: 1.5,
    paddingVertical: 18,
  },
  templateBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  templateDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: '#A1A1B5',
    marginBottom: 12,
  },
  templatePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  previewBar: {
    height: 8,
    borderRadius: 4,
  },
  previewPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  languagesGrid: {
    gap: 12,
  },
  langSelectCard: {
    borderWidth: 1.5,
  },
  langItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langTextWrapper: {
    flex: 1,
  },
  langLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1.5,
    gap: 12,
  },
  backBtn: {
    flex: 0.35,
  },
  nextBtn: {
    flex: 1,
  },
});
