// ============================================
// CodeQuest — Interview Sub-Layout
// Router Stack to handle the nested interview screens
// ============================================

import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function InterviewLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="session" />
      <Stack.Screen name="feedback" />
    </Stack>
  );
}
