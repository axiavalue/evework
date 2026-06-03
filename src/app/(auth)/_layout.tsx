// ============================================
// CodeQuest — Auth Layout
// Stack navigator for auth flow (no tabs)
// ============================================

import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding/welcome" />
      <Stack.Screen name="onboarding/select-language" />
      <Stack.Screen name="onboarding/set-goal" />
    </Stack>
  );
}
