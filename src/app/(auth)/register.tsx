// ============================================
// CodeQuest — Register Screen
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

function SparklesIcon({ color }: { color: string }) {
  return (
    <View style={styles.sparklesContainer}>
      <LinearGradient
        colors={[withOpacity(color, 0.25), 'transparent']}
        style={styles.sparklesGlow}
      />
      <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {/* Sparkle lines */}
        <Path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <Path d="M5.636 5.636l2.828 2.828M15.536 15.536l2.828 2.828M5.636 18.364l2.828-2.828M15.536 8.464l2.828-2.828" />
        {/* Glow center */}
        <Circle cx="12" cy="12" r="3" fill={color} opacity={0.3} />
      </Svg>
    </View>
  );
}

export default function RegisterScreen() {
  const { theme } = useTheme();
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const getPasswordStrength = (): { level: number; label: string; color: string } => {
    if (!password) return { level: 0, label: '', color: 'transparent' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: theme.colors.semantic.error };
    if (password.length < 8) return { level: 2, label: 'Fair', color: theme.colors.semantic.warning };
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password))
      return { level: 3, label: 'Strong', color: theme.colors.semantic.success };
    return { level: 2, label: 'Fair', color: theme.colors.semantic.warning };
  };

  const handleRegister = async () => {
    setError(null);

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await signUpWithEmail(email, password, username);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace('/(auth)/onboarding/welcome');
    }
  };

  const strength = getPasswordStrength();

  return (
    <SafeScreen edges={['top', 'bottom']}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          withOpacity(theme.colors.primary, 0.12),
          theme.colors.background,
          theme.colors.background,
        ]}
        locations={[0, 0.35, 1]}
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
            <SparklesIcon color={theme.colors.primary} />
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.sizes['2xl'],
                  fontWeight: theme.typography.weights.bold as any,
                },
              ]}
            >
              Create your account
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.text.secondary, fontSize: theme.typography.sizes.base },
              ]}
            >
              Start your coding journey today
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
                label="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
              />

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
              />

              {/* Password Strength */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              level <= strength.level
                                ? strength.color
                                : withOpacity(theme.colors.text.muted, 0.2),
                            borderRadius: 2,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={{
                      color: strength.color,
                      fontSize: theme.typography.sizes.xs,
                      fontWeight: theme.typography.weights.medium as any,
                    }}
                  >
                    {strength.label}
                  </Text>
                </View>
              )}

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
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
                  <Text style={{ color: theme.colors.semantic.error, fontSize: theme.typography.sizes.sm }}>
                    {error}
                  </Text>
                </View>
              )}

              {/* Gradient Create Account Button */}
              <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleRegister}
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
                      Create Account
                    </Text>
                  )}
                </LinearGradient>
              </AnimatedPressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                <Text style={{ color: theme.colors.text.muted, fontSize: theme.typography.sizes.sm, marginHorizontal: 16 }}>
                  or continue with
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              </View>

              {/* Social Auth (Side-by-side layout) */}
              <View style={styles.socialButtons}>
                <SocialAuthButton
                  provider="google"
                  onPress={() => {}}
                  compact
                />
                <SocialAuthButton
                  provider="apple"
                  onPress={() => {}}
                  compact
                />
                <SocialAuthButton
                  provider="github"
                  onPress={() => {}}
                  compact
                />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={{ color: theme.colors.text.secondary, fontSize: theme.typography.sizes.base }}>
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.typography.sizes.base,
                  fontWeight: theme.typography.weights.semibold as any,
                }}
              >
                Sign In
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
  sparklesContainer: {
    marginBottom: 16,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sparklesGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: { marginBottom: 8 },
  subtitle: {},
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
  form: { gap: 4 },
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: -8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
  },
  errorContainer: {
    padding: 12,
    marginBottom: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1 },
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
});
