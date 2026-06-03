// ============================================
// CodeQuest — Settings Screen
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const { theme } = useTheme();

  const SETTINGS_SECTIONS = [
    {
      title: 'Notifications',
      items: [
        { label: 'Push Notifications', desc: 'Daily reminders and updates', type: 'switch' as const, value: true },
        { label: 'Streak Reminders', desc: 'Don\'t lose your streak!', type: 'switch' as const, value: true },
        { label: 'Leaderboard Updates', desc: 'When you move up or down', type: 'switch' as const, value: false },
      ],
    },
    {
      title: 'Learning',
      items: [
        { label: 'Sound Effects', desc: 'XP and achievement sounds', type: 'switch' as const, value: true },
        { label: 'Haptic Feedback', desc: 'Vibration on interactions', type: 'switch' as const, value: true },
        { label: 'Auto-play Theory', desc: 'Auto-advance theory cards', type: 'switch' as const, value: false },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Edit Profile', desc: 'Name, avatar, bio', type: 'nav' as const },
        { label: 'Change Password', desc: 'Update your password', type: 'nav' as const },
        { label: 'Privacy Policy', desc: 'How we handle your data', type: 'nav' as const },
        { label: 'Terms of Service', desc: 'Usage terms', type: 'nav' as const },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        { label: 'Clear Local Data', desc: 'Reset cache and preferences', type: 'action' as const, danger: true },
        { label: 'Delete Account', desc: 'Permanently remove your account', type: 'action' as const, danger: true },
      ],
    },
  ];

  return (
    <SafeScreen edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold as any,
            }}
          >
            ⚙️ Settings
          </Text>
        </View>

        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.colors.text.muted,
                  fontSize: theme.typography.sizes.xs,
                  fontWeight: theme.typography.weights.semibold as any,
                },
              ]}
            >
              {section.title.toUpperCase()}
            </Text>

            <Card variant="default" padding="none">
              {section.items.map((item, index) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.settingItem,
                    index < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.settingText}>
                    <Text
                      style={{
                        color: 'danger' in item && item.danger
                          ? theme.colors.semantic.error
                          : theme.colors.text.primary,
                        fontSize: theme.typography.sizes.base,
                        fontWeight: theme.typography.weights.medium as any,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.text.muted,
                        fontSize: theme.typography.sizes.xs,
                        marginTop: 2,
                      }}
                    >
                      {item.desc}
                    </Text>
                  </View>

                  {item.type === 'switch' && (
                    <Switch
                      value={item.value}
                      trackColor={{
                        false: theme.colors.border,
                        true: theme.colors.primary,
                      }}
                      thumbColor="#FFFFFF"
                    />
                  )}
                  {item.type === 'nav' && (
                    <Text style={{ color: theme.colors.text.muted, fontSize: 18 }}>›</Text>
                  )}
                </Pressable>
              ))}
            </Card>
          </View>
        ))}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 8,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 20,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
});
