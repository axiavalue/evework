// ============================================
// CodeQuest — Profile Tab Layout
// Stack for profile sub-screens
// ============================================

import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function ProfileLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="theme" />
    </Stack>
  );
}
