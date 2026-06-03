// ============================================
// CodeQuest — Winding Progress Pathway (Courses)
// Duolingo-style vertical winding path mapping
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';
import {
  LockIcon,
  CheckIcon,
  CodeIcon,
  TrophyIcon,
  TargetIcon,
  StarIcon,
  SnakeIcon,
  GearIcon,
  CoffeeIcon,
  GlobeIcon,
} from '@/components/ui/icons/SvgIcons';
import { MascotWidget } from '@/components/ui/MascotWidget';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Types ────────────────────────────────────
interface LessonNode {
  id: string;
  title: string;
  type: 'concept' | 'exercise' | 'boss';
  status: 'completed' | 'active' | 'locked';
  xp: number;
}

// ── Language Setup ───────────────────────────
const LANGUAGES = [
  { id: 'python', name: 'Python', color: '#3776AB', icon: SnakeIcon },
  { id: 'cpp', name: 'C++', color: '#00599C', icon: GearIcon },
  { id: 'java', name: 'Java', color: '#ED8B00', icon: CoffeeIcon },
  { id: 'javascript', name: 'JavaScript', color: '#F7DF1E', icon: GlobeIcon },
];

const MOCK_LEVELS: Record<string, LessonNode[]> = {
  python: [
    { id: 'p1', title: 'Variables & Data Types', type: 'concept', status: 'completed', xp: 50 },
    { id: 'p2', title: 'Basic Operators', type: 'exercise', status: 'completed', xp: 60 },
    { id: 'p3', title: 'Conditional If-Else', type: 'concept', status: 'active', xp: 50 },
    { id: 'p4', title: 'Boolean Expressions', type: 'exercise', status: 'locked', xp: 60 },
    { id: 'p5', title: 'While Loops', type: 'concept', status: 'locked', xp: 50 },
    { id: 'p6', title: 'For In Range Loops', type: 'exercise', status: 'locked', xp: 60 },
    { id: 'p7', title: 'Loop Control (Break)', type: 'concept', status: 'locked', xp: 50 },
    { id: 'p8', title: 'Nested For Loops', type: 'boss', status: 'locked', xp: 120 },
    { id: 'p9', title: 'Function Parameters', type: 'concept', status: 'locked', xp: 55 },
    { id: 'p10', title: 'Python Capstone Pro', type: 'boss', status: 'locked', xp: 180 },
  ],
  cpp: [
    { id: 'c1', title: 'C++ Syntax & IO', type: 'concept', status: 'active', xp: 50 },
    { id: 'c2', title: 'Types & Overflow', type: 'exercise', status: 'locked', xp: 60 },
    { id: 'c3', title: 'Pointers & References', type: 'concept', status: 'locked', xp: 80 },
    { id: 'c4', title: 'Memory Allocation', type: 'boss', status: 'locked', xp: 120 },
  ],
  java: [
    { id: 'j1', title: 'Classes & Objects', type: 'concept', status: 'active', xp: 50 },
    { id: 'j2', title: 'Encapsulation API', type: 'exercise', status: 'locked', xp: 60 },
    { id: 'j3', title: 'Inheritance Methods', type: 'concept', status: 'locked', xp: 80 },
    { id: 'j4', title: 'Java OOP Finalist', type: 'boss', status: 'locked', xp: 120 },
  ],
  javascript: [
    { id: 'js1', title: 'JS Async & Callbacks', type: 'concept', status: 'active', xp: 50 },
    { id: 'js2', title: 'Promises & Resolving', type: 'exercise', status: 'locked', xp: 60 },
    { id: 'js3', title: 'Async/Await System', type: 'concept', status: 'locked', xp: 80 },
    { id: 'js4', title: 'ES6 Modules Bundling', type: 'boss', status: 'locked', xp: 120 },
  ],
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CoursesScreen() {
  const { theme } = useTheme();
  const [selectedLang, setSelectedLang] = useState('python');
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const activeLangInfo = LANGUAGES.find((l) => l.id === selectedLang) || LANGUAGES[0];
  const levels = MOCK_LEVELS[selectedLang] || [];
  const darkerAccent = activeLangInfo.id === 'python' ? '#2B5B84'
    : activeLangInfo.id === 'cpp' ? '#003F6F'
    : activeLangInfo.id === 'java' ? '#B26200'
    : '#C1AD15';

  // Active node pulsating pulse animation
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, [selectedLang]);

  const activePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: withTiming(0.4),
  }));

  // Winding offset logic
  // Returns horizontal center offset for a node index
  const getNodeOffset = (index: number) => {
    // Elegant winding wave: center, left-ish, right-ish, center, etc.
    const wave = Math.sin(index * 1.1) * 65;
    return wave;
  };

  const handleNodePress = (node: LessonNode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (node.status === 'locked') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setSelectedNode(node);
    setIsModalVisible(true);
  };

  const startLesson = () => {
    setIsModalVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push({
      pathname: '/(app)/compiler',
      params: {
        lessonId: selectedNode?.id,
        lessonTitle: selectedNode?.title,
        language: selectedLang,
      },
    });
  };

  return (
    <SafeScreen edges={['top']} style={{ backgroundColor: theme.colors.background }}>
      {/* Horizontal Language Selection Header */}
      <View style={[styles.langHeader, { borderBottomColor: theme.colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.langScroll}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.id === selectedLang;
            const IconComp = lang.icon;
            return (
              <Pressable
                key={lang.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedLang(lang.id);
                }}
                style={[
                  styles.langPill,
                  {
                    backgroundColor: isSelected ? withOpacity(lang.color, 0.15) : theme.colors.surface,
                    borderColor: isSelected ? lang.color : theme.colors.border,
                  },
                ]}
              >
                <IconComp color={isSelected ? lang.color : theme.colors.text.muted} size={18} />
                <Text
                  style={[
                    styles.langText,
                    {
                      color: isSelected ? theme.colors.text.primary : theme.colors.text.secondary,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {lang.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Vertical Winding Pathway map */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mapScroll}
      >
        <View style={styles.pathwayContainer}>
          {levels.map((node, index) => {
            const currentOffset = getNodeOffset(index);
            const nextOffset = index < levels.length - 1 ? getNodeOffset(index + 1) : 0;

            const isCurrentActive = node.status === 'active';
            const isCompleted = node.status === 'completed';
            const isLocked = node.status === 'locked';

            // Coordinates for SVG lines
            const startX = SCREEN_WIDTH / 2 + currentOffset;
            const startY = 50; // local center of node within its container height
            const endX = SCREEN_WIDTH / 2 + nextOffset;
            const endY = 50 + 110; // next node center coordinate

            // Determine node theme colors
            const nodeAccent = activeLangInfo.color;

            return (
              <View key={node.id} style={styles.nodeWrapper}>
                {/* SVG connection lines behind nodes */}
                {index < levels.length - 1 && (
                  <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Svg width={SCREEN_WIDTH} height={160} style={styles.connectorSvg}>
                      <Line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={isLocked || levels[index + 1].status === 'locked' ? theme.colors.border : nodeAccent}
                        strokeWidth={5}
                        strokeDasharray="9, 7"
                        strokeLinecap="round"
                      />
                    </Svg>
                  </View>
                )}

                {/* Circular Node Button */}
                <View style={{ transform: [{ translateX: currentOffset }] }}>
                  {/* Glowing Pulse Ring for Active Node */}
                  {isCurrentActive && (
                    <Animated.View
                      style={[
                        styles.pulseCircle,
                        activePulseStyle,
                        { borderColor: nodeAccent },
                      ]}
                    />
                  )}

                  {/* Tactile 3D Circular Node Pressable */}
                  <NodeButton
                    status={node.status}
                    accent={nodeAccent}
                    darkerAccent={darkerAccent}
                    themeBorder={theme.colors.border}
                    themeMuted={theme.colors.text.muted}
                    type={node.type}
                    onPress={() => handleNodePress(node)}
                  />

                  {/* Mascot Speech Bubble pointer for Active node */}
                  {isCurrentActive && (
                    <View style={[styles.activeTagContainer, { backgroundColor: nodeAccent }]}>
                      <Text style={styles.activeTagText}>START</Text>
                      {/* Triangle pointer */}
                      <View style={[styles.activeTagArrow, { borderTopColor: nodeAccent }]} />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Lesson Details Bottom Sheet / Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setIsModalVisible(false)} />
          
          <Animated.View
            entering={FadeInDown.springify().damping(18)}
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderTopLeftRadius: theme.shape.radii.xl,
                borderTopRightRadius: theme.shape.radii.xl,
              },
            ]}
          >
            {/* Modal header with mascot */}
            <View style={styles.modalHeaderRow}>
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: theme.colors.text.primary, fontSize: theme.typography.sizes.xl },
                  ]}
                >
                  {selectedNode?.title}
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: theme.colors.text.secondary, fontSize: theme.typography.sizes.sm },
                  ]}
                >
                  {selectedNode?.type === 'boss' ? '🏆 BOSS BATTLE CHALLENGE'
                    : selectedNode?.type === 'exercise' ? '💻 PRACTICAL EXERCISE'
                    : '📖 CONCEPT EXPLANATION'}
                </Text>
              </View>
              <MascotWidget size={70} />
            </View>

            {/* Reward Summary */}
            <View style={[styles.rewardCard, { backgroundColor: withOpacity(activeLangInfo.color, 0.08) }]}>
              <StarIcon color="#FFC800" size={24} />
              <View>
                <Text style={[styles.rewardTitle, { color: theme.colors.text.primary }]}>
                  Lesson Completion Award
                </Text>
                <Text style={[styles.rewardAmount, { color: activeLangInfo.color }]}>
                  +{selectedNode?.xp} XP Points
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Button
                title="START LESSON"
                variant="primary"
                size="lg"
                tactile
                onPress={startLesson}
                style={{ backgroundColor: activeLangInfo.color, borderBottomColor: darkerAccent }}
              />
              <Button
                title="CLOSE"
                variant="ghost"
                size="md"
                onPress={() => setIsModalVisible(false)}
                style={styles.closeBtn}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

// ── NodeButton Sub-Component ─────────────────
interface NodeButtonProps {
  status: 'completed' | 'active' | 'locked';
  accent: string;
  darkerAccent: string;
  themeBorder: string;
  themeMuted: string;
  type: 'concept' | 'exercise' | 'boss';
  onPress: () => void;
}

function NodeButton({
  status,
  accent,
  darkerAccent,
  themeBorder,
  themeMuted,
  type,
  onPress,
}: NodeButtonProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const translateY = useSharedValue(0);
  const borderBottom = useSharedValue(6);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    borderBottomWidth: borderBottom.value,
  }));

  const handlePressIn = () => {
    if (!isLocked) {
      translateY.value = withTiming(4, { duration: 60 });
      borderBottom.value = withTiming(1.5, { duration: 60 });
    }
  };

  const handlePressOut = () => {
    if (!isLocked) {
      translateY.value = withTiming(0, { duration: 80 });
      borderBottom.value = withTiming(6, { duration: 80 });
    }
  };

  // Determine inner icon
  const renderIcon = () => {
    const iconColor = isLocked ? themeMuted : '#FFFFFF';
    if (isLocked) return <LockIcon color={iconColor} size={22} />;
    if (isCompleted) return <CheckIcon color="#FFFFFF" size={24} />;
    
    // Active states
    if (type === 'boss') return <TrophyIcon color="#FFD700" size={24} />;
    if (type === 'exercise') return <CodeIcon color="#FFFFFF" size={24} />;
    return <TargetIcon color="#FFFFFF" size={24} />;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={isLocked}
      style={[
        styles.nodeCircle,
        {
          backgroundColor: isLocked ? themeBorder : accent,
          borderBottomColor: isLocked ? '#444455' : darkerAccent,
        },
        buttonStyle,
      ]}
    >
      {renderIcon()}
    </AnimatedPressable>
  );
}

// ── Styles ───────────────────────────────────
const styles = StyleSheet.create({
  langHeader: {
    paddingVertical: 10,
    borderBottomWidth: 1.5,
  },
  langScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  langText: {
    fontSize: 13,
  },
  mapScroll: {
    paddingBottom: 60,
  },
  pathwayContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  nodeWrapper: {
    height: 110,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  connectorSvg: {
    position: 'absolute',
    top: 50, // aligns with starting node's center Y
    left: 0,
  },
  nodeCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 6,
  },
  pulseCircle: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    top: -8,
    left: -8,
  },
  activeTagContainer: {
    position: 'absolute',
    top: -38,
    left: -2,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activeTagText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  activeTagArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    bottom: -6,
  },
  // Modal Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    borderTopWidth: 2,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: '800',
  },
  modalSubtitle: {
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  modalActions: {
    gap: 10,
  },
  closeBtn: {
    marginTop: 4,
  },
});
