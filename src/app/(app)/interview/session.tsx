// ============================================
// CodeQuest — Live Interview Session Screen
// Active conversation panel with timer, waveform, and typing response
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { useInterviewStore } from '@/stores/useInterviewStore';
import { VoiceWaveform } from '@/components/interview/VoiceWaveform';
import { withOpacity } from '@/lib/theme/utils';

export default function InterviewSessionScreen() {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    activeSession,
    messages,
    isRecording,
    isBotThinking,
    secondsElapsed,
    sendMessage,
    toggleRecording,
    endSession,
  } = useInterviewStore();

  const [inputVal, setInputVal] = useState('');

  // Auto scroll to bottom when messages or thinking state changes
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isBotThinking]);

  if (!activeSession) {
    return (
      <SafeScreen>
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.text.primary }}>No active session found.</Text>
          <Button title="Go Back" onPress={() => router.replace('/(app)/interview' as any)} />
        </View>
      </SafeScreen>
    );
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!inputVal.trim() || isBotThinking) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const textToSend = inputVal;
    setInputVal('');
    await sendMessage(textToSend);
  };

  const handleToggleRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isRecording) {
      toggleRecording(true);
    } else {
      toggleRecording(false);
      // Simulate Speech-to-Text translation
      const speechMockTexts = [
        "In my previous project, we had to refactor a slow SQL query. I analyzed the schema and noticed we were missing a compound index. I added it, which reduced execution time by 80%.",
        "Lists are mutable and can grow dynamically. Tuples are immutable and fixed size, which makes them faster and safer for constants.",
        "I would start by clarifying constraints like QPS, read-heavy vs write-heavy metrics, then design a database schema with index hash mapping, caching layer, and load balancer.",
        "A stack is a LIFO structure. When we see a opening bracket, we push it to the stack. When we see a closing bracket, we check if it matches the stack's top and pop.",
      ];
      const randomText = speechMockTexts[Math.floor(Math.random() * speechMockTexts.length)];
      setInputVal(randomText);
    }
  };

  const handleEndClick = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Alert.alert(
      "End Mock Interview?",
      "Are you sure you want to finish this interview? I will analyze your replies and generate your score feedback summary report.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Evaluate",
          onPress: async () => {
            const feedback = await endSession(false);
            if (feedback) {
              router.push('/(app)/interview/feedback' as any);
            }
          },
        },
      ]
    );
  };

  const currentTopicDisplay = activeSession.interview_type.toUpperCase().replace('_', ' ');

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        {/* Header bar */}
        <View style={[styles.sessionHeader, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerInfo}>
            <View style={styles.headerTitleRow}>
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.bold as any,
                }}
              >
                {activeSession.interview_type === 'behavioral' ? '🤝 Star Coach' : '🤖 AI Interviewer'}
              </Text>
              <Badge label={activeSession.difficulty} variant="primary" size="sm" />
            </View>
            <Text style={{ color: theme.colors.text.muted, fontSize: 11, marginTop: 2 }}>
              Topic: {currentTopicDisplay}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <View style={[styles.timerPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.timerText, { color: theme.colors.primary }]}>
                ⏱️ {formatTime(secondsElapsed)}
              </Text>
            </View>
            <Pressable
              onPress={handleEndClick}
              style={({ pressed }) => [
                styles.endButton,
                { backgroundColor: theme.colors.semantic.error },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Text style={styles.endButtonText}>Finish</Text>
            </Pressable>
          </View>
        </View>

        {/* Messaging Board */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <Animated.View
                entering={FadeInUp.duration(300)}
                key={msg.id}
                style={[
                  styles.msgWrapper,
                  isBot ? styles.msgBotWrapper : styles.msgUserWrapper,
                ]}
              >
                <View
                  style={[
                    styles.msgBubble,
                    isBot
                      ? {
                          backgroundColor: theme.colors.surface,
                          borderColor: theme.colors.border,
                          borderWidth: 1,
                          borderTopLeftRadius: 4,
                        }
                      : {
                          backgroundColor: theme.colors.primary,
                          borderTopRightRadius: 4,
                        },
                  ]}
                >
                  <Text
                    style={{
                      color: isBot ? theme.colors.text.primary : theme.colors.text.inverse,
                      fontSize: theme.typography.sizes.sm,
                      lineHeight: 20,
                    }}
                  >
                    {msg.content}
                  </Text>
                </View>
                <Text style={[styles.msgTime, { color: theme.colors.text.muted }]}>
                  {isBot ? 'Interviewer' : 'You'}
                </Text>
              </Animated.View>
            );
          })}

          {/* Thinking visualizer */}
          {isBotThinking && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.msgBotWrapper}>
              <View style={[styles.thinkingBubble, { backgroundColor: theme.colors.surface }]}>
                <Text style={{ color: theme.colors.text.secondary, fontSize: 12, marginBottom: 8, fontStyle: 'italic' }}>
                  AI Coach is evaluating details...
                </Text>
                <VoiceWaveform isThinking={true} />
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Tray */}
        <View style={[styles.inputTray, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
          {isRecording ? (
            <Animated.View entering={FadeIn.duration(200)} style={styles.recordingOverlay}>
              <Text style={{ color: theme.colors.semantic.success, fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>
                🔴 Recording Speech (Tap mic button to stop & translate)
              </Text>
              <VoiceWaveform isRecording={true} />
            </Animated.View>
          ) : (
            <TextInput
              value={inputVal}
              onChangeText={setInputVal}
              style={[
                styles.textInput,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.shape.radii.md,
                },
              ]}
              placeholder="Type your response here..."
              placeholderTextColor={theme.colors.text.muted}
              multiline
              maxLength={1000}
            />
          )}

          <View style={styles.trayActions}>
            <Pressable
              onPress={handleToggleRecord}
              style={({ pressed }) => [
                styles.roundButton,
                {
                  backgroundColor: isRecording
                    ? theme.colors.semantic.success
                    : withOpacity(theme.colors.text.muted, 0.15),
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={{ fontSize: 20 }}>🎙️</Text>
            </Pressable>

            {!isRecording && (
              <Pressable
                onPress={handleSend}
                disabled={!inputVal.trim() || isBotThinking}
                style={({ pressed }) => [
                  styles.sendButton,
                  {
                    backgroundColor: inputVal.trim() && !isBotThinking
                      ? theme.colors.primary
                      : withOpacity(theme.colors.primary, 0.3),
                    borderRadius: theme.shape.radii.md,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={{ color: theme.colors.text.inverse, fontWeight: 'bold', fontSize: 14 }}>
                  Send
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
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
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 99,
  },
  timerText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  endButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  endButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  msgWrapper: {
    maxWidth: '80%',
    marginBottom: 4,
  },
  msgBotWrapper: {
    alignSelf: 'flex-start',
  },
  msgUserWrapper: {
    alignSelf: 'flex-end',
  },
  msgBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  thinkingBubble: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    width: 280,
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputTray: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 14,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  recordingOverlay: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trayActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
