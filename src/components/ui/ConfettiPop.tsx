// ============================================
// CodeQuest — Confetti Celebration Pop
// Custom React Native Reanimated particle animation
// ============================================

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

interface ParticleProps {
  color: string;
  angle: number;
  distance: number;
  size: number;
  onComplete: () => void;
}

function ConfettiParticle({ color, angle, distance, size, onComplete }: ParticleProps) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Transform coordinates from angle and distance
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    x.value = withTiming(targetX, { duration: 700 });
    y.value = withTiming(targetY, { duration: 700 });

    // Scale pop-up sequence, then shrinks to zero
    scale.value = withSequence(
      withTiming(1.3, { duration: 120 }),
      withSpring(1, { damping: 6, stiffness: 120 }),
      withTiming(0, { duration: 400 }, (isFinished) => {
        if (isFinished) {
          runOnJS(onComplete)();
        }
      })
    );

    opacity.value = withSequence(
      withTiming(1, { duration: 250 }),
      withTiming(0, { duration: 450 })
    );

    rotate.value = withTiming(Math.random() * 360, { duration: 700 });
  }, [angle, distance]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: Math.random() > 0.5 ? size / 2 : 2, // Alternates between circles and squares
        },
        animatedStyle,
      ]}
    />
  );
}

interface ConfettiPopProps {
  active: boolean;
  onComplete?: () => void;
}

export function ConfettiPop({ active, onComplete }: ConfettiPopProps) {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; angle: number; distance: number; size: number }>>([]);
  const [completeCount, setCompleteCount] = useState(0);

  useEffect(() => {
    if (active) {
      setCompleteCount(0);
      const colors = ['#FFD700', '#FF6B8B', '#1CB0F6', '#76D63F', '#FF9600', '#8512FF'];
      const newParticles = Array.from({ length: 28 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        angle: (i / 28) * 2 * Math.PI + (Math.random() * 0.4 - 0.2), // Even distribution circular offset
        distance: 70 + Math.random() * 90,
        size: 7 + Math.random() * 9,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  const handleParticleComplete = () => {
    setCompleteCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (completeCount >= particles.length && particles.length > 0) {
      onComplete?.();
    }
  }, [completeCount, particles.length, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.centerContainer}>
        {particles.map((p) => (
          <ConfettiParticle
            key={p.id}
            color={p.color}
            angle={p.angle}
            distance={p.distance}
            size={p.size}
            onComplete={handleParticleComplete}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  particle: {
    position: 'absolute',
  },
});
