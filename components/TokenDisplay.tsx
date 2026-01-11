import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import colors from '@/constants/colors';

interface TokenDisplayProps {
  variant?: 'default' | 'compact' | 'inline';
  showUpgrade?: boolean;
}

export default function TokenDisplay({ variant = 'default', showUpgrade = true }: TokenDisplayProps) {
  const { tokens, subscriptionTier } = useApp();
  const router = useRouter();

  const isLowTokens = tokens <= 2;
  const isOutOfTokens = tokens === 0;

  const handleUpgrade = () => {
    router.push('/premium');
  };

  if (variant === 'inline') {
    return (
      <View style={styles.inlineContainer}>
        <Zap 
          color={isOutOfTokens ? '#FF4444' : isLowTokens ? '#FFA500' : colors.primary} 
          size={16} 
          fill={isOutOfTokens ? '#FF4444' : isLowTokens ? '#FFA500' : colors.primary}
        />
        <Text style={[styles.inlineText, isOutOfTokens && styles.outOfTokensText]}>
          {tokens}
        </Text>
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, isLowTokens && styles.lowTokensContainer]}
        onPress={showUpgrade && isLowTokens ? handleUpgrade : undefined}
        activeOpacity={showUpgrade && isLowTokens ? 0.7 : 1}
      >
        <Zap 
          color={isOutOfTokens ? '#FF4444' : isLowTokens ? '#FFA500' : colors.primary} 
          size={18} 
          fill={isOutOfTokens ? '#FF4444' : isLowTokens ? '#FFA500' : colors.primary}
        />
        <Text style={[styles.compactTokens, isOutOfTokens && styles.outOfTokensText]}>
          {tokens}
        </Text>
        {showUpgrade && isLowTokens && (
          <Text style={styles.upgradeHint}>+</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, isLowTokens && styles.lowTokensContainer]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Zap 
            color={isOutOfTokens ? '#FF4444' : isLowTokens ? '#FFA500' : colors.primary} 
            size={20} 
            fill={isOutOfTokens ? '#FF4444' : isLowTokens ? '#FFA500' : colors.primary}
          />
          <Text style={styles.title}>Available Tokens</Text>
        </View>
        <Text style={[styles.tokenCount, isOutOfTokens && styles.outOfTokensText]}>
          {tokens}
        </Text>
      </View>

      <Text style={styles.subtitle}>
        {subscriptionTier === 'basic' && tokens === 0
          ? 'No tokens remaining. Upgrade to continue using advanced features.'
          : subscriptionTier === 'basic'
          ? `${tokens} one-time token${tokens !== 1 ? 's' : ''} remaining`
          : `Refills monthly • ${subscriptionTier === 'plus' ? '20' : '80'} tokens per month`}
      </Text>

      {showUpgrade && (subscriptionTier === 'basic' || isLowTokens) && (
        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade} activeOpacity={0.8}>
          <Text style={styles.upgradeText}>
            {subscriptionTier === 'basic' ? 'Upgrade for More Tokens' : 'View Plans'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lowTokensContainer: {
    borderColor: '#FFA500',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
  tokenCount: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  outOfTokensText: {
    color: '#FF4444',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.white,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  compactTokens: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.white,
  },
  upgradeHint: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.primary,
    marginLeft: 2,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inlineText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.white,
  },
});
