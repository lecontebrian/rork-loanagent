import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '@/constants/colors';

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
        <AntDesign name="google" size={20} color={colors.text} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAppleLogin}
          activeOpacity={0.8}
        >
          <AntDesign name="apple" size={20} color={colors.text} />
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
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
