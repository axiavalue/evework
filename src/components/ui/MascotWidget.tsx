// ============================================
// CodeQuest — Mascot Companion Widget
// Renders the animated companion mascot using Lottie
// ============================================

import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import { useTheme } from '@/hooks/useTheme';

interface MascotWidgetProps {
  size?: number;
  playState?: boolean;
}

export function MascotWidget({ size = 120 }: MascotWidgetProps) {
  const animationRef = useRef<LottieView>(null);
  const { theme } = useTheme();

  // Dynamically select mascot based on theme template choice!
  const mascotUri = theme.template === 'girly'
    ? 'https://lottie.host/f88d227f-2735-4309-9065-cc951c6c68a4/k8U2hU4C3r.json' // Cute pink cheering bunny
    : 'https://lottie.host/89045cb6-02a8-4822-b52b-7c385c53be9f/2rYy0aWcK4.json'; // Cute greeting robot mascot

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LottieView
        ref={animationRef}
        source={{
          uri: mascotUri,
        }}
        autoPlay
        loop
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
