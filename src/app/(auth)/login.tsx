// ============================================
// CodeQuest — Login Screen
// Premium dark gradient design
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { Input } from '@/components/ui/Input';
import { SocialAuthButton } from '@/components/auth/SocialAuthButton';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { withOpacity } from '@/lib/theme/utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function RocketIcon({ color }: { color: string }) {
  return (
    <View style={styles.rocketContainer}>
      <LinearGradient
        colors={[withOpacity(color, 0.25), 'transparent']}
        style={styles.rocketGlow}
      />
      <Svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {/* Flame/Thruster trail */}
        <Path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" stroke="#FFA500" strokeWidth={2} />
        <Path d="M5.5 18.5c-.75.75-1.5 2-1.5 2s1.25-.5 2-1.5" stroke="#FF4500" strokeWidth={2} />
        
        {/* Rocket Main Body */}
        <Path d="M12 2C7.5 2 4 5.5 4 10c0 1.25.75 2.5 1.5 3.5S8 17 12 17s5-.5 6.5-1.5 1.5-2.25 1.5-3.5c0-4.5-3.5-8-8-8z" />
        
        {/* Rocket Fins */}
        <Path d="M9 17c0 2 1.5 4 3 4s3-2 3-4" />
        <Path d="M4 10c-1.5.5-2.5 2.5-2.5 2.5s2 .5 3-1.5" />
        <Path d="M20 10c1.5.5 2.5 2.5 2.5 2.5s-2 .5-3-1.5" />
        
        {/* Window */}
        <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={1.5} fill="rgba(255,255,255,0.1)" />
      </Svg>
    </View>
  );
}

export default function LoginScreen() {
  const { theme } = useTheme();
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ── Animation States ────────────────────────
  const glowValue = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    glowValue.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedGlow1 = useAnimatedStyle(() => {
    const scale = 1 + glowValue.value * 0.12;
    const translateX = glowValue.value * 20;
    return {
      transform: [{ scale }, { translateX }],
    };
  });

  const animatedGlow2 = useAnimatedStyle(() => {
    const scale = 1.1 - glowValue.value * 0.12;
    const translateY = glowValue.value * -15;
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace('/(app)');
    }
  };

  const handleSocialAuth = (provider: string) => {
    // TODO: Implement social auth
    console.log(`${provider} auth coming soon`);
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          withOpacity(theme.colors.primary, 0.15),
          theme.colors.background,
          theme.colors.background,
        ]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Ambient Glows */}
      <Animated.View style={[styles.glowCircle1, animatedGlow1]} pointerEvents="none">
        <LinearGradient
          colors={[withOpacity(theme.colors.primary, 0.18), 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.glowCircle2, animatedGlow2]} pointerEvents="none">
        <LinearGradient
          colors={[withOpacity(theme.colors.secondary, 0.12), 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <LottieView
              source={require('../../../assets/animations/book_greeting_lottie.json')}
              autoPlay
              loop
              style={{ width: 120, height: 120, marginBottom: 12 }}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.sizes['3xl'],
                  fontWeight: theme.typography.weights.extrabold as any,
                },
              ]}
            >
              CodeQuest
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.sizes.md,
                },
              ]}
            >
              Master coding through play
            </Text>
          </View>

          {/* Form Card (Glassmorphic Container) */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: withOpacity(theme.colors.surface, 0.45),
                borderColor: withOpacity(theme.colors.border, 0.4),
                borderRadius: theme.shape.radii.lg || 16,
              },
            ]}
          >
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />

              {error && (
                <View
                  style={[
                    styles.errorContainer,
                    {
                      backgroundColor: withOpacity(theme.colors.semantic.error, 0.1),
                      borderRadius: theme.shape.radii.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.errorText,
                      {
                        color: theme.colors.semantic.error,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {error}
                  </Text>
                </View>
              )}

              {/* Gradient Sign In Button */}
              <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
                disabled={isLoading}
                style={[styles.gradientButtonContainer, animatedButtonStyle]}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.gradientButton, { borderRadius: theme.shape.radii.md }]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.gradientButtonText,
                        {
                          color: '#FFFFFF',
                          fontSize: theme.typography.sizes.base,
                          fontWeight: theme.typography.weights.semibold as any,
                        },
                      ]}
                    >
                      Sign In
                    </Text>
                  )}
                </LinearGradient>
              </AnimatedPressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                <Text
                  style={[
                    styles.dividerText,
                    { color: theme.colors.text.muted, fontSize: theme.typography.sizes.sm },
                  ]}
                >
                  or continue with
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              </View>

              {/* Social Auth (Side-by-side layout) */}
              <View style={styles.socialButtons}>
                <SocialAuthButton
                  provider="google"
                  onPress={() => handleSocialAuth('google')}
                  compact
                />
                <SocialAuthButton
                  provider="apple"
                  onPress={() => handleSocialAuth('apple')}
                  compact
                />
                <SocialAuthButton
                  provider="github"
                  onPress={() => handleSocialAuth('github')}
                  compact
                />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.text.secondary, fontSize: theme.typography.sizes.base },
              ]}
            >
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Text
                style={StyleSheet.flatten([
                  styles.footerLink,
                  {
                    color: theme.colors.primary,
                    fontSize: theme.typography.sizes.base,
                    fontWeight: theme.typography.weights.semibold as any,
                  },
                ])}
              >
                Sign Up
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  glowCircle1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.8,
  },
  glowCircle2: {
    position: 'absolute',
    bottom: 50,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  rocketContainer: {
    marginBottom: 16,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rocketGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  card: {
    padding: 24,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 8,
  },
  form: {
    gap: 4,
  },
  gradientButtonContainer: {
    width: '100%',
    height: 56,
    marginTop: 12,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  gradientButtonText: {
    textAlign: 'center',
  },
  errorContainer: {
    padding: 12,
    marginBottom: 8,
  },
  errorText: {},
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom: 16,
  },
  footerText: {},
  footerLink: {},
});
