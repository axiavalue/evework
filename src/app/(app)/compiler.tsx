// ============================================
// CodeQuest — Online Compiler Screen
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

const LANGUAGES = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'cpp', name: 'C++', icon: '⚙️' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'javascript', name: 'JavaScript', icon: '🌐' },
];

const DEFAULT_CODE: Record<string, string> = {
  python: '# Welcome to CodeQuest Compiler!\n# Write your Python code here\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to CodeQuest 🚀"\n\nprint(greet("World"))',
  cpp: '// Welcome to CodeQuest Compiler!\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, CodeQuest! 🚀" << endl;\n    return 0;\n}',
  java: '// Welcome to CodeQuest Compiler!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeQuest! 🚀");\n    }\n}',
  javascript: '// Welcome to CodeQuest Compiler!\nfunction greet(name) {\n    return `Hello, ${name}! Welcome to CodeQuest 🚀`;\n}\n\nconsole.log(greet("World"));',
};

export default function CompilerScreen() {
  const { theme } = useTheme();
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);

    // Simulate execution (will connect to Judge0 in Phase 1)
    setTimeout(() => {
      setOutput('Hello, World! Welcome to CodeQuest 🚀');
      setIsRunning(false);
    }, 1500);
  };

  const handleLanguageChange = (langId: string) => {
    setSelectedLang(langId);
    setCode(DEFAULT_CODE[langId] || '');
    setOutput(null);
  };

  return (
    <SafeScreen edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold as any,
            }}
          >
            Compiler
          </Text>
          <Badge label="20 runs left today" icon="⚡" variant="warning" size="sm" />
        </View>

        {/* Language Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.langRow}
        >
          {LANGUAGES.map((lang) => {
            const isActive = selectedLang === lang.id;
            return (
              <Pressable
                key={lang.id}
                onPress={() => handleLanguageChange(lang.id)}
                style={[
                  styles.langChip,
                  {
                    backgroundColor: isActive
                      ? withOpacity(theme.colors.primary, 0.15)
                      : theme.colors.surface,
                    borderColor: isActive ? theme.colors.primary : theme.colors.border,
                    borderRadius: theme.shape.radii.full,
                  },
                ]}
              >
                <Text style={styles.langChipIcon}>{lang.icon}</Text>
                <Text
                  style={{
                    color: isActive ? theme.colors.primary : theme.colors.text.secondary,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: (isActive ? theme.typography.weights.semibold : theme.typography.weights.regular) as any,
                  }}
                >
                  {lang.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Code Editor */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[
            styles.editorContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.shape.radii.lg,
            },
          ]}
        >
          <View
            style={[
              styles.editorHeader,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text
              style={{
                color: theme.colors.text.muted,
                fontSize: theme.typography.sizes.xs,
                fontWeight: theme.typography.weights.medium as any,
              }}
            >
              main.{selectedLang === 'python' ? 'py' : selectedLang === 'cpp' ? 'cpp' : selectedLang === 'java' ? 'java' : 'js'}
            </Text>
          </View>

          <TextInput
            value={code}
            onChangeText={setCode}
            multiline
            style={[
              styles.codeInput,
              {
                color: theme.colors.text.primary,
                fontSize: 13,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.text.muted}
          />
        </Animated.View>

        {/* Run Button */}
        <Button
          title={isRunning ? 'Running...' : '▶ Run Code'}
          onPress={handleRun}
          loading={isRunning}
          fullWidth
          size="lg"
        />

        {/* Output */}
        {output !== null && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Card
              variant="default"
              padding="md"
              style={{
                ...styles.outputCard,
                borderLeftColor: theme.colors.semantic.success,
                borderLeftWidth: 3,
              }}
            >
              <Text
                style={{
                  color: theme.colors.text.muted,
                  fontSize: theme.typography.sizes.xs,
                  fontWeight: theme.typography.weights.medium as any,
                  marginBottom: 8,
                }}
              >
                OUTPUT
              </Text>
              <Text
                style={{
                  color: theme.colors.semantic.success,
                  fontSize: theme.typography.sizes.sm,
                  fontFamily: 'monospace',
                }}
              >
                {output}
              </Text>
            </Card>
          </Animated.View>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  langRow: {
    gap: 8,
    paddingVertical: 4,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 6,
  },
  langChipIcon: {
    fontSize: 16,
  },
  editorContainer: {
    flex: 1,
    borderWidth: 1,
    overflow: 'hidden',
  },
  editorHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeInput: {
    flex: 1,
    padding: 12,
    fontFamily: 'monospace',
  },
  outputCard: {
    marginBottom: 16,
  },
});
