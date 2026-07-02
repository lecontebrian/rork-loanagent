import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Apple, Chrome } from 'lucide-react-native';
import colors from '@/constants/colors';
import { ICON_SIZES, ICON_STROKE, PremiumIconContainer } from '@/components/PremiumIcon';

interface SocialAuthButtonsProps {
  type?: 'signup' | 'login';
}

export default function SocialAuthButtons({ type = 'signup' }: SocialAuthButtonsProps) {
  const handleGoogleLogin = () => {
    // In a real app, this would trigger Google Sign-In
    Alert.alert('Google Sign-In', 'This would initiate the Google Sign-In flow.');
  };

  const handleAppleLogin = () => {
    // In a real app, this would trigger Apple Sign-In
    Alert.alert('Apple Sign-In', 'This would initiate the Apple Sign-In flow.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGoogleLogin}
        activeOpacity={0.8}
      >
        <PremiumIconContainer icon={Chrome} color={colors.text} size={ICON_SIZES.action} strokeWidth={ICON_STROKE.regular} containerSize={30} radius={10} backgroundColor="rgba(255, 255, 255, 0.06)" borderColor="rgba(255, 255, 255, 0.08)" />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAppleLogin}
          activeOpacity={0.8}
        >
          <PremiumIconContainer icon={Apple} color={colors.text} size={ICON_SIZES.action} strokeWidth={ICON_STROKE.regular} containerSize={30} radius={10} backgroundColor="rgba(255, 255, 255, 0.06)" borderColor="rgba(255, 255, 255, 0.08)" />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
});
