// ============================================
// CodeQuest — App Tab Layout
// Bottom tab navigator with 5 themed tabs
// ============================================

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { withOpacity } from '@/lib/theme/utils';
import { HomeIcon, BookIcon, CodeIcon, TrophyIcon, UserIcon } from '@/components/ui/icons/SvgIcons';

function TabIcon({ icon: Icon, focused, color }: { icon: React.ComponentType<any>; focused: boolean; color: string }) {
  return (
    <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
      <Icon color={color} size={22} />
    </View>
  );
}

export default function AppLayout() {
  const { theme } = useTheme();
  const profile = useAuthStore((s) => s.profile);

  if (profile && !profile.onboarded) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.xs,
          fontWeight: theme.typography.weights.medium as any,
          marginTop: 2,
        },
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={HomeIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={BookIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compiler"
        options={{
          title: 'Code',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={CodeIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Ranks',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={TrophyIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={UserIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interview"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 28,
  },
  tabIconFocused: {},
  tabEmoji: {
    fontSize: 22,
  },
});
